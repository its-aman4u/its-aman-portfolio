// Vercel Serverless Function — AI Chat Broker
// Priority chain:
//   1. Gemini 1.5 Flash (free, 1500 req/day — most generous free tier)
//   2. Gemini 2.0 Flash (fallback, lower quota)
//   3. OpenRouter (Llama 3.3 70B free model — no cost fallback)
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openrouterApiKey = process.env.OPENROUTER_API_KEY;

  // ─── Attempt 1: Gemini 1.5 Flash (most generous free tier: 1,500 req/day) ───
  if (geminiApiKey) {
    try {
      console.log('Trying Gemini 1.5 Flash...');
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            }
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) {
          console.log('Gemini 1.5 Flash succeeded');
          return res.status(200).json({ content, model: 'gemini-1.5-flash' });
        }
      }

      // Check if quota exceeded — try 2.0 Flash next
      const errMsg = data.error?.message || '';
      if (errMsg.toLowerCase().includes('quota') || response.status === 429) {
        console.warn('Gemini 1.5 Flash quota exceeded, trying 2.0 Flash...');
      } else {
        console.error('Gemini 1.5 Flash error:', data.error);
        // For non-quota errors, still try other models
      }
    } catch (err) {
      console.warn('Gemini 1.5 Flash network error:', err.message);
    }

    // ─── Attempt 2: Gemini 2.0 Flash (secondary fallback) ───
    try {
      console.log('Trying Gemini 2.0 Flash...');
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            }
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) {
          console.log('Gemini 2.0 Flash succeeded');
          return res.status(200).json({ content, model: 'gemini-2.0-flash' });
        }
      }

      const errMsg = data.error?.message || '';
      if (errMsg.toLowerCase().includes('quota') || response.status === 429) {
        console.warn('Gemini 2.0 Flash also quota exceeded, trying OpenRouter...');
      } else {
        console.error('Gemini 2.0 Flash error:', data.error);
      }
    } catch (err) {
      console.warn('Gemini 2.0 Flash network error:', err.message);
    }
  } else {
    console.warn('No GEMINI_API_KEY configured, skipping Gemini attempts');
  }

  // ─── Attempt 3: OpenRouter — Llama 3.3 70B (free, no billing required) ───
  if (openrouterApiKey) {
    try {
      console.log('Trying OpenRouter (Llama 3.3 70B free)...');
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://itsaman4u.vercel.app',
          'X-Title': 'Aman Singh Portfolio — Genesis AI',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          console.log('OpenRouter Llama 3.3 70B succeeded');
          return res.status(200).json({ content, model: 'llama-3.3-70b' });
        }
      }

      console.error('OpenRouter error:', data.error || data);
    } catch (err) {
      console.warn('OpenRouter network error:', err.message);
    }
  } else {
    console.warn('No OPENROUTER_API_KEY configured, skipping OpenRouter fallback');
  }

  // ─── All AI providers exhausted ───
  console.error('All AI providers failed or not configured');
  return res.status(429).json({ 
    error: 'All AI providers are currently unavailable or quota exhausted. The chatbot is running in local knowledge base mode.',
    quota_exceeded: true
  });
}

// Vercel Serverless Function to securely broker Gemini API queries
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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Vercel serverless function error: GEMINI_API_KEY environment variable is not defined.');
    return res.status(500).json({ error: 'Gemini API Key is not configured on the server. Please contact the administrator or add a custom key in settings.' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error details:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Failed to generate content' });
    }

    return res.status(200).json({
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated'
    });
  } catch (error) {
    console.error('Internal server error in API:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

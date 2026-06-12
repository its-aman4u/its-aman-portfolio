// Vercel Serverless Function - Genesis chat broker
// Priority chain:
//   1. Admin-selected OpenRouter model
//   2. Remaining approved OpenRouter models
//   3. Gemini fallback models
const OPENROUTER_FREE_MODELS = [
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'nex-agi/nex-n2-pro:free',
  'poolside/laguna-xs.2:free',
  'poolside/laguna-m.1:free',
  'openrouter/owl-alpha',
];

const GEMINI_FALLBACK_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
];

const DEFAULT_OPENROUTER_MODEL =
  process.env.OPENROUTER_DEFAULT_MODEL || OPENROUTER_FREE_MODELS[0];

const getOrderedOpenRouterModels = (preferredModel) => {
  const safePreferredModel = OPENROUTER_FREE_MODELS.includes(preferredModel)
    ? preferredModel
    : DEFAULT_OPENROUTER_MODEL;

  return [
    safePreferredModel,
    ...OPENROUTER_FREE_MODELS.filter((model) => model !== safePreferredModel),
  ];
};

const tryOpenRouterModel = async (model, prompt, apiKey) => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://itsaman4u.vercel.app',
      'X-Title': 'Aman Singh Portfolio - Genesis',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (response.ok && content) {
    return { content, model: `openrouter:${model}` };
  }

  console.warn(`OpenRouter model ${model} failed:`, data.error || data);
  return null;
};

const tryGeminiModel = async (model, prompt, apiKey) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (response.ok && content) {
    return { content, model };
  }

  console.warn(`Gemini model ${model} failed:`, data.error || data);
  return null;
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, openrouterModel } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const openrouterApiKey = process.env.OPENROUTER_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (openrouterApiKey) {
    for (const model of getOrderedOpenRouterModels(openrouterModel)) {
      try {
        console.log(`Trying OpenRouter (${model})...`);
        const result = await tryOpenRouterModel(model, prompt, openrouterApiKey);
        if (result) {
          return res.status(200).json(result);
        }
      } catch (error) {
        console.warn(`OpenRouter network error for ${model}:`, error.message);
      }
    }
  } else {
    console.warn('No OPENROUTER_API_KEY configured, skipping OpenRouter');
  }

  if (geminiApiKey) {
    for (const model of GEMINI_FALLBACK_MODELS) {
      try {
        console.log(`Trying Gemini fallback (${model})...`);
        const result = await tryGeminiModel(model, prompt, geminiApiKey);
        if (result) {
          return res.status(200).json(result);
        }
      } catch (error) {
        console.warn(`Gemini network error for ${model}:`, error.message);
      }
    }
  } else {
    console.warn('No GEMINI_API_KEY configured, skipping Gemini fallback');
  }

  console.error('All hosted model routes failed or are not configured');
  return res.status(429).json({
    error: 'All hosted model routes are currently unavailable. The chatbot is running in local knowledge base mode.',
    quota_exceeded: true,
  });
}

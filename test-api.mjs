// Local API tester — tests Gemini + OpenRouter
// Usage: node test-api.mjs GEMINI_KEY OPENROUTER_KEY
// Either key can be "skip" to skip that provider
// Example: node test-api.mjs AIzaSy... sk-or-v1-...
// Example (skip Gemini): node test-api.mjs skip sk-or-v1-...

const geminiKey = process.argv[2];
const openrouterKey = process.argv[3];

if (!geminiKey && !openrouterKey) {
  console.log('Usage: node test-api.mjs GEMINI_KEY OPENROUTER_KEY');
  console.log('       node test-api.mjs AIzaSy...  sk-or-v1-...');
  console.log('       node test-api.mjs skip       sk-or-v1-...   (skip Gemini)');
  console.log('       node test-api.mjs AIzaSy...  skip           (skip OpenRouter)');
  process.exit(1);
}

const testPrompt = 'Say hello in exactly one sentence.';

// ─── GEMINI TESTS ───
async function testGeminiModel(modelId, apiKey) {
  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: testPrompt }] }],
          generationConfig: { maxOutputTokens: 100 }
        })
      }
    );
    const data = await resp.json();
    if (resp.ok) {
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '(empty)';
      console.log(`  ✅ ${modelId} WORKS! → "${text.trim().substring(0,80)}"`);
      return true;
    } else {
      const code = resp.status;
      const msg = data.error?.message || 'Unknown';
      const status = data.error?.status || '';
      
      let hint = '';
      if (status === 'INVALID_ARGUMENT' && msg.includes('not valid')) hint = '→ Key is INVALID';
      else if (code === 429 || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('rate')) hint = '→ QUOTA EXCEEDED (daily limit)';
      else if (msg.toLowerCase().includes('credits') || msg.toLowerCase().includes('depleted')) hint = '→ BILLING CREDITS DEPLETED';
      else if (code === 404) hint = '→ Model name deprecated/unavailable';
      else if (code === 403) hint = '→ API key lacks permission for this model';
      
      console.log(`  ❌ ${modelId} — ${code} ${status} ${hint}`);
      if (msg.length < 150) console.log(`     ${msg}`);
      return false;
    }
  } catch (e) {
    console.log(`  ❌ ${modelId} — NETWORK ERROR: ${e.message}`);
    return false;
  }
}

// ─── OPENROUTER TESTS ───
async function testOpenRouterModel(modelId, apiKey) {
  try {
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://itsaman4u.vercel.app',
        'X-Title': 'Genesis AI Portfolio',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: testPrompt }],
        max_tokens: 100,
      })
    });
    const data = await resp.json();
    if (resp.ok) {
      const text = data.choices?.[0]?.message?.content || '(empty)';
      console.log(`  ✅ ${modelId} WORKS! → "${text.trim().substring(0,80)}"`);
      return true;
    } else {
      const code = resp.status;
      const msg = data.error?.message || JSON.stringify(data.error || data);
      let hint = '';
      if (code === 401) hint = '→ Key INVALID or missing';
      else if (code === 402) hint = '→ No credits (add credits at openrouter.ai)';
      else if (code === 429) hint = '→ RATE LIMIT hit';
      else if (code === 404) hint = '→ Model not found or not free anymore';
      console.log(`  ❌ ${modelId} — ${code} ${hint}`);
      if (msg.length < 200) console.log(`     ${msg}`);
      return false;
    }
  } catch (e) {
    console.log(`  ❌ ${modelId} — NETWORK ERROR: ${e.message}`);
    return false;
  }
}

async function main() {
  let geminiWorking = [];
  let openrouterWorking = [];

  // ─── GEMINI ───
  if (geminiKey && geminiKey !== 'skip') {
    console.log(`\n🔑 GEMINI KEY: ${geminiKey.substring(0,12)}...${geminiKey.slice(-4)}`);
    console.log('─'.repeat(60));
    console.log('Testing current Gemini models:');
    
    // Current valid model IDs (2025-2026)
    const geminiModels = [
      'gemini-2.5-flash-preview-05-20',  // Newest, may need billing
      'gemini-2.0-flash',                 // Standard
      'gemini-2.0-flash-lite',            // Lighter, more free quota
      'gemini-2.0-flash-exp',             // Experimental free
      'gemini-1.5-flash-latest',          // Updated name for 1.5
      'gemini-1.5-flash-002',             // Specific version
    ];
    
    for (const m of geminiModels) {
      const ok = await testGeminiModel(m, geminiKey);
      if (ok) geminiWorking.push(m);
    }
  } else {
    console.log('\n⏭️  Skipping Gemini tests');
  }

  // ─── OPENROUTER ───
  if (openrouterKey && openrouterKey !== 'skip') {
    console.log(`\n🔑 OPENROUTER KEY: ${openrouterKey.substring(0,15)}...${openrouterKey.slice(-4)}`);
    console.log('─'.repeat(60));
    console.log('Testing free OpenRouter models:');
    
    const orModels = [
      'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
      'nvidia/nemotron-3-ultra-550b-a55b:free',
      'nex-agi/nex-n2-pro:free',
      'poolside/laguna-xs.2:free',
      'poolside/laguna-m.1:free',
      'openrouter/owl-alpha',
    ];
    
    for (const m of orModels) {
      const ok = await testOpenRouterModel(m, openrouterKey);
      if (ok) openrouterWorking.push(m);
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 300));
    }
  } else {
    console.log('\n⏭️  Skipping OpenRouter tests');
  }

  // ─── SUMMARY ───
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(60));
  
  if (geminiWorking.length > 0) {
    console.log(`\n✅ Working Gemini models (${geminiWorking.length}):`);
    geminiWorking.forEach(m => console.log(`   → ${m}`));
    console.log(`\n💡 Use this in your Vercel function: "${geminiWorking[0]}"`);
  } else if (geminiKey && geminiKey !== 'skip') {
    console.log('\n❌ No Gemini models working with this key');
    console.log('   Most likely cause: billing credits depleted on this Google Cloud project');
    console.log('   Fix: Create a NEW key at https://aistudio.google.com/apikey in a NEW project');
  }

  if (openrouterWorking.length > 0) {
    console.log(`\n✅ Working OpenRouter models (${openrouterWorking.length}):`);
    openrouterWorking.forEach(m => console.log(`   → ${m}`));
    console.log(`\n💡 Best model to use: "${openrouterWorking[0]}"`);
  } else if (openrouterKey && openrouterKey !== 'skip') {
    console.log('\n❌ No OpenRouter models working with this key');
    console.log('   Fix: Check your key at https://openrouter.ai/keys');
  }

  if (geminiWorking.length === 0 && openrouterWorking.length === 0) {
    console.log('\n🚨 CRITICAL: No AI providers working!');
    console.log('   The chatbot will use local knowledge base only.');
    console.log('\n   RECOMMENDED FIX:');
    console.log('   1. Go to https://aistudio.google.com/apikey');
    console.log('   2. Click "Create API key in NEW project"');
    console.log('   3. Test: node test-api.mjs NEW_KEY skip');
    console.log('   4. Update GEMINI_API_KEY in Vercel and redeploy');
  }
}

main().catch(console.error);

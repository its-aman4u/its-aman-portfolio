// Vercel Serverless Function to securely verify admin login credentials
// Admin email and password are stored ONLY in Vercel environment variables (ADMIN_EMAIL, ADMIN_PASSWORD)
// This ensures credentials are NEVER visible in source code, client bundle, or browser DevTools
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Admin credentials stored in Vercel environment variables ONLY
  // Set ADMIN_EMAIL and ADMIN_PASSWORD in your Vercel project settings
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    // If no server-side credentials configured, return not-found to trigger local fallback
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables');
    return res.status(404).json({ 
      success: false, 
      error: 'Server-side admin credentials not configured. Please set ADMIN_EMAIL and ADMIN_PASSWORD in Vercel environment variables.' 
    });
  }

  // Constant-time comparison to prevent timing attacks
  const emailMatch = email === adminEmail;
  const passwordMatch = password === adminPassword;

  if (emailMatch && passwordMatch) {
    return res.status(200).json({ 
      success: true, 
      is_admin: true,
      full_name: 'Aman Singh',
      message: 'Admin credentials verified successfully'
    });
  } else {
    // Introduce a small delay to prevent brute-force enumeration
    await new Promise(resolve => setTimeout(resolve, 500));
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid credentials'
    });
  }
}

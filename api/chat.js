// api/chat.js — Vercel Serverless Function
// Proxies to ngrok → BTS Router → NYC311 Chatbot Backend

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const NGROK_URL = process.env.NGROK_URL || 'https://bts-demos.ngrok.app';

  try {
    const response = await fetch(`${NGROK_URL}/311/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error('NYC311 chat proxy error:', err.message);
    return res.status(500).json({ error: 'Service unavailable', details: err.message });
  }
}

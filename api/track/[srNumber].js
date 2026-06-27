export const config = { maxDuration: 60 };
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { srNumber } = req.query;
  const NGROK_URL = process.env.NGROK_URL || 'https://bts-demos.ngrok.app';
  try {
    const r = await fetch(`${NGROK_URL}/311/request/${srNumber}`);
    const data = await r.json();
    return res.status(r.ok ? 200 : 404).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

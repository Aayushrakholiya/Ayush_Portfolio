import { createHmac } from 'node:crypto';
import process from 'node:process';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'X-Visitor-Id');
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const visitor = req.headers['x-visitor-id'];
  if (typeof visitor !== 'string' || !uuid.test(visitor)) return res.status(400).json({ error: 'Invalid visitor identifier' });
  if (req.headers['sec-fetch-site'] === 'cross-site') return res.status(403).json({ error: 'Cross-site request rejected' });
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CONTACT_RATE_LIMIT_SECRET } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !CONTACT_RATE_LIMIT_SECRET) return res.status(503).json({ error: 'Likes temporarily unavailable' });
  // Vercel overwrites this header with the connecting client's IP. Never trust a caller-supplied forwarded-for header.
  const ip = req.headers['x-vercel-forwarded-for'] || req.socket?.remoteAddress || 'local';
  const rateKey = createHmac('sha256', CONTACT_RATE_LIMIT_SECRET).update(String(ip)).digest('hex');
  try {
    const response = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/rpc/contact_like`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        ...(!SUPABASE_SERVICE_ROLE_KEY.startsWith('sb_secret_') && { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ visitor_id: visitor.toLowerCase(), add_like: req.method === 'POST', rate_key: rateKey }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('Database request failed');
    const data = await response.json();
    if (data.limited) { res.setHeader('Retry-After', '60'); return res.status(429).json({ error: 'Please retry in a minute' }); }
    if (!Number.isSafeInteger(data.count) || typeof data.liked !== 'boolean') throw new Error('Invalid database response');
    return res.status(200).json({ count: data.count, liked: data.liked });
  } catch {
    return res.status(503).json({ error: 'Likes temporarily unavailable' });
  }
}

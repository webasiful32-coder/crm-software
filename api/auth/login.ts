import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  try {
    const sql = neon(process.env.DATABASE_URL!);

    const rows = await sql`
      SELECT * FROM users WHERE LOWER(email) = LOWER(${email.trim()})
    `;

    if (rows.length === 0)
      return res.status(404).json({ error: 'No account found with this email.' });

    const user = rows[0];

    if (user.password !== password)
      return res.status(401).json({ error: 'Incorrect password.' });

    const { password: _, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login.' });
  }
}
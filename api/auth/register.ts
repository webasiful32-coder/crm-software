import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { id, name, email, password, role, avatar, title, department, phone } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required.' });

  try {
    const sql = neon(process.env.DATABASE_URL!);

    // Table তৈরি করো যদি না থাকে
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id            TEXT PRIMARY KEY,
        name          TEXT NOT NULL,
        email         TEXT UNIQUE NOT NULL,
        password      TEXT NOT NULL,
        role          TEXT NOT NULL DEFAULT 'employee',
        avatar        TEXT,
        title         TEXT,
        department    TEXT,
        phone         TEXT,
        registered_at DATE DEFAULT CURRENT_DATE
      )
    `;

    const existing = await sql`
      SELECT id FROM users WHERE LOWER(email) = LOWER(${email.trim()})
    `;

    if (existing.length > 0)
      return res.status(409).json({ error: 'An account with this email already exists.' });

    const newId = id || `usr-${Date.now()}`;

    const result = await sql`
      INSERT INTO users (id, name, email, password, role, avatar, title, department, phone)
      VALUES (
        ${newId}, ${name.trim()}, ${email.trim().toLowerCase()}, ${password},
        ${role || 'employee'}, ${avatar || null}, ${title || null},
        ${department || null}, ${phone || null}
      )
      RETURNING id, name, email, role, avatar, title, department, phone, registered_at
    `;

    return res.status(201).json({ success: true, user: result[0] });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
}
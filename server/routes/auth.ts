import { Router, Request, Response } from 'express';
import sql from '../db';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  try {
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
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { id, name, email, password, role, avatar, title, department, phone } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required.' });

  try {
    const existing = await sql`
      SELECT id FROM users WHERE LOWER(email) = LOWER(${email.trim()})
    `;

    if (existing.length > 0)
      return res.status(409).json({ error: 'An account with this email already exists.' });

    const newId = id || `usr-${Date.now()}`;

    const result = await sql`
      INSERT INTO users (id, name, email, password, role, avatar, title, department, phone)
      VALUES (${newId}, ${name.trim()}, ${email.trim().toLowerCase()}, ${password},
              ${role || 'employee'}, ${avatar || null}, ${title || null},
              ${department || null}, ${phone || null})
      RETURNING id, name, email, role, avatar, title, department, phone, registered_at
    `;

    return res.status(201).json({ success: true, user: result[0] });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
});

export default router;
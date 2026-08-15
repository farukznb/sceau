import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-prod';

type Data = { token?: string; message?: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

  // DEMO: replace with real DB + password check (bcrypt / argon2)
  if (email === 'demo@domain.test' && password === 'demo1234') {
    const token = jwt.sign({ sub: 'demo-user', email }, JWT_SECRET, { expiresIn: '2h' });
    return res.status(200).json({ token });
  }
  return res.status(401).json({ message: 'Invalid email or password' });
}

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { users } from '../config/db';
import { JWT_SECRET } from '../config/config';

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), email, password: hashedPassword, role: 'viewer' as const, name };
  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully' });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password!))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
};

export const getUsers = (req: Request, res: Response) => {
  res.json(users.map(({ password, ...u }) => u));
};

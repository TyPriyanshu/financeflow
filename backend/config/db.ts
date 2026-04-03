import { User, Record } from '../models/types';
import bcrypt from 'bcryptjs';

export let users: User[] = [
  { id: '1', email: 'admin@example.com', password: '', role: 'admin', name: 'Admin User' },
  { id: '2', email: 'analyst@example.com', password: '', role: 'analyst', name: 'Analyst User' },
  { id: '3', email: 'viewer@example.com', password: '', role: 'viewer', name: 'Viewer User' }
];

export let records: Record[] = [
  { id: '1', userId: '1', amount: 5000, type: 'income', category: 'Salary', date: '2026-03-01', notes: 'Monthly salary' },
  { id: '2', userId: '1', amount: 150, type: 'expense', category: 'Food', date: '2026-03-02', notes: 'Grocery shopping' },
  { id: '3', userId: '1', amount: 1200, type: 'expense', category: 'Rent', date: '2026-03-05', notes: 'March rent' },
  { id: '4', userId: '1', amount: 200, type: 'expense', category: 'Utilities', date: '2026-03-10', notes: 'Electricity bill' },
  { id: '5', userId: '1', amount: 300, type: 'income', category: 'Freelance', date: '2026-03-15', notes: 'Logo design' },
];

(async () => {
  users[0].password = await bcrypt.hash('admin123', 10);
  users[1].password = await bcrypt.hash('analyst123', 10);
  users[2].password = await bcrypt.hash('viewer123', 10);
})();

export interface User {
  id: string;
  email: string;
  password?: string;
  role: 'admin' | 'analyst' | 'viewer';
  name: string;
}

export interface Record {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes: string;
}

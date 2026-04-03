import { Request, Response } from 'express';
import { records } from '../config/db';

export const getRecords = (req: any, res: Response) => {
  if (req.user.role === 'viewer') {
    return res.status(403).json({ message: 'Viewers can only access the dashboard' });
  }
  
  let filteredRecords = [...records];
  const { type, category, startDate, endDate } = req.query;

  if (type) filteredRecords = filteredRecords.filter(r => r.type === type);
  if (category) filteredRecords = filteredRecords.filter(r => r.category === category);
  if (startDate) filteredRecords = filteredRecords.filter(r => r.date >= startDate);
  if (endDate) filteredRecords = filteredRecords.filter(r => r.date <= endDate);

  res.json(filteredRecords);
};

export const createRecord = (req: any, res: Response) => {
  const newRecord = { id: Date.now().toString(), ...req.body };
  records.push(newRecord);
  res.status(201).json(newRecord);
};

export const updateRecord = (req: Request, res: Response) => {
  const index = records.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Record not found' });
  const updated = { ...records[index], ...req.body };
  records[index] = updated;
  res.json(updated);
};

export const deleteRecord = (req: Request, res: Response) => {
  const index = records.findIndex(r => r.id === req.params.id);
  if (index !== -1) records.splice(index, 1);
  res.status(204).send();
};

export const getDashboardStats = (req: any, res: Response) => {
  const totalIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const categorySummary = records.reduce((acc: any, r) => {
    acc[r.category] = (acc[r.category] || 0) + r.amount;
    return acc;
  }, {});

  const recentTransactions = [...records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  res.json({
    totalIncome,
    totalExpense,
    netBalance,
    categorySummary,
    recentTransactions
  });
};

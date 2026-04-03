import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import recordRoutes from './routes/recordRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);

export default app;

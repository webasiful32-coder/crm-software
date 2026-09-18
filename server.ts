import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './server/db';
import authRoutes from './server/routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' })); // Vite default port
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// DB init করে server start করো
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to initialize DB:', err);
  process.exit(1);
});
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';
import reportRoutes from './routes/report.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, try again later.',
});
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', protectedRoutes);
app.use('/api/reports', reportRoutes);

export default app;

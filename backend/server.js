import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dueRoutes from './routes/dueRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON payloads
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(helmet()); // Secures Express apps by setting HTTP response headers
app.use(morgan('dev')); // HTTP request logger
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dues', dueRoutes);
app.use('/api/suppliers', supplierRoutes);

// Root route for testing
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'ShopOne API is operational.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
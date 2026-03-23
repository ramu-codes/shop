import express from 'express';
import { loginAdmin, registerAdmin } from '../controllers/authController.js';
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { message: 'Too many attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const router = express.Router();

router.post('/login', authLimiter, loginAdmin);
router.post('/register', authLimiter, registerAdmin);

export default router;
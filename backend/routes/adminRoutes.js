import express from 'express';
import { getAnalytics, getMasterLedger } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 60,
    message: { message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const router = express.Router();

router.route('/analytics').get(adminLimiter, protect, getAnalytics);
router.route('/ledger').get(adminLimiter, protect, getMasterLedger);

export default router;
import express from 'express';
import { getAnalytics, getMasterLedger } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/analytics').get(protect, getAnalytics);
// Add the new ledger route
router.route('/ledger').get(protect, getMasterLedger); 

export default router;
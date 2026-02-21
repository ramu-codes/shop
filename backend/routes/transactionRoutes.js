 import express from 'express';
import { createTransaction, getTransactions, getTodaySummary } from '../controllers/transactionController.js';

const router = express.Router();

// IMPORTANT: Put /summary/today BEFORE the / route to avoid routing conflicts
router.route('/summary/today').get(getTodaySummary);

router.route('/')
    .post(createTransaction)
    .get(getTransactions);

export default router;
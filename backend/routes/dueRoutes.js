import express from 'express';
import { createDue, getDues, markDuePaid } from '../controllers/dueController.js';

const router = express.Router();

router.route('/').post(createDue).get(getDues);
router.route('/:id/pay').put(markDuePaid);

export default router;
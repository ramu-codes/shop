import express from 'express';
import { addSupplierPurchase, getSuppliers, markSupplierPaid } from '../controllers/supplierController.js';

const router = express.Router();

router.route('/').post(addSupplierPurchase).get(getSuppliers);
router.route('/:id/pay').put(markSupplierPaid);

export default router;
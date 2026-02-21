import Supplier from '../models/Supplier.js';

// @desc    Add supplier purchase
// @route   POST /api/suppliers
export const addSupplierPurchase = async (req, res) => {
    const { supplierName, productName, quantity, buyPrice, totalCost, paidAmount, remainingDue, paymentStatus, dueDate, expectedSellPrice } = req.body;
    
    if (!supplierName || !productName || !totalCost) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const purchase = await Supplier.create({
            supplierName, 
            productName, 
            quantity: Number(quantity), 
            buyPrice: Number(buyPrice), 
            totalCost: Number(totalCost),
            paidAmount: Number(paidAmount) || 0,
            remainingDue: Number(remainingDue),
            expectedSellPrice: Number(expectedSellPrice) || 0, // Save it here
            paymentStatus,
            dueDate
        });
        res.status(201).json(purchase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get supplier list
// @route   GET /api/suppliers
export const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().sort({ purchaseDate: -1 });
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Mark supplier payment as fully paid
// @route   PUT /api/suppliers/:id/pay
export const markSupplierPaid = async (req, res) => {
    try {
        // Fetch the record first
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Record not found' });

        // Force the math to perfectly align when marked as paid
        supplier.paymentStatus = 'paid';
        supplier.paidAmount = supplier.totalCost; // Money paid now equals total cost
        supplier.remainingDue = 0; // Debt is zero
        
        await supplier.save();

        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
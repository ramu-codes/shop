import Due from '../models/Due.js';

// @desc    Add new customer due
// @route   POST /api/dues
export const createDue = async (req, res) => {
    const { customerName, amount, description } = req.body;
    if (!customerName || !amount) return res.status(400).json({ message: 'Name and amount required' });

    try {
        const due = await Due.create({ customerName, amount: Number(amount), description });
        res.status(201).json(due);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all dues (separated by status on frontend)
// @route   GET /api/dues
export const getDues = async (req, res) => {
    try {
        const dues = await Due.find().sort({ date: -1 });
        res.status(200).json(dues);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Mark due as paid
// @route   PUT /api/dues/:id/pay
export const markDuePaid = async (req, res) => {
    try {
        const due = await Due.findByIdAndUpdate(
            req.params.id, 
            { status: 'paid' }, 
            { new: true }
        );
        if (!due) return res.status(404).json({ message: 'Due not found' });
        res.status(200).json(due);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
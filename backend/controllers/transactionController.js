import Due from '../models/Due.js';
import Transaction from '../models/Transaction.js';

/* =========================================================
   @desc    Create a new transaction (Sale or Expense)
   @route   POST /api/transactions
   @access  Public
========================================================= */
export const createTransaction = async (req, res) => {
    const { type, amount, title, category, quantity, paymentMode } = req.body;

    if (!type || !amount) {
        return res.status(400).json({ message: 'Type and amount are required' });
    }

    if (type !== 'sale' && type !== 'expense') {
        return res.status(400).json({ message: 'Invalid transaction type' });
    }

    try {
        const transaction = await Transaction.create({
            type,
            amount: Number(amount),
            title,
            category,
            quantity: quantity ? Number(quantity) : 1,
            paymentMode: type === 'sale' ? paymentMode : undefined
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/* =========================================================
   @desc    Get transactions with optional time filtering
   @route   GET /api/transactions
   @access  Public
========================================================= */
export const getTransactions = async (req, res) => {
    const { type, period } = req.query; // daily | weekly | monthly
    let query = {};

    if (type) query.type = type;

    if (period) {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (period === 'daily') {
            query.date = { $gte: startOfToday };
        } else if (period === 'weekly') {
            const startOfWeek = new Date(startOfToday);
            startOfWeek.setDate(startOfWeek.getDate() - 7);
            query.date = { $gte: startOfWeek };
        } else if (period === 'monthly') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            query.date = { $gte: startOfMonth };
        }
    }

    try {
        const transactions = await Transaction.find(query)
            .sort({ date: -1 })
            .limit(100);

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/* =========================================================
   @desc    Get Today's Summary for Home Dashboard
   @route   GET /api/transactions/summary/today
   @access  Public
========================================================= */
export const getTodaySummary = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Today's sales & expenses
        const todayTransactions = await Transaction.aggregate([
            { $match: { date: { $gte: startOfDay, $lte: endOfDay } } },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Overall pending customer dues
        const overallDues = await Due.aggregate([
            { $match: { status: 'pending' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        let todaySales = 0;
        let todayExpenses = 0;
        let transactionCount = 0;

        todayTransactions.forEach(t => {
            if (t._id === 'sale') todaySales = t.total;
            if (t._id === 'expense') todayExpenses = t.total;
            transactionCount += t.count;
        });

        const pendingDues = overallDues[0]?.total || 0;
        const todayProfit = todaySales - todayExpenses;

        res.status(200).json({
            sales: todaySales,
            expenses: todayExpenses,
            profit: todayProfit,
            dues: pendingDues,
            transactions: transactionCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
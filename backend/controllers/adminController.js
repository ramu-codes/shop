import Transaction from "../models/Transaction.js";
import Due from "../models/Due.js";
import Supplier from "../models/Supplier.js";

/* =========================================================
   @desc    Get complete shop analytics (Sales, Expenses, Profit, Dues)
   @route   GET /api/admin/analytics
   @access  Private (Admin Only)
========================================================= */
export const getAnalytics = async (req, res) => {
  try {
    const [transactionsStat, dueStat, supplierStat] = await Promise.all([
      Transaction.aggregate([
        {
          $group: {
            _id: "$type",
            totalAmount: { $sum: "$amount" },
          },
        },
      ]),
      Due.aggregate([
        { $match: { status: "pending" } },
        { $group: { _id: null, totalPending: { $sum: "$amount" } } },
      ]),
      Supplier.aggregate([
        { $match: { paymentStatus: { $ne: "paid" } } },
        {
          $group: {
            _id: null,
            totalPending: { $sum: "$remainingDue" },
          },
        },
      ]),
    ]);

    let totalSales = 0;
    let totalExpenses = 0;

    transactionsStat.forEach((stat) => {
      if (stat._id === "sale") totalSales = stat.totalAmount;
      if (stat._id === "expense") totalExpenses = stat.totalAmount;
    });

    const customerDuesPending = dueStat[0]?.totalPending || 0;
    const supplierPaymentPending = supplierStat[0]?.totalPending || 0;

    const netProfit = totalSales - totalExpenses;
    const netBalance =
      netProfit - supplierPaymentPending + customerDuesPending;

    res.status(200).json({
      totalSales,
      totalExpenses,
      netProfit,
      netBalance,
      customerDuesPending,
      supplierPaymentPending,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Analytics Error", error: error.message });
  }
};

/* =========================================================
   @desc    Get master ledger (Unified timeline of all cashflow)
   @route   GET /api/admin/ledger
   @access  Private (Admin Only)
========================================================= */
export const getMasterLedger = async (req, res) => {
  try {
    const [transactions, dues, suppliers] = await Promise.all([
      Transaction.find().sort({ date: -1 }).limit(100),
      Due.find().sort({ updatedAt: -1 }).limit(100),
      Supplier.find().sort({ updatedAt: -1 }).limit(100),
    ]);

    let ledger = [];

    // Transactions (Sales & Expenses)
    transactions.forEach((t) => {
      ledger.push({
        id: t._id,
        date: t.date,
        title: t.title || t.category || "General",
        amount: t.amount,
        type: t.type, // 'sale' or 'expense'
        status: t.paymentMode || "Cash",
        flow: t.type === "sale" ? "in" : "out",
      });
    });

    // Customer Dues (Udhar)
    dues.forEach((d) => {
      ledger.push({
        id: d._id,
        date: d.status === "paid" ? d.updatedAt : d.date,
        title: `Udhar: ${d.customerName}`,
        amount: d.amount,
        type: "due",
        status: d.status,
        flow: d.status === "paid" ? "in" : "pending",
      });
    });

    // Supplier Purchases (supports partial payment)
    suppliers.forEach((s) => {
      ledger.push({
        id: s._id,
        date:
          s.paymentStatus === "paid"
            ? s.updatedAt
            : s.purchaseDate || s.createdAt,
        title: `Stock: ${s.supplierName}`,
        amount: s.totalCost,
        type: "supplier",
        status: s.paymentStatus,
        flow:
          s.paymentStatus === "paid"
            ? "out"
            : s.paymentStatus === "partial"
            ? "partial"
            : "pending",
        remainingDue: s.remainingDue,
        paidAmount: s.paidAmount,
      });
    });

    // Sort by latest date first
    ledger.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json(ledger);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ledger Error", error: error.message });
  }
};
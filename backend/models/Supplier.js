import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
    supplierName: { type: String, required: true, trim: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    buyPrice: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    remainingDue: { type: Number, default: 0 },
    expectedSellPrice: { type: Number, default: 0 }, // NEW: Must be saved in DB
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'partial', 'paid'],
        default: 'pending' 
    },
    purchaseDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true }
}, { timestamps: true });

supplierSchema.index({ paymentStatus: 1, dueDate: 1 });

export default mongoose.model('Supplier', supplierSchema);
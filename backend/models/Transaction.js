import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['sale', 'expense'], 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true,
        min: [0, 'Amount cannot be negative'] 
    },
    title: { 
        type: String, 
        trim: true 
    }, // 'Rice 5kg' or 'Electricity Bill'
    category: { 
        type: String,
        trim: true
    }, // For expenses: 'Rent', 'Supplies'. For sales, can be blank.
    quantity: { 
        type: Number,
        default: 1
    },
    paymentMode: { 
        type: String, 
        enum: ['Cash', 'UPI'], 
        required: function() { return this.type === 'sale'; } // Only required for sales
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

// Compound index for high-speed analytics queries (Daily/Monthly/Yearly)
transactionSchema.index({ date: -1, type: 1 });

export default mongoose.model('Transaction', transactionSchema);
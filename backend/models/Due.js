import mongoose from 'mongoose';

const dueSchema = new mongoose.Schema({
    customerName: { 
        type: String, 
        required: true,
        trim: true
    },
    amount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'paid'], 
        default: 'pending' 
    },
    description: { 
        type: String 
    }, // E.g., 'Groceries taken on 20th'
    dueDate: { 
        type: Date 
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

// Index to quickly find pending dues
dueSchema.index({ status: 1, date: -1 });

export default mongoose.model('Due', dueSchema);
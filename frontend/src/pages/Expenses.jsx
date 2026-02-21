import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, TrendingDown, Zap, Home as HomeIcon, Package, MoreHorizontal } from 'lucide-react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('Monthly'); // Default to monthly for expenses
  
  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');

  const categories = [
    { name: 'Electricity', icon: <Zap size={16} /> },
    { name: 'Rent', icon: <HomeIcon size={16} /> },
    { name: 'Supplies', icon: <Package size={16} /> },
    { name: 'Other', icon: <MoreHorizontal size={16} /> }
  ];

  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/transactions?type=expense&period=${filter.toLowerCase()}`);
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filter]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount || !title) return;

    try {
      await axios.post('http://localhost:5000/api/transactions', {
        type: 'expense',
        amount: Number(amount),
        title,
        category
      });
      
      setIsModalOpen(false);
      setAmount('');
      setTitle('');
      setCategory('Other');
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const totalExpenseAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-4">
      {/* Header & Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Expenses</h1>
          <p className="text-xs text-gray-500">Track money going out</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-md active:scale-95 transition-transform"
        >
          <Plus size={16} className="mr-1" /> Add Expense
        </button>
      </div>

      {/* Total Card */}
      <div className="bg-red-50 border border-red-100 p-4 rounded-xl shadow-sm">
        <p className="text-danger text-sm font-medium">Total Expenses ({filter})</p>
        <p className="text-3xl font-bold text-danger mt-1">₹{totalExpenseAmount.toLocaleString('en-IN')}</p>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${
              filter === f ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Expense List */}
      <div className="space-y-3 pb-4">
        {expenses.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-8">No expenses found for this period.</p>
        ) : (
          expenses.map((exp) => (
            <div key={exp._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-red-50 p-2 rounded-lg">
                  <TrendingDown size={20} className="text-danger" />
                </div>
                <div>
                  <p className="font-medium text-sm text-textDark">{exp.title}</p>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[10px] text-gray-400">
                      {new Date(exp.date).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[9px] font-medium">{exp.category}</span>
                  </div>
                </div>
              </div>
              <p className="font-bold text-danger">₹{exp.amount}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 animate-slide-up sm:animate-none">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">Add Expense</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 bg-gray-100 rounded-full text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Expense Title *</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="e.g. Electricity Bill"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Amount (₹) *</label>
                <input 
                  type="number" 
                  required 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`flex items-center justify-center space-x-1 py-2 text-xs rounded-lg border ${
                        category === cat.name ? 'border-amber-500 bg-amber-50 text-amber-700 font-bold' : 'border-gray-200 text-gray-500'
                      }`}
                    >
                      {cat.icon} <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-amber-500 text-white font-bold text-lg py-4 rounded-xl mt-4 active:scale-95 transition-transform">
                Save Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
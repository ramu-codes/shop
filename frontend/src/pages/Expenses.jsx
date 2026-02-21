import { useState, useEffect } from 'react';
import { Plus, X, TrendingDown, Zap, Home as HomeIcon, Package, MoreHorizontal, Loader2 } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('Monthly');

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { name: 'Electricity', icon: <Zap size={16} /> },
    { name: 'Rent', icon: <HomeIcon size={16} /> },
    { name: 'Supplies', icon: <Package size={16} /> },
    { name: 'Other', icon: <MoreHorizontal size={16} /> }
  ];

  const fetchExpenses = async () => {
    try {
      const { data } = await api.get(`/transactions?type=expense&period=${filter.toLowerCase()}`);
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
    if (!amount || !category || isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Saving expense...');

    try {
      await api.post('/transactions', {
        type: 'expense',
        amount: Number(amount),
        title: title || category,
        category
      });

      toast.success('Expense recorded!', { id: toastId });

      setIsModalOpen(false);
      setAmount('');
      setTitle('');
      setCategory('Other');
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to save expense.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalExpenseAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
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
        <p className="text-3xl font-bold text-danger mt-1">
          ₹{totalExpenseAmount.toLocaleString('en-IN')}
        </p>
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
          <p className="text-center text-gray-400 text-sm mt-8">
            No expenses found for this period.
          </p>
        ) : (
          expenses.map((exp) => (
            <div
              key={exp._id}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-red-50 p-2 rounded-lg">
                  <TrendingDown size={20} className="text-danger" />
                </div>
                <div>
                  <p className="font-medium text-sm text-textDark">{exp.title}</p>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[10px] text-gray-400">
                      {new Date(exp.date).toLocaleString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: 'short'
                      })}
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[9px] font-medium">
                      {exp.category}
                    </span>
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
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 pb-12 max-h-[85vh] overflow-y-auto overscroll-contain">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">Add Expense</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 bg-gray-100 rounded-full text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Expense Title"
                className="w-full border border-gray-300 rounded-lg p-3"
              />

              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="w-full border border-gray-300 rounded-lg p-3"
              />

              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`flex items-center justify-center space-x-1 py-2 text-xs rounded-lg border ${
                      category === cat.name
                        ? 'border-amber-500 bg-amber-50 text-amber-700 font-bold'
                        : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    {cat.icon} <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white font-bold text-lg py-4 rounded-xl mt-4 active:scale-95 transition-transform shadow-lg flex justify-center items-center ${
                  isSubmitting
                    ? 'bg-amber-400 cursor-not-allowed'
                    : 'bg-[#d97706]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={24} /> Saving...
                  </>
                ) : (
                  'Save Expense Record'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
import { useState, useEffect } from 'react';
import { Plus, X, ShoppingBag } from 'lucide-react';
import api from '../api';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('Daily');
  
  // Form State
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [paymentMode, setPaymentMode] = useState('Cash');

  // Fetch sales from backend
  const fetchSales = async () => {
    try {
      const { data } = await api.get(`/transactions?type=sale&period=${filter.toLowerCase()}`);
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [filter]);

  const handleAddSale = async (e) => {
    e.preventDefault();
    if (!amount) return;

    try {
      await api.post('/transactions', {
        type: 'sale',
        amount: Number(amount),
        title: title || 'General Item',
        quantity: Number(quantity),
        paymentMode
      });
      
      setIsModalOpen(false);
      setAmount('');
      setTitle('');
      setQuantity('1');
      fetchSales();
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  };

  const totalSalesAmount = sales.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-4">
      {/* Header & Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Sales</h1>
          <p className="text-xs text-gray-500">Track your sales</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-md active:scale-95 transition-transform"
        >
          <Plus size={16} className="mr-1" /> Add Sale
        </button>
      </div>

      {/* Total Card */}
      <div className="bg-green-50 border border-green-100 p-4 rounded-xl shadow-sm">
        <p className="text-success text-sm font-medium">Total Sales ({filter})</p>
        <p className="text-3xl font-bold text-success mt-1">₹{totalSalesAmount.toLocaleString('en-IN')}</p>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${
              filter === f ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Sales List */}
      <div className="space-y-3 pb-4">
        {sales.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-8">No sales found for this period.</p>
        ) : (
          sales.map((sale) => (
            <div key={sale._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <ShoppingBag size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-textDark">{sale.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(sale.date).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-semibold rounded ${
                    sale.paymentMode === 'UPI' ? 'bg-blue-100 text-primary' : 'bg-green-100 text-success'
                  }`}>
                    {sale.paymentMode}
                  </span>
                </div>
              </div>
              <p className="font-bold text-success">₹{sale.amount}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Sale Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">Add New Sale</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 bg-gray-100 rounded-full text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSale} className="space-y-4">
              <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="w-full border p-3 rounded-lg" />
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Item name" className="w-full border p-3 rounded-lg" />
              
              <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl">
                Save Sale
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
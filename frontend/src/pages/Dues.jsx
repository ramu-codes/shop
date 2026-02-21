import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, X, UserMinus, CheckCircle2 } from 'lucide-react';

const Dues = () => {
  const [dues, setDues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'paid'
  
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const fetchDues = async () => {
    try {
      const { data } = await api.get('/dues');
      setDues(data);
    } catch (error) {
      console.error('Error fetching dues:', error);
    }
  };

  useEffect(() => {
    fetchDues();
  }, []);

  const handleAddDue = async (e) => {
    e.preventDefault();
    if (!customerName || !amount) return;

    try {
      await api.post('/dues', {
        customerName,
        amount: Number(amount),
        description
      });
      
      setIsModalOpen(false);
      setCustomerName('');
      setAmount('');
      setDescription('');
      fetchDues(); // Refresh list
      setActiveTab('pending'); // Switch to pending tab to see the new entry
    } catch (error) {
      console.error('Error adding due:', error);
    }
  };

  const handleMarkAsPaid = async (id) => {
    // Basic confirmation dialog prevents accidental taps
    if(!window.confirm("Confirm payment received?")) return;
    
    try {
      await api.put(`/dues/${id}/pay`);
      fetchDues();
    } catch (error) {
      console.error('Error marking as paid:', error);
    }
  };

  const filteredDues = dues.filter(due => due.status === activeTab);
  const totalPending = dues.filter(d => d.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-4 pb-6">
      {/* Header & Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Customer Dues</h1>
          <p className="text-xs text-gray-500">Track Udhar</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#dc2626] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center shadow-md active:scale-95 transition-transform"
        >
          <Plus size={18} className="mr-1" /> Add Due
        </button>
      </div>

      {/* Total Pending Alert Card */}
      <div className="bg-[#fef2f2] border border-[#fecaca] p-5 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[#dc2626] text-sm font-bold uppercase tracking-wider flex items-center">
            <UserMinus size={16} className="mr-2" /> Total Pending
          </p>
          <p className="text-3xl font-black text-[#dc2626] mt-1">₹{totalPending.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1.5 rounded-xl">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'pending' ? 'bg-white shadow-sm text-[#dc2626]' : 'text-gray-500'}`}
        >
          Pending
        </button>
        <button 
          onClick={() => setActiveTab('paid')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'paid' ? 'bg-white shadow-sm text-[#16a34a]' : 'text-gray-500'}`}
        >
          Paid
        </button>
      </div>

      {/* Dues List */}
      <div className="space-y-3 pb-4 mt-2">
        {filteredDues.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-8">No {activeTab} dues found.</p>
        ) : (
          filteredDues.map((due) => (
            <div key={due._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-[#0f172a] text-lg">{due.customerName}</p>
                  {due.description && <p className="text-sm text-gray-500 mt-0.5">{due.description}</p>}
                  <p className="text-xs text-gray-400 mt-2 font-medium flex items-center">
                    {new Date(due.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <p className={`font-black text-xl ${due.status === 'pending' ? 'text-[#dc2626]' : 'text-[#16a34a]'}`}>
                  ₹{due.amount}
                </p>
              </div>
              
              {due.status === 'pending' && (
                <button 
                  onClick={() => handleMarkAsPaid(due._id)}
                  className="w-full mt-4 py-3 bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] rounded-xl text-sm font-bold flex justify-center items-center active:bg-[#dcfce7] transition-colors"
                >
                  <CheckCircle2 size={18} className="mr-2" /> Mark as Paid
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Due Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 animate-slide-up sm:animate-none">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0f172a]">Add Customer Due</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-600 active:bg-gray-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddDue} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Customer Name *</label>
                <input 
                  type="text" 
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-[#dc2626]"
                  placeholder="e.g. Rahul Kumar"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#dc2626] mb-1">Amount (₹) *</label>
                <input 
                  type="number" 
                  required 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border-2 border-[#fecaca] bg-[#fef2f2] rounded-xl p-3 text-lg outline-none focus:border-[#dc2626] font-bold"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description (Optional)</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-[#dc2626]"
                  placeholder="e.g. 2 bags of cement"
                />
              </div>

              <button type="submit" className="w-full bg-[#dc2626] text-white font-black text-lg py-4 rounded-xl mt-6 active:scale-95 transition-transform shadow-lg">
                Save Due Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dues;
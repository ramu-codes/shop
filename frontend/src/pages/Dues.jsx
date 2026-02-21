import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, UserCheck, UserMinus, CheckCircle2 } from 'lucide-react';

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
      const { data } = await axios.get('http://localhost:5000/api/dues');
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
      await axios.post('http://localhost:5000/api/dues', {
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
      await axios.put(`http://localhost:5000/api/dues/${id}/pay`);
      fetchDues();
    } catch (error) {
      console.error('Error marking as paid:', error);
    }
  };

  const filteredDues = dues.filter(due => due.status === activeTab);
  const totalPending = dues.filter(d => d.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-4">
      {/* Header & Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Customer Dues</h1>
          <p className="text-xs text-gray-500">Track Udhar</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-danger text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-md active:scale-95 transition-transform"
        >
          <Plus size={16} className="mr-1" /> Add Due
        </button>
      </div>

      {/* Total Pending Alert Card */}
      <div className="bg-red-50 border border-red-200 p-4 rounded-xl shadow-sm flex items-center justify-between">
        <div>
          <p className="text-danger text-sm font-medium flex items-center">
            <UserMinus size={16} className="mr-1" /> Total Pending
          </p>
          <p className="text-2xl font-bold text-danger mt-1">₹{totalPending.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-lg">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'pending' ? 'bg-white shadow text-danger' : 'text-gray-500'}`}
        >
          Pending
        </button>
        <button 
          onClick={() => setActiveTab('paid')}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'paid' ? 'bg-white shadow text-success' : 'text-gray-500'}`}
        >
          Paid
        </button>
      </div>

      {/* Dues List */}
      <div className="space-y-3 pb-4">
        {filteredDues.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-8">No {activeTab} dues found.</p>
        ) : (
          filteredDues.map((due) => (
            <div key={due._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-textDark text-lg">{due.customerName}</p>
                  {due.description && <p className="text-xs text-gray-500 mt-0.5">{due.description}</p>}
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(due.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <p className={`font-bold text-lg ${due.status === 'pending' ? 'text-danger' : 'text-success'}`}>
                  ₹{due.amount}
                </p>
              </div>
              
              {due.status === 'pending' && (
                <button 
                  onClick={() => handleMarkAsPaid(due._id)}
                  className="w-full mt-2 py-2 border border-green-500 text-success rounded-lg text-sm font-bold flex justify-center items-center active:bg-green-50 transition-colors"
                >
                  <CheckCircle2 size={16} className="mr-1" /> Mark as Paid
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Due Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 animate-slide-up sm:animate-none">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">Add Customer Due</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 bg-gray-100 rounded-full text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddDue} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Customer Name *</label>
                <input 
                  type="text" 
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-danger focus:border-danger outline-none"
                  placeholder="e.g. Rahul Kumar"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Amount (₹) *</label>
                <input 
                  type="number" 
                  required 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-danger focus:border-danger outline-none"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description (Optional)</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-danger focus:border-danger outline-none"
                  placeholder="e.g. 2 bags of cement"
                />
              </div>

              <button type="submit" className="w-full bg-danger text-white font-bold text-lg py-4 rounded-xl mt-4 active:scale-95 transition-transform">
                Save Due
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dues;
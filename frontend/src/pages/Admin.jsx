import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { ShieldAlert, LogOut, TrendingUp, TrendingDown, Wallet, Users, Truck, Lock, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Admin = () => {
  const { token, logout } = useContext(AuthContext); // logout clears app access entirely
  const [analytics, setAnalytics] = useState(null);
  const [adminPin, setAdminPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-unlock if PIN was already entered during this session
  useEffect(() => {
    const savedPin = sessionStorage.getItem('masterPin');
    if (savedPin && token) {
      fetchAnalytics(savedPin);
    }
  }, [token]);

  const fetchAnalytics = async (pinToUse) => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/admin/analytics', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'x-admin-pin': pinToUse
        }
      });
      setAnalytics(data);
      setIsUnlocked(true);
      sessionStorage.setItem('masterPin', pinToUse);
    } catch (err) {
      toast.error('Admin Access Denied');
      sessionStorage.removeItem('masterPin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    fetchAnalytics(adminPin);
  };

  // Lock Screen UI
  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
         <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 w-full max-w-sm text-center">
            <div className="bg-[#0f172a] p-4 rounded-full inline-block mb-4">
              <Lock size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#0f172a]">Admin Access</h2>
            <p className="text-sm text-gray-500 mt-1 mb-6">Enter master code to view analytics</p>
            
            <form onSubmit={handleUnlock}>
               <input
                 type="password"
                 value={adminPin}
                 onChange={(e) => setAdminPin(e.target.value)}
                 placeholder="Admin PIN"
                 className="w-full border-2 border-gray-200 rounded-xl p-4 text-center text-xl tracking-[0.5em] focus:border-[#0f172a] outline-none font-bold text-[#0f172a]"
                 autoFocus
               />
               <button 
                 type="submit" 
                 disabled={isLoading}
                 className="w-full bg-[#0f172a] text-white font-bold py-4 rounded-xl mt-4 active:scale-95 transition-all flex justify-center items-center h-14"
               >
                 {isLoading ? <Loader2 className="animate-spin" /> : 'Unlock Data'}
               </button>
            </form>
         </div>
      </div>
    );
  }

  // Dashboard UI
  return (
    <div className="space-y-6 pb-6">
      <div className="flex justify-between items-center bg-[#0f172a] text-white p-6 -mx-4 -mt-4 rounded-b-[2rem] shadow-lg">
        <div>
          <h1 className="text-2xl font-black flex items-center"><ShieldAlert size={24} className="mr-2 text-blue-400"/> Admin Panel</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-widest">Financial Overview</p>
        </div>
        <button onClick={() => { sessionStorage.removeItem('masterPin'); setIsUnlocked(false); }} className="p-3 bg-white/10 rounded-xl active:scale-95 transition-all hover:bg-white/20 text-gray-300">
          <Lock size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-5 rounded-2xl shadow-sm">
          <p className="text-[#16a34a] text-xs font-bold uppercase tracking-wider flex items-center mb-2"><TrendingUp size={16} className="mr-1"/> Sales</p>
          <p className="text-2xl font-black text-[#16a34a]">₹{analytics.totalSales.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-[#fef2f2] border border-[#fecaca] p-5 rounded-2xl shadow-sm">
          <p className="text-[#dc2626] text-xs font-bold uppercase tracking-wider flex items-center mb-2"><TrendingDown size={16} className="mr-1"/> Expenses</p>
          <p className="text-2xl font-black text-[#dc2626]">₹{analytics.totalExpenses.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-[#eff6ff] border border-[#bfdbfe] p-5 rounded-2xl shadow-sm">
          <p className="text-[#1d4ed8] text-xs font-bold uppercase tracking-wider flex items-center mb-2"><TrendingUp size={16} className="mr-1"/> Profit</p>
          <p className="text-2xl font-black text-[#1d4ed8]">₹{analytics.netProfit.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider flex items-center mb-2"><Wallet size={16} className="mr-1"/> Balance</p>
          <p className="text-2xl font-black text-[#0f172a]">₹{analytics.netBalance.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <button onClick={logout} className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl mt-4 border border-red-200 flex justify-center items-center active:bg-red-100">
        <LogOut size={18} className="mr-2" /> Log Out Entire App
      </button>
    </div>
  );
};

export default Admin;
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShieldAlert, LogOut, TrendingUp, TrendingDown, Wallet, Users, Truck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Admin = () => {
  const { isAdmin, token, login, logout } = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch analytics only if user is logged in
  useEffect(() => {
    if (isAdmin && token) {
      fetchAnalytics();
    }
  }, [isAdmin, token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { password });
      login(data.token);
    } catch (err) {
      setError('Incorrect password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
      if (err.response?.status === 401) logout(); // Token expired or invalid
    }
  };

  // --- LOGIN SCREEN ---
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 space-y-6">
        <div className="bg-gray-900 p-4 rounded-full shadow-lg">
          <ShieldAlert size={40} className="text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-textDark">Admin Section</h1>
          <p className="text-sm text-gray-500 mt-1">Restricted access — enter password</p>
        </div>

        <form onSubmit={handleLogin} className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Admin PIN"
            className="w-full border border-gray-300 rounded-xl p-4 text-center text-xl tracking-widest focus:ring-2 focus:ring-gray-900 outline-none mb-4"
          />
          {error && <p className="text-danger text-sm text-center mb-4 bg-red-50 p-2 rounded">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl active:scale-95 transition-transform"
          >
            {loading ? 'Verifying...' : 'Unlock Admin'}
          </button>
        </form>
      </div>
    );
  }

  // --- DASHBOARD SCREEN ---
  if (!analytics) return <div className="text-center mt-10">Loading analytics...</div>;

  return (
    <div className="space-y-6 pb-6">
      <div className="flex justify-between items-center bg-gray-900 text-white p-5 -mx-4 -mt-4 rounded-b-3xl shadow-md">
        <div>
          <h1 className="text-xl font-bold flex items-center"><ShieldAlert size={20} className="mr-2"/> Admin Dashboard</h1>
          <p className="text-xs text-gray-400 mt-1">Full Financial Overview</p>
        </div>
        <button onClick={logout} className="p-2 bg-gray-800 rounded-full active:scale-95 text-gray-300">
          <LogOut size={18} />
        </button>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl shadow-sm">
          <p className="text-success text-xs font-semibold flex items-center mb-1"><TrendingUp size={14} className="mr-1"/> Total Sales</p>
          <p className="text-2xl font-bold text-success">₹{analytics.totalSales.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl shadow-sm">
          <p className="text-danger text-xs font-semibold flex items-center mb-1"><TrendingDown size={14} className="mr-1"/> Total Expenses</p>
          <p className="text-2xl font-bold text-danger">₹{analytics.totalExpenses.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl shadow-sm">
          <p className="text-primary text-xs font-semibold flex items-center mb-1"><TrendingUp size={14} className="mr-1"/> Net Profit</p>
          <p className="text-2xl font-bold text-primary">₹{analytics.netProfit.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-gray-100 border border-gray-200 p-4 rounded-xl shadow-sm">
          <p className="text-gray-700 text-xs font-semibold flex items-center mb-1"><Wallet size={14} className="mr-1"/> Net Balance</p>
          <p className="text-2xl font-bold text-gray-900">₹{analytics.netBalance.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Pending Overview */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Pending Overview</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="font-bold text-textDark flex items-center"><Users size={16} className="mr-2 text-danger"/> Customer Dues</p>
              <p className="text-xs text-gray-500 mt-0.5 ml-6">Money to receive</p>
            </div>
            <p className="font-bold text-danger">₹{analytics.customerDuesPending.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="font-bold text-textDark flex items-center"><Truck size={16} className="mr-2 text-amber-500"/> Supplier Dues</p>
              <p className="text-xs text-gray-500 mt-0.5 ml-6">Money to pay</p>
            </div>
            <p className="font-bold text-amber-500">₹{analytics.supplierPaymentPending.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
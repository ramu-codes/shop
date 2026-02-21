import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Users,
  TrendingDown,
  Truck,
  Eye,
  EyeOff,
  ShieldAlert,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import api from '../api';

const Home = () => {
  const navigate = useNavigate();
  const [showStats, setShowStats] = useState(false);

  // LIVE Dashboard State
  const [stats, setStats] = useState({
    sales: 0,
    dues: 0,
    profit: 0,
    transactions: 0
  });

  useEffect(() => {
    const fetchTodayStats = async () => {
      try {
        const { data } = await api.get('/transactions/summary/today');
        setStats(data);
      } catch (error) {
        console.error('Error fetching today stats:', error);
      }
    };

    fetchTodayStats();
  }, []);

  const mask = "••••••";

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#1e40af] text-white p-6 -mx-4 -mt-4 rounded-b-[2rem] shadow-lg relative">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <ShoppingCart size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide">ShopOne</h1>
              <p className="text-sm text-blue-200">Owner Dashboard</p>
            </div>
          </div>

          <button
            onClick={() => setShowStats(!showStats)}
            className="bg-white/20 p-2 rounded-full active:scale-95 transition-transform"
          >
            {showStats ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {/* LIVE Stats Grid */}
        <div className="bg-[#1e3a8a] rounded-2xl p-4 shadow-inner grid grid-cols-2 gap-y-4 gap-x-2 text-center border border-blue-800/50">
          <div>
            <p className="text-[11px] text-blue-200 font-semibold mb-1">Today's Sales</p>
            <p className="text-lg font-bold tracking-widest">
              {showStats ? `₹${stats.sales.toLocaleString('en-IN')}` : mask}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-blue-200 font-semibold mb-1">Pending Dues</p>
            <p className="text-lg font-bold tracking-widest">
              {showStats ? `₹${stats.dues.toLocaleString('en-IN')}` : mask}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-blue-200 font-semibold mb-1">Today's Profit</p>
            <p
              className={`text-lg font-bold tracking-widest ${
                stats.profit < 0 ? 'text-red-400' : 'text-green-400'
              }`}
            >
              {showStats ? `₹${stats.profit.toLocaleString('en-IN')}` : mask}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-blue-200 font-semibold mb-1">Transactions</p>
            <p className="text-lg font-bold tracking-widest">
              {showStats ? stats.transactions : mask}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/sales" className="bg-[#2563eb] text-white p-5 rounded-2xl shadow-sm flex flex-col justify-center active:scale-95 transition-transform h-32">
            <ShoppingCart size={28} className="mb-2" />
            <span className="font-bold text-lg">Add Sale</span>
            <span className="text-[11px] text-blue-200 mt-1">Record transaction</span>
          </Link>

          <Link to="/dues" className="bg-[#fee2e2] border border-red-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center active:scale-95 transition-transform h-32">
            <Users size={28} className="mb-2 text-[#dc2626]" />
            <span className="font-bold text-lg text-gray-900">View Dues</span>
            <span className="text-[11px] text-[#dc2626] mt-1">Customer pending</span>
          </Link>

          <Link to="/expenses" className="bg-[#fef3c7] border border-amber-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center active:scale-95 transition-transform h-32">
            <TrendingDown size={28} className="mb-2 text-[#d97706]" />
            <span className="font-bold text-lg text-gray-900">Expenses</span>
            <span className="text-[11px] text-[#d97706] mt-1">Track spending</span>
          </Link>

          <Link to="/supplier" className="bg-[#dcfce7] border border-green-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center active:scale-95 transition-transform h-32">
            <Truck size={28} className="mb-2 text-[#16a34a]" />
            <span className="font-bold text-lg text-gray-900">Supplier</span>
            <span className="text-[11px] text-[#16a34a] mt-1">Manage stock</span>
          </Link>
        </div>
      </div>

      {/* System Buttons */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            Payments System
          </h2>
          <button onClick={() => navigate('/payments')} className="w-full bg-[#9333ea] text-white p-4 rounded-2xl shadow-md flex items-center justify-between active:scale-95 transition-transform">
            <div className="flex items-center">
              <CreditCard size={24} className="mr-3" />
              <div className="text-left">
                <span className="font-bold text-lg block">Payments</span>
                <span className="text-[11px] text-purple-200">Track incoming & outgoing</span>
              </div>
            </div>
            <ChevronRight size={20} />
          </button>
        </div>

        <div>
          <h2 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            Admin Control
          </h2>
          <button onClick={() => navigate('/admin')} className="w-full bg-[#0f172a] text-white p-4 rounded-2xl shadow-md flex items-center justify-between active:scale-95 transition-transform">
            <div className="flex items-center">
              <ShieldAlert size={24} className="mr-3" />
              <div className="text-left">
                <span className="font-bold text-lg block">Admin Panel</span>
                <span className="text-[11px] text-gray-400">Secure settings & controls</span>
              </div>
            </div>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
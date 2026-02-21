import { useState, useContext } from 'react';
import api from '../api';
import { ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { password });
      login(data.token);
    } catch (err) {
      setError('Incorrect PIN. Access Denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col items-center space-y-6">
        
        <div className="bg-[#1e40af] p-5 rounded-full shadow-lg">
          <ShieldAlert size={48} className="text-white" />
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#0f172a]">ShopOne</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium uppercase tracking-widest">Secure Owner Access</p>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-4 mt-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Security PIN"
            className="w-full border-2 border-gray-200 rounded-2xl p-5 text-center text-2xl tracking-[0.5em] focus:ring-4 focus:ring-blue-100 focus:border-[#1e40af] outline-none transition-all font-bold text-[#0f172a]"
            autoFocus
          />
          
          {error && (
            <p className="text-[#dc2626] text-sm font-bold text-center bg-[#fef2f2] p-3 rounded-xl border border-[#fecaca]">
              {error}
            </p>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0f172a] text-white font-black text-lg py-5 rounded-2xl active:scale-95 transition-transform shadow-lg"
          >
            {loading ? 'Verifying...' : 'Unlock System'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
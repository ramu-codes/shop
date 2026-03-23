import { useState, useContext } from 'react';
import api from '../api';
import { ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const { data } = await api.post(endpoint, { username, password });
      login(data.token, data.username);
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg || (isRegister ? 'Registration failed.' : 'Incorrect credentials. Access Denied.'));
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
          <p className="text-sm text-gray-500 mt-2 font-medium uppercase tracking-widest">
            {isRegister ? 'Create Account' : 'Secure Owner Access'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4 mt-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full border-2 border-gray-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-[#1e40af] outline-none transition-all font-semibold text-[#0f172a]"
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isRegister ? 'Create Password (min 8 chars)' : 'Password'}
            required
            className="w-full border-2 border-gray-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-[#1e40af] outline-none transition-all font-semibold text-[#0f172a]"
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
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Unlock System'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => { setIsRegister(!isRegister); setError(''); }}
          className="text-sm text-[#1e40af] font-semibold"
        >
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default Login;

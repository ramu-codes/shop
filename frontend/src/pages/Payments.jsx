import { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, CheckCircle2, Calendar } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);

  const fetchPaidDues = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/dues');
      // Filter only the dues that have been marked as paid
      const paidData = data.filter(due => due.status === 'paid');
      setPayments(paidData);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    fetchPaidDues();
  }, []);

  const totalReceived = payments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-4 pb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Payments Received</h1>
          <p className="text-xs text-gray-500">History of cleared Udhar</p>
        </div>
      </div>

      {/* Total Received Card */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-xl shadow-sm flex items-center justify-between">
        <div>
          <p className="text-success text-sm font-medium flex items-center">
            <CreditCard size={16} className="mr-1" /> Total Recovered
          </p>
          <p className="text-2xl font-bold text-success mt-1">₹{totalReceived.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Payments Ledger List */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-2">Payment Log</h2>
        
        {payments.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-8">No payments received yet.</p>
        ) : (
          payments.map((payment) => (
            <div key={payment._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle2 size={20} className="text-success" />
                </div>
                <div>
                  <p className="font-bold text-textDark leading-tight">{payment.customerName}</p>
                  <p className="text-[10px] text-gray-400 flex items-center mt-1">
                    <Calendar size={10} className="mr-1" />
                    {new Date(payment.updatedAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-success text-lg">+ ₹{payment.amount}</p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 uppercase tracking-wider">Settled</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Payments;
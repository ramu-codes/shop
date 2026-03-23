import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Layout from './Components/Layout';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Sales from './pages/Sales';
import Expenses from './pages/Expenses';
import Dues from './pages/Dues';
import Payments from './pages/Payments';
import Supplier from './pages/Supplier';
import Admin from './pages/Admin';
import Login from './pages/Login';

const AppContent = () => {
  const { token } = useContext(AuthContext);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{ duration: 3000, style: { fontWeight: 'bold' } }}
      />
      <Routes>
        {!token ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="sales" element={<Sales />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="dues" element={<Dues />} />
            <Route path="payments" element={<Payments />} />
            <Route path="supplier" element={<Supplier />} />
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
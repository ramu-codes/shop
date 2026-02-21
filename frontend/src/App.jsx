import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';

// Actual Page Imports
import Home from './pages/Home';
import Sales from './pages/Sales';
import Expenses from './pages/Expenses';
import Dues from './pages/Dues';
import Payments from './pages/Payments';
import Supplier from './pages/Supplier';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Layout handles the mobile shell and bottom navigation */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="sales" element={<Sales />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="dues" element={<Dues />} />
            <Route path="payments" element={<Payments />} />
            <Route path="supplier" element={<Supplier />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
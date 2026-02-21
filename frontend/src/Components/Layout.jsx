 import { NavLink, Outlet } from 'react-router-dom';
import { Home, ShoppingCart, TrendingDown, Users, Truck } from 'lucide-react';

const Layout = () => {
  // Removed Admin and Payments. Increased icon sizes.
  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={24} /> },
    { name: 'Sales', path: '/sales', icon: <ShoppingCart size={24} /> },
    { name: 'Expenses', path: '/expenses', icon: <TrendingDown size={24} /> },
    { name: 'Dues', path: '/dues', icon: <Users size={24} /> },
    { name: 'Supplier', path: '/supplier', icon: <Truck size={24} /> },
  ];

  return (
    <div className="bg-[#e2e8f0] min-h-screen text-[#0f172a] flex justify-center font-sans">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative pb-20 overflow-x-hidden">
        <main className="p-4 overflow-y-auto h-full pb-24">
          <Outlet />
        </main>

        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 flex justify-between px-4 py-3 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-50">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center transition-all duration-200 ${
                  isActive ? 'text-[#1e40af] scale-110' : 'text-gray-400 hover:text-gray-600'
                }`
              }
            >
              {item.icon}
              <span className="text-[10px] mt-1 font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
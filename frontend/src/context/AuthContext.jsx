import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);

  // Check for existing token on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('shopone_admin_token');
    if (storedToken) {
      setToken(storedToken);
      setIsAdmin(true);
    }
  }, []);

  const login = (jwtToken) => {
    localStorage.setItem('shopone_admin_token', jwtToken);
    setToken(jwtToken);
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem('shopone_admin_token');
    setToken(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('shopToken') || null);
  const [username, setUsername] = useState(localStorage.getItem('shopUsername') || null);

  const login = (newToken, newUsername) => {
    localStorage.setItem('shopToken', newToken);
    if (newUsername) localStorage.setItem('shopUsername', newUsername);
    setToken(newToken);
    setUsername(newUsername || null);
  };

  const logout = () => {
    localStorage.removeItem('shopToken');
    localStorage.removeItem('shopUsername');
    sessionStorage.removeItem('adminVerified');
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

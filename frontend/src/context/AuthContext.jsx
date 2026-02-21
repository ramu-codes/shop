import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Check local storage immediately when the app loads
  const [token, setToken] = useState(localStorage.getItem('shopToken') || null);

  const login = (newToken) => {
    localStorage.setItem('shopToken', newToken); // Save to phone storage
    setToken(newToken); // Unlock the app
  };

  const logout = () => {
    localStorage.removeItem('shopToken'); // Erase from phone
    sessionStorage.removeItem('masterPin'); // Erase Admin PIN
    setToken(null); // Lock the app
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
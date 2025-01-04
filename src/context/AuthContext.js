import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setUser(storedToken);
  }, []);

  const login = (token) => {
    setUser(token); // Set token as user state
    localStorage.setItem('token', token);
    console.log('Successfully logged in!');
    window.location.href = '/';
  };

  const logout = () => {
    localStorage.removeItem('token');
    console.log('Successfully logged out!');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

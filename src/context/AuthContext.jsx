// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState({
    id: localStorage.getItem("userId"),
    name: localStorage.getItem("fullName"),
  });

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  const login = (tokenVal, userObj) => {
    localStorage.setItem("token", tokenVal);
    if (userObj?.userId) localStorage.setItem("userId", userObj.userId);
    if (userObj?.fullName) localStorage.setItem("fullName", userObj.fullName);
    setToken(tokenVal);
    setUser({ id: userObj?.userId, name: userObj?.fullName });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

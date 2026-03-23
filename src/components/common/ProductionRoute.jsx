import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const userRole = localStorage.getItem("role") || sessionStorage.getItem("userRole");
  const authToken = localStorage.getItem("token") || sessionStorage.getItem("authToken");

  // If no token, user isn't logged in
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  // If role doesn't match required one (e.g., ADMIN), block access
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

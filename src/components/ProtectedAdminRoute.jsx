// src/components/ProtectedAdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/admin-login" replace />;
};

export default ProtectedAdminRoute;

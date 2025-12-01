import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const RoleRoute = ({ roles, userRole, children }) => {
  const isAllowed = roles.includes(userRole);

  useEffect(() => {
    if (!isAllowed) {
      toast.error("Maaf, Anda tidak dapat mengakses halaman ini");
    }
  }, [isAllowed]);

  // Jika role tidak cocok → arahkan ke dashboard
  if (!isAllowed) {
    return <Navigate to="/dashboard" replace />;
  }

  // Jika role cocok → tampilkan halaman
  return children;
};

export default RoleRoute;

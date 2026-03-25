import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { tokenManager } from '../../services/adminAuthService';

const ProtectedAdminRoute = () => {
  const location = useLocation();
  
  // Check if user is authenticated (tokenManager already checks for admin role)
  const isAuthenticated = tokenManager.isAuthenticated();

  // Add debug log
  console.log('ProtectedAdminRoute - isAuthenticated:', isAuthenticated, 'adminToken:', localStorage.getItem('adminToken'));

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;

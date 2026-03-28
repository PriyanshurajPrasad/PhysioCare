import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { tokenManager } from '../../services/adminAuthService';

const ProtectedAdminRoute = () => {
  const location = useLocation();
  
  // Check if user is authenticated (tokenManager already checks for admin role)
  const isAuthenticated = tokenManager.isAuthenticated();

  // Add debug log
  console.log('ProtectedAdminRoute - isAuthenticated:', isAuthenticated, 'adminToken:', localStorage.getItem('admin_token'));

  if (!isAuthenticated) {
    // Prevent redirect loop: don't redirect if already on login page
    const currentPath = location.pathname;
    if (currentPath === '/admin/login' || currentPath === '/admin') {
      return <Navigate to="/admin/login" replace />;
    }
    
    // Redirect to login page with return url
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;

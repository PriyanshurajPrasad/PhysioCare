import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check for admin token in localStorage
  const adminToken = localStorage.getItem('admin_token');
  const adminUser = localStorage.getItem('admin_user');

  // Show loading while checking authentication
  if (!adminToken || !adminUser) {
    console.log('🔐 No admin token found, redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  try {
    // Parse admin user data
    const adminData = JSON.parse(adminUser);
    
    // Validate token format (basic check)
    if (adminToken.length < 10) {
      console.log('🔐 Invalid token format, redirecting to login');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Validate admin data
    if (!adminData || !adminData.email || adminData.role !== 'admin') {
      console.log('🔐 Invalid admin data, redirecting to login');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    console.log('✅ Admin authenticated:', adminData.email);
    return children;
    
  } catch (error) {
    console.error('❌ Error parsing admin user data:', error);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
};

export default AdminProtectedRoute;

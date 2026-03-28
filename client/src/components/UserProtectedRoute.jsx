import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const UserProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check for user token in localStorage
  const userToken = localStorage.getItem('user_token');
  const userData = localStorage.getItem('user_data');

  // Show loading while checking authentication
  if (!userToken || !userData) {
    console.log('🔐 No user token found, redirecting to login');
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }

  try {
    // Parse user data
    const user = JSON.parse(userData);
    
    // Validate token format (basic check)
    if (userToken.length < 10) {
      console.log('🔐 Invalid token format, redirecting to login');
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_data');
      return <Navigate to="/user/login" state={{ from: location }} replace />;
    }

    // Validate user data and ensure it's not an admin
    if (!user || !user.email || user.role === 'admin') {
      console.log('🔐 Invalid user data or admin detected, redirecting to login');
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_data');
      return <Navigate to="/user/login" state={{ from: location }} replace />;
    }

    // Verify JWT token contains user role (not admin)
    try {
      const tokenPayload = JSON.parse(atob(userToken.split('.')[1]));
      if (tokenPayload.role === 'admin') {
        console.log('🔐 Admin token detected in user area, redirecting to login');
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
        return <Navigate to="/user/login" state={{ from: location }} replace />;
      }
    } catch (tokenError) {
      console.log('🔐 Invalid JWT token, redirecting to login');
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_data');
      return <Navigate to="/user/login" state={{ from: location }} replace />;
    }

    console.log('✅ User authenticated and verified:', user.email);
    return children;
    
  } catch (error) {
    console.error('❌ Error parsing user data:', error);
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }
};

export default UserProtectedRoute;

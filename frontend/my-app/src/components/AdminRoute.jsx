import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector(state => state.user);

  // Check if user is authenticated and is admin
  if (!isAuthenticated || !user || user.role !== 'admin') {
    // Double-check storage as fallback
    const adminToken = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    const adminUser = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');
    
    if (!adminToken || !adminUser) {
      return <Navigate to="/login" replace />;
    }
    
    // Try to parse admin user to check role
    try {
      const parsedUser = JSON.parse(adminUser);
      if (parsedUser.role !== 'admin') {
        return <Navigate to="/login" replace />;
      }
    } catch (error) {
      return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

export default AdminRoute; 
import React from 'react';
import { Navigate } from 'react-router-dom';

const SuperadminAuth = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));



  if (!user) {
    // User is not authenticated
    return <Navigate to="/login" />;
  }

  if (user.role !== 'superadmin') {
    // User is authenticated but not a superadmin
    return <Navigate to="/login" />;
  }

  // User is authenticated and is a superadmin
  return children;
};



export default SuperadminAuth;

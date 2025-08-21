// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken'); // Changed from 'token' to 'accessToken'
  console.log('Access Token in ProtectedRoute:', token); // Debug

  if (!token) {
    console.log('No access token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
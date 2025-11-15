import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Adjust the import path as needed

function PrivateRoute() {
  // 1. Access Authentication State
  // This hook provides the currentUser and loading state from your AuthContext.
  const { currentUser, loading } = useAuth(); 

  // 2. Handle Initial Loading
  // If the initial Firebase auth check (onAuthStateChanged) hasn't finished, 
  // you return null or a loading indicator to prevent flashing content.
  if (loading) {
    // You can customize this return value. Returning null is common for simple wrappers.
    return null; 
  }

  // 3. Check Authentication Status
  if (currentUser) {
    // If the user is logged in, render the child route content.
    // <Outlet> is mandatory in react-router-dom v6 to render nested routes.
    return <Outlet />;
  }

  // 4. Redirect Unauthenticated User
  // If the user is NOT logged in, redirect them to the /login page.
  // The 'replace' prop prevents the user from hitting the back button to reach the protected page.
  return <Navigate to="/login" replace />;
}

export default PrivateRoute;
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';

const PrivateRoute = ({ allowedRoles }) => {
    const { currentUser, isLoading } = useContext(AuthContext);

    if (isLoading) {
      
        return <div>Loading...</div>; 
    }

    if (!currentUser) {
       
        return <Navigate to="/login" replace />;
    }

   
    const userRole = currentUser.role; 
    if (allowedRoles && !allowedRoles.includes(userRole)) {
       
        return <Navigate to="/unauthorized" replace />;
    }
    
   
    return <Outlet />;
};

export default PrivateRoute;
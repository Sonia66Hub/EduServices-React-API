import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
       
        const user = authService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await authService.login(email, password);
        if (response.isAuthSuccessful) {
            setCurrentUser(response);
        }
        return response;
    };

    const logout = () => {
        authService.logout();
        setCurrentUser(null);
    };

   
    const value = {
        currentUser,
        isLoading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
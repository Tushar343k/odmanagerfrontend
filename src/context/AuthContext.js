import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [role, setRole] = useState(
        localStorage.getItem("role")
    );

    const login = (userRole) => {
        localStorage.setItem("role", userRole);
        setRole(userRole);
    };

    const logout = () => {
        localStorage.removeItem("role");
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
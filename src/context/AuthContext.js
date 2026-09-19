import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [role, setRole] = useState(
        localStorage.getItem("role")
    );

    const [username, setUsername] = useState(
        localStorage.getItem("username")
    );

    const login = (loginData) => {

        const receivedToken = loginData.token;
        const receivedRole = loginData.role;
        const receivedUsername = loginData.username;

        localStorage.setItem("token", receivedToken);
        localStorage.setItem("role", receivedRole);
        localStorage.setItem("username", receivedUsername);

        setToken(receivedToken);
        setRole(receivedRole);
        setUsername(receivedUsername);
    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");

        setToken(null);
        setRole(null);
        setUsername(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{
                token,
                role,
                username,
                isAuthenticated,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
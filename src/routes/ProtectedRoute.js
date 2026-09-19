import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {

    const { isAuthenticated, role } = useAuth();

    // User is not logged in
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // User has wrong role
    if (role !== allowedRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

export default ProtectedRoute;
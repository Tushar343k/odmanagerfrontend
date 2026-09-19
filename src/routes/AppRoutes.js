import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import UploadExcel from "../pages/UploadExcel";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Public Route */}
                <Route
                    path="/"
                    element={<Login />}
                />
                <Route
                    path="/signup"
                    element={<Signup />}
                />
                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />
                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

                {/* Unauthorized */}
                <Route
                    path="/unauthorized"
                    element={<Unauthorized />}
                />

                {/* ADMIN ROUTE */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/upload"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <UploadExcel />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/user"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* USER ROUTE */}
                <Route
                    path="/user"
                    element={
                        <ProtectedRoute allowedRole="USER">
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>

        </BrowserRouter>

    );
}

export default AppRoutes;
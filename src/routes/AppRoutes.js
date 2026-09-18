import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import Unauthorized from "../pages/Unauthorized";

import ProtectedRoute from "./ProtectedRoute";
import UploadExcel from "../pages/UploadExcel";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Public Route */}
                <Route
                    path="/"
                    element={<Login />}
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

            </Routes>

        </BrowserRouter>

    );
}

export default AppRoutes;
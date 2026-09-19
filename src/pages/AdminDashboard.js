import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../api/AxiosConfig";

function AdminDashboard() {

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {

        logout();
        navigate("/");

    };

    const handleDeleteAll = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to delete ALL OD records?\n\nThis action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete("/students/delete-all");

            toast.success(
                "All OD records have been deleted successfully."
            );

        } catch (error) {

            if (error.response) {

                if (error.response.status === 403) {

                    toast.error(
                        "You are not authorized to delete records."
                    );

                } else {

                    toast.error(
                        error.response.data?.message ||
                        "Failed to delete OD records."
                    );

                }

            } else {

                toast.error(
                    "Unable to connect to the server."
                );

            }

        }
    };

    return (

        <div>

            <nav className="navbar">

                <h2>OD Management System</h2>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </nav>

            <div className="dashboard">

                <h1>Admin Dashboard</h1>

                <p>Welcome, Administrator</p>

                <div className="cards">

                    <div className="card">

                        <h3>247</h3>

                        <p>Total OD Records</p>

                    </div>

                    <div className="card">

                        <h3>12</h3>

                        <p>Total Events</p>

                    </div>

                    <div className="card">

                        <h3>8</h3>

                        <p>Uploaded Files</p>

                    </div>

                </div>

                <div className="actions">

                    <button
                        onClick={() =>
                            navigate("/admin/upload")
                        }
                    >
                        Upload Excel
                    </button>

                    <button
                        onClick={() =>
                            navigate("/admin/user")
                        }
                    >
                        View OD Records
                    </button>

                    <button>
                        Upload History
                    </button>

                    <button
                        onClick={handleDeleteAll}
                    >
                        Delete All Records
                    </button>

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;


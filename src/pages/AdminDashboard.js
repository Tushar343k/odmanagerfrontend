import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
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

                    <button onClick={() => navigate("/admin/upload")}>
                        Upload Excel
                    </button>

                    <button onClick={()=>navigate("/admin/user")}>
                        View OD Records
                    </button>

                    <button>
                        Upload History
                    </button>

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;
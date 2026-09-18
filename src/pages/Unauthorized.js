import React from "react";
import { useNavigate } from "react-router-dom";

function Unauthorized() {

    const navigate = useNavigate();

    return (

        <div className="login-container">

            <div className="login-box">

                <h1>Access Denied</h1>

                <p>
                    You don't have permission to access this page.
                </p>

                <button onClick={() => navigate("/")}>
                    Go to Login
                </button>

            </div>

        </div>

    );
}

export default Unauthorized;
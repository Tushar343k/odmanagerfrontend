import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/AxiosConfig";

function ForgotPassword() {

    const [recoveryEmail, setRecoveryEmail] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const handleForgotPassword = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/forgot-password",
                {
                    recoveryEmail: recoveryEmail
                }
            );

            setMessage(
                response.data.message ||
                "Password reset link has been sent."
            );

            setRecoveryEmail("");

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Unable to send password reset link."
                );

            } else {

                setError(
                    "Unable to connect to the server."
                );

            }

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="login-container">

            <div className="login-overlay"></div>

            <div className="login-box">

                <h1>
                    SRM OD MANAGEMENT
                </h1>

                <p>
                    Reset your password
                </p>


                <form
                    className="login-form"
                    onSubmit={handleForgotPassword}
                >

                    {/* RECOVERY EMAIL */}

                    <label>
                        Recovery Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your recovery email"
                        value={recoveryEmail}
                        onChange={(e) =>
                            setRecoveryEmail(e.target.value)
                        }
                        required
                    />


                    {/* ERROR */}

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}


                    {/* SUCCESS */}

                    {message && (
                        <div className="login-success">
                            {message}
                        </div>
                    )}


                    {/* RESET BUTTON */}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Sending..."
                            : "Send Reset Link"
                        }
                    </button>


                    {/* LOGIN LINK */}

                    <p>
                        Remember your password?{" "}
                        <span
                            onClick={() => navigate("/")}
                            style={{
                                cursor: "pointer",
                                textDecoration: "underline"
                            }}
                        >
                            Login
                        </span>
                    </p>

                </form>

            </div>

        </div>

    );
}

export default ForgotPassword;
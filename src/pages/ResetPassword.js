import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/AxiosConfig";

function ResetPassword() {

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");


    const handleResetPassword = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        // Check token
        if (!token) {
            setError("Invalid password reset link.");
            return;
        }

        // Check password match
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {

            const response = await api.post(
                "/auth/reset-password",
                {
                    token: token,
                    newPassword: newPassword
                }
            );

            setMessage(
                response.data.message ||
                "Password has been reset successfully."
            );

            setNewPassword("");
            setConfirmPassword("");

            // Go to login after successful reset
            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Unable to reset password."
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
                    Create a new password
                </p>


                <form
                    className="login-form"
                    onSubmit={handleResetPassword}
                >

                    {/* NEW PASSWORD */}

                    <label>
                        New Password
                    </label>

                    <div className="password-container">

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            required
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showPassword
                                ? <FaEyeSlash />
                                : <FaEye />
                            }
                        </button>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <label>
                        Confirm New Password
                    </label>

                    <div className="password-container">

                        <input
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            required
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                            aria-label={
                                showConfirmPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showConfirmPassword
                                ? <FaEyeSlash />
                                : <FaEye />
                            }
                        </button>

                    </div>


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
                            ? "Resetting..."
                            : "Reset Password"
                        }
                    </button>


                    {/* LOGIN LINK */}

                    <p>
                        <span
                            onClick={() => navigate("/")}
                            style={{
                                cursor: "pointer",
                                textDecoration: "underline"
                            }}
                        >
                            Back to Login
                        </span>
                    </p>

                </form>

            </div>

        </div>

    );
}

export default ResetPassword;
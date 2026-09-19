import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/AxiosConfig";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { login } = useAuth();

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/login",
                {
                    username: username,
                    password: password
                }
            );

            const loginData = response.data;

            // Save JWT token, username and role
            login(loginData);

            // Navigate according to role
            if (loginData.role === "ADMIN") {

                navigate("/admin");

            } else if (loginData.role === "USER") {

                navigate("/user");

            } else {

                setError("Invalid user role.");

            }

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Invalid username or password."
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

                <h1>SRM OD MANAGEMENT</h1>

                <p>Login to your account</p>

                <form
                    className="login-form"
                    onSubmit={handleLogin}
                >

                    <label>Username</label>

                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label>Password</label>

                    <div className="password-container">

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
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

                    {error && (

                        <div className="login-error">
                            {error}
                        </div>

                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"}

                    </button>

                    <p>

                        Don't have an account?{" "}

                        <span
                            onClick={() =>
                                navigate("/signup")
                            }
                            style={{
                                cursor: "pointer",
                                textDecoration: "underline"
                            }}
                        >
                            Signup
                        </span>

                    </p>

                    <p>

                        <span
                            onClick={() =>
                                navigate("/forgot-password")
                            }
                            style={{
                                cursor: "pointer",
                                textDecoration: "underline"
                            }}
                        >
                            Forgot Password?
                        </span>

                    </p>

                </form>

            </div>

        </div>
    );
}

export default Login;


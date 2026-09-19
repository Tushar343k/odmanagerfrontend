import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/AxiosConfig";

function Signup() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [recoveryEmail, setRecoveryEmail] = useState("");
    const [role, setRole] = useState("USER");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const handleSignup = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");

        // Check password match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {

            const response = await api.post(
                "/auth/signup",
                {
                    username: username,
                    password: password,
                    role: role,
                    recoveryEmail: recoveryEmail
                }
            );

            setMessage(
                response.data.message ||
                "Signup successful."
            );

            // Clear form
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setRecoveryEmail("");

            // Go to login after successful signup
            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Signup failed."
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
                    Create your account
                </p>


                <form
                    className="login-form"
                    onSubmit={handleSignup}
                >

                    {/* USERNAME */}

                    <label>
                        Username
                    </label>

                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        required
                    />


                    {/* RECOVERY EMAIL */}

                    <label>
                        Recovery Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter recovery email"
                        value={recoveryEmail}
                        onChange={(e) =>
                            setRecoveryEmail(e.target.value)
                        }
                        required
                    />


                    {/* ROLE */}

                    <label>
                        Role
                    </label>

                    <select
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value)
                        }
                        required
                    >
                        <option value="USER">
                            USER
                        </option>

                        <option value="ADMIN">
                            ADMIN
                        </option>
                    </select>


                    {/* PASSWORD */}

                    <label>
                        Password
                    </label>

                    <div className="password-container">

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Enter password"
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


                    {/* CONFIRM PASSWORD */}

                    <label>
                        Confirm Password
                    </label>

                    <div className="password-container">

                        <input
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
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


                    {/* SIGNUP BUTTON */}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Signup"
                        }
                    </button>


                    {/* LOGIN LINK */}

                    <p>
                        Already have an account?{" "}
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

export default Signup;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const { login } = useAuth();


    const handleLogin = (e) => {

        e.preventDefault();

        setError("");


        // ============================================
        // ADMIN LOGIN
        // ============================================

        if (
            email === "admin@gmail.com" &&
            password === "admin123"
        ) {

            login("ADMIN");

            navigate("/admin");

            return;
        }


        // ============================================
        // USER LOGIN
        // ============================================

        if (
            email === "user@gmail.com" &&
            password === "user123"
        ) {

            login("USER");

            navigate("/user");

            return;
        }


        // ============================================
        // INVALID LOGIN
        // ============================================

        setError("Invalid email or password.");

    };


    return (

        <div className="login-container">

            <div className="login-overlay"></div>

            <div className="login-box">

                <h1>
                    SRM OD MANAGEMENT
                </h1>

                <p>
                    Login to your account
                </p>


                <form
                    className="login-form"
                    onSubmit={handleLogin}
                >

                    {/* EMAIL */}

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />


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
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="login-error">
                            {error}
                        </div>

                    )}


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>

    );

}

export default Login;
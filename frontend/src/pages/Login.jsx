import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { loginUser } from "../services/authService";

function Login() {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        try {

            const response = await loginUser(email, password);

            login(response.user, response.token);

            navigate("/dashboard");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Login failed."
            );

        }

    };

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow border-0">

                        <div className="card-body p-4">

                            <h2 className="text-center mb-4">

                                Login

                            </h2>

                            {error && (

                                <div className="alert alert-danger">

                                    {error}

                                </div>

                            )}

                            <form onSubmit={handleLogin}>

                                <div className="input-group mb-3">

                                    <span className="input-group-text">

                                        <FaEnvelope />

                                    </span>

                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />

                                </div>

                                <div className="input-group mb-3">

                                    <span className="input-group-text">

                                        <FaLock />

                                    </span>

                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                >
                                    Login
                                </button>

                            </form>

                            <p className="text-center mt-3">

                                Don't have an account?

                                <Link to="/register">

                                    {" "}Register

                                </Link>

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Login;
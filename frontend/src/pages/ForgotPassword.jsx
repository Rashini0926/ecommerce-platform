import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await requestPasswordReset(email);
      setMessage(response.message);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send the reset link.");
    }
  };

  return <main className="container py-5" style={{ maxWidth: 520 }}>
    <h1 className="h3">Forgot password?</h1>
    <p className="text-muted">Enter your account email to receive a reset link.</p>
    {message && <div className="alert alert-success">{message}</div>}
    {error && <div className="alert alert-danger">{error}</div>}
    <form onSubmit={submit} className="card card-body shadow-sm">
      <label className="form-label" htmlFor="email">Email address</label>
      <input id="email" className="form-control mb-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button className="btn btn-primary">Send reset link</button>
    </form>
    <Link className="d-inline-block mt-3" to="/login">Back to login</Link>
  </main>;
}

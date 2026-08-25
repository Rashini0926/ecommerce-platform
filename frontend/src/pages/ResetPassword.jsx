import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") || "");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault(); setError("");
    try {
      const response = await resetPassword({ email, token: params.get("token"), password, password_confirmation: confirmation });
      setMessage(response.message);
    } catch (err) { setError(err.response?.data?.message || "Password reset failed."); }
  };

  return <main className="container py-5" style={{ maxWidth: 520 }}>
    <h1 className="h3">Reset password</h1>
    {message && <div className="alert alert-success">{message} <Link to="/login">Login now</Link></div>}
    {error && <div className="alert alert-danger">{error}</div>}
    <form onSubmit={submit} className="card card-body shadow-sm">
      <input className="form-control mb-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="form-control mb-3" type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} minLength="8" required />
      <input className="form-control mb-3" type="password" placeholder="Confirm password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} minLength="8" required />
      <button className="btn btn-primary">Reset password</button>
    </form>
  </main>;
}

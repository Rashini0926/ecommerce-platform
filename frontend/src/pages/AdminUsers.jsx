import { useEffect, useState } from "react";
import { FaCheck, FaUsers } from "react-icons/fa";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const authConfig = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export default function AdminUsers() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/users", { ...authConfig(token), params: status ? { status } : {} });
        setUsers(response.data.users.data || []);
      } catch (err) { setError(err.response?.data?.message || "Unable to load users."); }
      finally { setLoading(false); }
    };
    if (token) load();
  }, [token, status]);

  const updateStatus = async (account, nextStatus) => {
    setUpdating(account.id); setError("");
    try {
      const response = await api.patch(`/admin/users/${account.id}/status`, { status: nextStatus }, authConfig(token));
      setUsers((list) => list.map((item) => item.id === account.id ? response.data.user : item));
    } catch (err) { setError(err.response?.data?.message || "Unable to update user status."); }
    finally { setUpdating(null); }
  };

  return <div className="app-page bg-light-subtle min-vh-100"><Navbar /><main className="container py-5">
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"><div><span className="section-kicker">Platform administration</span><h1 className="mt-2 mb-1"><FaUsers className="me-2 text-danger" />User management</h1><p className="text-muted mb-0">Approve seller accounts and manage platform access.</p></div><select className="form-select" style={{ maxWidth: 200 }} value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All account statuses</option><option value="PENDING">Pending approval</option><option value="ACTIVE">Active</option><option value="SUSPENDED">Suspended</option></select></div>
    {error && <div className="alert alert-danger">{error}</div>}
    {loading ? <div className="text-center py-5"><LoadingSpinner size="lg" text="Loading users..." /></div> : <div className="card border-0 shadow-sm"><div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th className="ps-4">User</th><th>Role</th><th>Status</th><th>Joined</th><th className="text-end pe-4">Actions</th></tr></thead><tbody>{users.map((account) => <tr key={account.id}><td className="ps-4"><strong>{account.full_name}</strong><small className="d-block text-muted">{account.email}<br />{account.phone}</small></td><td><span className="badge text-bg-secondary">{account.role}</span></td><td><span className={`badge ${account.status === "ACTIVE" ? "text-bg-success" : account.status === "PENDING" ? "text-bg-warning" : "text-bg-danger"}`}>{account.status}</span></td><td>{new Date(account.created_at).toLocaleDateString()}</td><td className="text-end pe-4">{account.id === user?.id ? <small className="text-muted">Current admin</small> : <div className="btn-group btn-group-sm">{account.status !== "ACTIVE" && <button className="btn btn-outline-success" disabled={updating === account.id} onClick={() => updateStatus(account, "ACTIVE")}><FaCheck className="me-1" />Approve</button>}{account.status !== "SUSPENDED" && <button className="btn btn-outline-danger" disabled={updating === account.id} onClick={() => updateStatus(account, "SUSPENDED")}>Suspend</button>}</div>}</td></tr>)}</tbody></table></div></div>}
  </main><Footer /></div>;
}

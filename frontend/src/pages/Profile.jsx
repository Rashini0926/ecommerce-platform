import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUser,
  FaUserTag,
} from "react-icons/fa";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";

function Profile() {
  const { user, token, login, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profile, setProfile] = useState({ full_name: user?.full_name || "", phone: user?.phone || "" });
  const [passwords, setPasswords] = useState({ current_password: "", password: "", password_confirmation: "" });
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  const saveProfile = async (event) => {
    event.preventDefault();
    try { const response = await api.patch("/profile", profile, authConfig); login(response.data.user, token); setEditing(false); showToast(response.data.message, "success"); }
    catch (err) { showToast(err.response?.data?.message || "Unable to update profile.", "danger"); }
  };
  const savePassword = async (event) => {
    event.preventDefault();
    try { const response = await api.patch("/profile/password", passwords, authConfig); showToast(response.data.message, "success"); logout(); navigate("/login"); }
    catch (err) { showToast(err.response?.data?.message || "Unable to change password.", "danger"); }
  };

  return (
    <div className="app-page">
      <Navbar />

      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card glass-card border-0">
              <div className="card-body p-4 p-lg-5">
                <div className="text-center mb-5 slide-up">
                  <div className="profile-avatar mx-auto mb-3">
                    <FaUser size={54} />
                  </div>

                  <h2 className="mt-3 mb-2">
                    {user?.full_name}
                  </h2>

                  <span className="badge bg-success">
                    {user?.role}
                  </span>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="info-row h-100">
                      <div className="text-muted fw-semibold mb-2">
                        <FaEnvelope className="me-2 text-primary" />
                        Email
                      </div>

                      <div className="fw-bold">
                        {user?.email}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="info-row h-100">
                      <div className="text-muted fw-semibold mb-2">
                        <FaPhone className="me-2 text-primary" />
                        Phone
                      </div>

                      <div className="fw-bold">
                        {user?.phone || "Not Added"}
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="info-row">
                      <div className="text-muted fw-semibold mb-2">
                        <FaUserTag className="me-2 text-primary" />
                        Role
                      </div>

                      <div className="fw-bold">
                        {user?.role}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column flex-sm-row gap-3">
                  <button className="btn btn-primary ripple" onClick={() => setEditing(!editing)}>
                    <FaEdit className="me-2" />
                    Edit Profile
                  </button>

                  <button className="btn btn-outline-secondary" onClick={() => setChangingPassword(!changingPassword)}>
                    <FaLock className="me-2" />
                    Change Password
                  </button>
                </div>
                {editing && <form className="mt-4 border-top pt-4" onSubmit={saveProfile}><h5>Edit profile</h5><div className="row g-3"><div className="col-md-6"><input className="form-control" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} placeholder="Full name" required /></div><div className="col-md-6"><input className="form-control" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="Phone number" required /></div></div><button className="btn btn-primary mt-3">Save changes</button></form>}
                {changingPassword && <form className="mt-4 border-top pt-4" onSubmit={savePassword}><h5>Change password</h5><div className="row g-3">{[["current_password", "Current password"], ["password", "New password"], ["password_confirmation", "Confirm new password"]].map(([key, label]) => <div className="col-md-4" key={key}><input className="form-control" type="password" placeholder={label} value={passwords[key]} onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })} minLength="8" required /></div>)}</div><button className="btn btn-outline-secondary mt-3">Update password</button></form>}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;

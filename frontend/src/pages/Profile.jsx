import { useAuth } from "../context/AuthContext";
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

function Profile() {
  const { user } = useAuth();

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
                  <button className="btn btn-primary ripple">
                    <FaEdit className="me-2" />
                    Edit Profile
                  </button>

                  <button className="btn btn-outline-secondary">
                    <FaLock className="me-2" />
                    Change Password
                  </button>
                </div>
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

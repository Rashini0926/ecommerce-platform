import { useAuth } from "../context/AuthContext";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaUserTag,
  FaEdit,
  FaLock,
} from "react-icons/fa";

function Profile() {
  const { user } = useAuth();

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-lg-8">

          <div className="card shadow border-0">

            <div className="card-body p-5">

              <div className="text-center mb-4">

                <FaUserCircle
                  size={100}
                  className="text-primary"
                />

                <h2 className="mt-3">
                  {user?.full_name}
                </h2>

                <span className="badge bg-success">
                  {user?.role}
                </span>

              </div>

              <hr />

              <div className="row mb-3">

                <div className="col-md-4 fw-bold">
                  <FaEnvelope className="me-2" />
                  Email
                </div>

                <div className="col-md-8">
                  {user?.email}
                </div>

              </div>

              <div className="row mb-3">

                <div className="col-md-4 fw-bold">
                  <FaPhone className="me-2" />
                  Phone
                </div>

                <div className="col-md-8">
                  {user?.phone || "Not Added"}
                </div>

              </div>

              <div className="row mb-4">

                <div className="col-md-4 fw-bold">
                  <FaUserTag className="me-2" />
                  Role
                </div>

                <div className="col-md-8">
                  {user?.role}
                </div>

              </div>

              <div className="d-flex gap-3">

                <button className="btn btn-primary">
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

    </div>
  );
}

export default Profile;
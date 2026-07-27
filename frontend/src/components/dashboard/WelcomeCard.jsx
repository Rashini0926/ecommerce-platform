import { useAuth } from "../../context/AuthContext";
import { FaRegSmile, FaUserCircle } from "react-icons/fa";

function WelcomeCard() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="card dashboard-banner shadow-sm mb-4 slide-up">
      <div className="card-body p-4 p-lg-5 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
        <div className="d-flex align-items-center gap-3">
          <FaUserCircle size={74} className="text-white" />

          <div>
            <span className="badge bg-light text-primary mb-2">
              <FaRegSmile className="me-2" />
              Customer dashboard
            </span>

            <h2 className="mb-1">
              {getGreeting()}, {user?.full_name}
            </h2>

            <p className="mb-0 text-white-50">
              {user?.email}
            </p>
          </div>
        </div>

        <span className="badge bg-success align-self-start align-self-md-center">
          {user?.role}
        </span>
      </div>
    </div>
  );
}

export default WelcomeCard;

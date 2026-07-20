import { useAuth } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

function WelcomeCard() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body d-flex align-items-center">

        <FaUserCircle
          size={70}
          className="text-primary me-4"
        />

        <div>

          <h3 className="mb-1">
            {getGreeting()}, {user?.full_name} 👋
          </h3>

          <p className="text-muted mb-1">
            {user?.email}
          </p>

          <span className="badge bg-success">
            {user?.role}
          </span>

        </div>

      </div>
    </div>
  );
}

export default WelcomeCard;
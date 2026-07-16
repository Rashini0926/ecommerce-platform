import { useAuth } from "../../context/AuthContext";

function WelcomeCard() {
  const { user } = useAuth();

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h3>Welcome, {user?.name} 👋</h3>
        <p className="text-muted mb-0">{user?.email}</p>
      </div>
    </div>
  );
}

export default WelcomeCard;
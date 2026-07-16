import { useAuth } from "../context/AuthContext";

function Dashboard() {

  const { user } = useAuth();

  return (
    <div className="container mt-5">

      <h2>Customer Dashboard</h2>

      <hr />

      <h4>Welcome {user?.name}</h4>

      <p>{user?.email}</p>

    </div>
  );
}

export default Dashboard;
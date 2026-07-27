import WelcomeCard from "../components/dashboard/WelcomeCard";
import SummaryCard from "../components/dashboard/SummaryCard";

function Dashboard() {
  return (
    <div className="container mt-4">
      <WelcomeCard />

      <div className="row">
        <SummaryCard title="Orders" value="0" color="primary" />
        <SummaryCard title="Wishlist" value="0" color="danger" />
        <SummaryCard title="Cart" value="0" color="success" />
      </div>
    </div>
  );
}

export default Dashboard;
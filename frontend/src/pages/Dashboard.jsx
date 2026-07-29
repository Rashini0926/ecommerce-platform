import {
  FaBoxOpen,
  FaCreditCard,
  FaGift,
  FaHeart,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaShoppingCart,
  FaTruck,
} from "react-icons/fa";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import SummaryCard from "../components/dashboard/SummaryCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentOrders from "../components/dashboard/RecentOrders";

const deliverySteps = [
  {
    title: "Order Placed",
    text: "Your latest order has been received.",
    icon: <FaShoppingBag />,
    active: true,
  },
  {
    title: "Packed",
    text: "Seller is preparing the package.",
    icon: <FaBoxOpen />,
    active: true,
  },
  {
    title: "On Delivery",
    text: "Courier pickup is pending.",
    icon: <FaTruck />,
    active: false,
  },
];

const accountTasks = [
  {
    title: "Profile information",
    value: "Complete",
    icon: <FaMapMarkerAlt />,
    color: "success",
  },
  {
    title: "Payment method",
    value: "Pending",
    icon: <FaCreditCard />,
    color: "primary",
  },
  {
    title: "Reward coupons",
    value: "2 available",
    icon: <FaGift />,
    color: "danger",
  },
];

function Dashboard() {
  return (
    <div className="app-page">
      <Navbar />

      <main className="container py-5">
        <WelcomeCard />

        <div className="row g-4 mb-4">
          <SummaryCard
            title="Total Orders"
            value="3"
            description="Recent customer order activity"
            icon={<FaShoppingBag />}
            color="primary"
            link="/products"
            linkLabel="Shop More"
          />

          <SummaryCard
            title="Wishlist Items"
            value="3"
            description="Saved products ready to review"
            icon={<FaHeart />}
            color="danger"
            link="/wishlist"
          />

          <SummaryCard
            title="Cart Items"
            value="2"
            description="Products waiting for checkout"
            icon={<FaShoppingCart />}
            color="success"
            link="/cart"
          />

          <SummaryCard
            title="Coupons"
            value="2"
            description="Available offers for your next order"
            icon={<FaGift />}
            color="primary"
            link="/products"
            linkLabel="Use Offers"
          />
        </div>

        <div className="row g-4 mb-4">
          <div className="col-xl-8">
            <RecentOrders />
          </div>

          <div className="col-xl-4">
            <div className="card glass-card h-100">
              <div className="card-body p-4">
                <span className="section-kicker">Delivery tracking</span>
                <h4 className="mb-4 mt-2">Latest Order Status</h4>

                <div className="dashboard-timeline">
                  {deliverySteps.map((step) => (
                    <div
                      className={`dashboard-timeline-item ${step.active ? "active" : ""}`}
                      key={step.title}
                    >
                      <span className="dashboard-timeline-icon">
                        {step.icon}
                      </span>

                      <span>
                        <strong>{step.title}</strong>
                        <small>{step.text}</small>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-xl-8">
            <QuickActions />
          </div>

          <div className="col-xl-4">
            <div className="card glass-card h-100">
              <div className="card-body p-4">
                <span className="section-kicker">Account readiness</span>
                <h4 className="mb-4 mt-2">Customer Setup</h4>

                <div className="d-grid gap-3">
                  {accountTasks.map((task) => (
                    <div className="dashboard-task" key={task.title}>
                      <span className={`dashboard-task-icon dashboard-task-${task.color}`}>
                        {task.icon}
                      </span>

                      <span>
                        <strong>{task.title}</strong>
                        <small>{task.value}</small>
                      </span>
                    </div>
                  ))}
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

export default Dashboard;

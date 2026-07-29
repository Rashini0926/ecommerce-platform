import {
  FaArrowUp,
  FaBoxOpen,
  FaChartLine,
  FaClipboardList,
  FaClock,
  FaExclamationTriangle,
  FaEye,
  FaMoneyBillWave,
  FaShippingFast,
  FaStar,
  FaStore,
  FaWallet,
} from "react-icons/fa";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";

const sellerStats = [
  {
    title: "Monthly Revenue",
    value: "Rs. 245,800",
    note: "12% increase this month",
    icon: <FaMoneyBillWave />,
    color: "success",
  },
  {
    title: "Active Products",
    value: "48",
    note: "6 products need review",
    icon: <FaBoxOpen />,
    color: "primary",
  },
  {
    title: "Pending Orders",
    value: "14",
    note: "Ready for seller action",
    icon: <FaClipboardList />,
    color: "danger",
  },
  {
    title: "Store Rating",
    value: "4.7",
    note: "Based on customer reviews",
    icon: <FaStar />,
    color: "success",
  },
];

const orderQueue = [
  {
    id: "SO-2091",
    customer: "Nimal Perera",
    item: "Wireless Headphones",
    amount: "Rs. 8,500",
    status: "To Pack",
    color: "danger",
  },
  {
    id: "SO-2088",
    customer: "Ama Silva",
    item: "Smart Watch",
    amount: "Rs. 12,000",
    status: "Ready to Ship",
    color: "primary",
  },
  {
    id: "SO-2084",
    customer: "Kavindu Jay",
    item: "Laptop Backpack",
    amount: "Rs. 4,500",
    status: "Completed",
    color: "success",
  },
];

const inventoryAlerts = [
  {
    product: "Bluetooth Speaker",
    stock: "4 left",
    type: "Low stock",
    color: "danger",
  },
  {
    product: "Cotton Casual Shirt",
    stock: "12 left",
    type: "Selling fast",
    color: "primary",
  },
  {
    product: "Skincare Gift Box",
    stock: "18 left",
    type: "Healthy",
    color: "success",
  },
];

const performanceItems = [
  {
    label: "Response Rate",
    value: "96%",
    width: "96%",
  },
  {
    label: "On-time Shipping",
    value: "91%",
    width: "91%",
  },
  {
    label: "Positive Reviews",
    value: "88%",
    width: "88%",
  },
];

function SellerDashboard() {
  const { user } = useAuth();

  return (
    <div className="app-page">
      <Navbar />

      <main className="container py-5">
        <section className="seller-hero mb-4">
          <div className="seller-hero-content">
            <div>
              <span className="badge bg-light text-primary mb-3">
                <FaStore className="me-2" />
                Seller workspace
              </span>

              <h1 className="mb-2">
                Welcome back, {user?.full_name || "Seller"}
              </h1>

              <p className="mb-0 text-white-50">
                Monitor store performance, order activity, revenue, and customer service readiness.
              </p>
            </div>

            <div className="seller-hero-panel">
              <span>Available Balance</span>
              <strong>Rs. 82,450</strong>
              <small>Next payout scheduled after order verification</small>
            </div>
          </div>
        </section>

        <div className="row g-4 mb-4">
          {sellerStats.map((stat) => (
            <div className="col-sm-6 col-xl-3" key={stat.title}>
              <div className="card seller-stat-card h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
                    <span className={`seller-stat-icon seller-stat-${stat.color}`}>
                      {stat.icon}
                    </span>

                    <span className={`badge badge-soft-${stat.color}`}>
                      Live
                    </span>
                  </div>

                  <p className="text-muted fw-bold mb-1">{stat.title}</p>
                  <h3 className="mb-2">{stat.value}</h3>
                  <small className="text-muted">{stat.note}</small>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4 mb-4">
          <div className="col-xl-8">
            <div className="card glass-card h-100">
              <div className="card-body p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                  <div>
                    <span className="section-kicker">Order operations</span>
                    <h4 className="mb-0 mt-2">Seller Order Queue</h4>
                  </div>

                  <span className="badge badge-soft-primary">
                    <FaShippingFast className="me-2" />
                    14 pending
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="table seller-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orderQueue.map((order) => (
                        <tr key={order.id}>
                          <td className="fw-bold">{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{order.item}</td>
                          <td className="fw-bold">{order.amount}</td>
                          <td>
                            <span className={`badge badge-soft-${order.color}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card glass-card h-100">
              <div className="card-body p-4">
                <span className="section-kicker">Store health</span>
                <h4 className="mb-4 mt-2">Performance Overview</h4>

                <div className="d-grid gap-4">
                  {performanceItems.map((item) => (
                    <div key={item.label}>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="fw-bold">{item.label}</span>
                        <span className="text-muted fw-bold">{item.value}</span>
                      </div>

                      <div className="seller-progress">
                        <span style={{ width: item.width }}></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-xl-7">
            <div className="card glass-card h-100">
              <div className="card-body p-4">
                <span className="section-kicker">Inventory insight</span>
                <h4 className="mb-4 mt-2">Stock Alerts</h4>

                <div className="d-grid gap-3">
                  {inventoryAlerts.map((alert) => (
                    <div className="seller-alert-item" key={alert.product}>
                      <span className={`seller-alert-icon seller-stat-${alert.color}`}>
                        <FaExclamationTriangle />
                      </span>

                      <div className="flex-grow-1">
                        <strong>{alert.product}</strong>
                        <small>{alert.stock}</small>
                      </div>

                      <span className={`badge badge-soft-${alert.color}`}>
                        {alert.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-5">
            <div className="card glass-card h-100">
              <div className="card-body p-4">
                <span className="section-kicker">Today snapshot</span>
                <h4 className="mb-4 mt-2">Seller Tasks</h4>

                <div className="seller-task-grid">
                  <div className="seller-task">
                    <FaClock />
                    <strong>Pack pending orders</strong>
                    <small>14 orders awaiting action</small>
                  </div>

                  <div className="seller-task">
                    <FaWallet />
                    <strong>Review payout</strong>
                    <small>Rs. 82,450 available balance</small>
                  </div>

                  <div className="seller-task">
                    <FaEye />
                    <strong>Check product visibility</strong>
                    <small>48 active listings visible</small>
                  </div>

                  <div className="seller-task">
                    <FaChartLine />
                    <strong>Track growth</strong>
                    <small>
                      <FaArrowUp className="me-1 text-success" />
                      Revenue trend is improving
                    </small>
                  </div>
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

export default SellerDashboard;

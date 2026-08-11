import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowUp,
  FaBoxOpen,
  FaBoxes,
  FaChartLine,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaEnvelope,
  FaExclamationTriangle,
  FaEye,
  FaMoneyBillWave,
  FaPlus,
  FaRegStar,
  FaReply,
  FaShippingFast,
  FaSlidersH,
  FaStar,
  FaStore,
  FaTag,
  FaTrophy,
  FaTruck,
  FaUserCheck,
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
    note: "Based on 128 customer reviews",
    icon: <FaStar />,
    color: "success",
  },
];

const salesChartData = [
  { month: "Jan", sales: 140000, height: "55%" },
  { month: "Feb", sales: 175000, height: "70%" },
  { month: "Mar", sales: 160000, height: "64%" },
  { month: "Apr", sales: 210000, height: "84%" },
  { month: "May", sales: 190000, height: "76%" },
  { month: "Jun", sales: 245800, height: "100%" },
];

const categorySales = [
  { category: "Electronics & Gadgets", percent: "45%", amount: "Rs. 110,610", color: "primary" },
  { category: "Fashion & Apparel", percent: "30%", amount: "Rs. 73,740", color: "success" },
  { category: "Home & Living", percent: "25%", amount: "Rs. 61,450", color: "accent" },
];

const shippingOverview = [
  { status: "Ready to Pack", count: 5, icon: <FaBoxes />, color: "danger", badge: "Urgent" },
  { status: "Ready to Ship", count: 6, icon: <FaShippingFast />, color: "primary", badge: "Processing" },
  { status: "In Transit", count: 8, icon: <FaTruck />, color: "accent", badge: "On the way" },
  { status: "Delivered (This Month)", count: 124, icon: <FaCheckCircle />, color: "success", badge: "Completed" },
];

const topSellingProducts = [
  {
    rank: 1,
    name: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    sold: 120,
    price: "Rs. 8,500",
    revenue: "Rs. 1,020,000",
    stock: "In Stock (35)",
    stockColor: "success",
  },
  {
    rank: 2,
    name: "Smart Fitness Watch Series 5",
    category: "Wearables",
    sold: 85,
    price: "Rs. 12,000",
    revenue: "Rs. 1,020,000",
    stock: "Low Stock (4 left)",
    stockColor: "danger",
  },
  {
    rank: 3,
    name: "Ergonomic Aluminum Laptop Stand",
    category: "Accessories",
    sold: 64,
    price: "Rs. 4,500",
    revenue: "Rs. 288,000",
    stock: "In Stock (18)",
    stockColor: "success",
  },
];

const latestReviews = [
  {
    id: 1,
    customer: "Kasun Perera",
    rating: 5,
    product: "Wireless Noise-Canceling Headphones",
    comment: "Super fast delivery and incredible sound quality! Seller was very responsive to queries.",
    date: "2 hours ago",
    verified: true,
  },
  {
    id: 2,
    customer: "Dilini Fernando",
    rating: 4,
    product: "Smart Fitness Watch Series 5",
    comment: "Great watch with excellent battery life. Packaging was neat and sturdy.",
    date: "Yesterday",
    verified: true,
  },
  {
    id: 3,
    customer: "Ruwan Jayasinghe",
    rating: 5,
    product: "Ergonomic Aluminum Laptop Stand",
    comment: "Very durable build quality and helps improve my working posture.",
    date: "3 days ago",
    verified: true,
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
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReplySubmit = (e, reviewId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    triggerToast(`Response posted for review #${reviewId}!`);
    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <div className="app-page">
      <Navbar />

      {toastMessage && (
        <div className="toast-stack">
          <div className="app-toast app-toast-info">
            <span className="app-toast-icon"><FaCheckCircle /></span>
            <div className="app-toast-message">{toastMessage}</div>
            <button className="app-toast-close" onClick={() => setToastMessage(null)}>×</button>
          </div>
        </div>
      )}

      <main className="container py-5">
        {/* Seller Hero Section */}
        <section className="seller-hero mb-4">
          <div className="seller-hero-content">
            <div>
              <span className="badge bg-light text-primary mb-3">
                <FaStore className="me-2" />
                Seller Workspace
              </span>

              <h1 className="mb-2">
                Welcome back, {user?.full_name || "Official Seller"}
              </h1>

              <p className="mb-0 text-white-50">
                Monitor store analytics, sales growth, pending shipments, top products, and customer satisfaction.
              </p>
            </div>

            <div className="seller-hero-panel">
              <span>Available Balance</span>
              <strong>Rs. 82,450</strong>
              <small>Next payout scheduled after order verification</small>
            </div>
          </div>
        </section>

        {/* Store Profile Card & Quick Actions */}
        <div className="row g-4 mb-4">
          <div className="col-lg-5 col-xl-4">
            <div className="card glass-card h-100 seller-store-card">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="seller-avatar-lg">
                    <FaStore />
                  </div>
                  <div>
                    <h5 className="mb-1 fw-bold">{user?.full_name || "TechWorld"} Store</h5>
                    <span className="badge badge-soft-success d-inline-flex align-items-center gap-1">
                      <FaUserCheck /> Verified Seller
                    </span>
                  </div>
                </div>

                <hr className="my-3 opacity-25" />

                <div className="d-grid gap-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Store Rating</span>
                    <span className="fw-bold text-warning d-flex align-items-center gap-1">
                      <FaStar /> 4.7 / 5.0 (128 reviews)
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Seller Member Since</span>
                    <span className="fw-bold small">Jan 2024</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Listed Products</span>
                    <span className="fw-bold small">48 Products</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Response Speed</span>
                    <span className="badge badge-soft-primary">Within 1 Hour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7 col-xl-8">
            <div className="card glass-card h-100">
              <div className="card-body p-4">
                <span className="section-kicker">Quick Actions</span>
                <h4 className="mb-4 mt-2">Seller Control Panel</h4>

                <div className="seller-quick-actions-grid">
                  <button
                    className="seller-quick-btn seller-quick-btn-primary"
                    onClick={() => navigate("/seller/products")}
                  >
                    <FaPlus className="quick-icon" />
                    <div>
                      <strong>Add New Product</strong>
                      <small>Create product listing</small>
                    </div>
                  </button>

                  <button
                    className="seller-quick-btn"
                    onClick={() => navigate("/seller/products")}
                  >
                    <FaBoxes className="quick-icon text-primary" />
                    <div>
                      <strong>Manage Inventory</strong>
                      <small>48 total listings</small>
                    </div>
                  </button>

                  <button
                    className="seller-quick-btn"
                    onClick={() => triggerToast("Payout requests processed every Friday.")}
                  >
                    <FaWallet className="quick-icon text-success" />
                    <div>
                      <strong>View Payouts</strong>
                      <small>Rs. 82,450 ready</small>
                    </div>
                  </button>

                  <button
                    className="seller-quick-btn"
                    onClick={() => triggerToast("3 unread customer messages.")}
                  >
                    <FaEnvelope className="quick-icon text-accent" />
                    <div>
                      <strong>Customer Messages</strong>
                      <small>3 pending chats</small>
                    </div>
                  </button>

                  <button
                    className="seller-quick-btn"
                    onClick={() => triggerToast("Store settings opened.")}
                  >
                    <FaSlidersH className="quick-icon text-muted" />
                    <div>
                      <strong>Store Settings</strong>
                      <small>Profile & policies</small>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Summary Stats */}
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

        {/* Sales Analytics UI & Category Breakdown */}
        <div className="row g-4 mb-4">
          <div className="col-xl-8">
            <div className="card glass-card h-100">
              <div className="card-body p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                  <div>
                    <span className="section-kicker">Revenue & Growth</span>
                    <h4 className="mb-0 mt-2">Sales Analytics (UI)</h4>
                  </div>

                  <span className="badge badge-soft-success d-flex align-items-center gap-1">
                    <FaArrowUp /> +18.4% YoY Growth
                  </span>
                </div>

                <div className="sales-chart-container mb-4">
                  <div className="sales-chart-bars">
                    {salesChartData.map((data) => (
                      <div className="sales-bar-wrapper" key={data.month}>
                        <div className="sales-bar-value">Rs. {(data.sales / 1000).toFixed(0)}k</div>
                        <div
                          className="sales-bar"
                          style={{ height: data.height }}
                          title={`${data.month}: Rs. ${data.sales.toLocaleString()}`}
                        ></div>
                        <span className="sales-bar-label">{data.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="row g-3 pt-2">
                  <div className="col-6 col-md-3">
                    <div className="p-3 bg-surface-soft border rounded-3 text-center">
                      <span className="text-muted small d-block">Avg Order Value</span>
                      <strong className="fs-5">Rs. 6,850</strong>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 bg-surface-soft border rounded-3 text-center">
                      <span className="text-muted small d-block">Conversion Rate</span>
                      <strong className="fs-5 text-success">3.4%</strong>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 bg-surface-soft border rounded-3 text-center">
                      <span className="text-muted small d-block">Store Views</span>
                      <strong className="fs-5 text-primary">14.2k</strong>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 bg-surface-soft border rounded-3 text-center">
                      <span className="text-muted small d-block">Repeat Buyers</span>
                      <strong className="fs-5 text-accent">24%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card glass-card h-100">
              <div className="card-body p-4">
                <span className="section-kicker">Revenue Distribution</span>
                <h4 className="mb-4 mt-2">Sales by Category</h4>

                <div className="d-grid gap-4">
                  {categorySales.map((cat) => (
                    <div key={cat.category}>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="fw-bold small">{cat.category}</span>
                        <span className="fw-bold small text-primary">{cat.amount} ({cat.percent})</span>
                      </div>
                      <div className="seller-progress">
                        <span style={{ width: cat.percent }}></span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 border rounded-3 bg-light-soft text-muted small">
                  <FaTag className="me-2 text-accent" />
                  <strong>Insight:</strong> Electronics continues to be your highest revenue generating category this quarter.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Overview UI */}
        <div className="card glass-card mb-4">
          <div className="card-body p-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
              <div>
                <span className="section-kicker">Logistics pipeline</span>
                <h4 className="mb-0 mt-2">Shipping & Fulfillment Overview (UI)</h4>
              </div>

              <span className="badge badge-soft-primary">
                <FaTruck className="me-1" /> 98.2% On-time SLA
              </span>
            </div>

            <div className="row g-3">
              {shippingOverview.map((item) => (
                <div className="col-sm-6 col-lg-3" key={item.status}>
                  <div className="p-3 border rounded-3 bg-surface-soft h-100 d-flex align-items-center gap-3">
                    <span className={`seller-stat-icon seller-stat-${item.color}`}>
                      {item.icon}
                    </span>
                    <div>
                      <span className={`badge badge-soft-${item.color} mb-1`}>{item.badge}</span>
                      <h4 className="mb-0 fw-bold">{item.count}</h4>
                      <small className="text-muted fw-bold">{item.status}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Queue & Store Performance */}
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
                        <th>Action</th>
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
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1"
                              onClick={() => triggerToast(`Viewing details for ${order.id}`)}
                            >
                              Manage
                            </button>
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

        {/* Top Selling Products & Latest Customer Reviews */}
        <div className="row g-4 mb-4">
          <div className="col-xl-6">
            <div className="card glass-card h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <span className="section-kicker">Product Leaders</span>
                    <h4 className="mb-0 mt-2">Top Selling Products</h4>
                  </div>
                  <FaTrophy className="text-warning fs-3" />
                </div>

                <div className="d-grid gap-3">
                  {topSellingProducts.map((prod) => (
                    <div className="top-product-item p-3 border rounded-3 bg-surface-soft d-flex align-items-center justify-content-between gap-3" key={prod.name}>
                      <div className="d-flex align-items-center gap-3">
                        <span className={`top-product-rank rank-${prod.rank}`}>
                          #{prod.rank}
                        </span>
                        <div>
                          <strong className="d-block text-truncate" style={{ maxWidth: "220px" }}>{prod.name}</strong>
                          <small className="text-muted">{prod.category} • {prod.sold} units sold</small>
                        </div>
                      </div>

                      <div className="text-end">
                        <span className="fw-bold d-block text-primary">{prod.revenue}</span>
                        <span className={`badge badge-soft-${prod.stockColor} small`}>{prod.stock}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="card glass-card h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <span className="section-kicker">Feedback Loop</span>
                    <h4 className="mb-0 mt-2">Latest Customer Reviews</h4>
                  </div>
                  <span className="badge badge-soft-warning">4.7 ⭐ Rating</span>
                </div>

                <div className="d-grid gap-3">
                  {latestReviews.map((rev) => (
                    <div className="p-3 border rounded-3 bg-surface-soft" key={rev.id}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong className="me-2">{rev.customer}</strong>
                          {rev.verified && (
                            <span className="badge badge-soft-success py-0 px-2 small">Verified Purchase</span>
                          )}
                        </div>
                        <span className="text-muted small">{rev.date}</span>
                      </div>

                      <div className="text-warning small mb-2">
                        {[...Array(5)].map((_, i) => (
                          i < rev.rating ? <FaStar key={i} className="me-1" /> : <FaRegStar key={i} className="me-1" />
                        ))}
                      </div>

                      <p className="mb-2 small text-muted">
                        "{rev.comment}"
                      </p>

                      <div className="d-flex justify-content-between align-items-center pt-1">
                        <small className="text-primary fw-bold">{rev.product}</small>
                        <button
                          className="btn btn-sm btn-link text-decoration-none p-0 text-primary small d-flex align-items-center gap-1"
                          onClick={() => setReplyingTo(replyingTo === rev.id ? null : rev.id)}
                        >
                          <FaReply /> Reply
                        </button>
                      </div>

                      {replyingTo === rev.id && (
                        <form onSubmit={(e) => handleReplySubmit(e, rev.id)} className="mt-3">
                          <div className="input-group input-group-sm">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Write a response..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                            />
                            <button className="btn btn-primary" type="submit">
                              Send
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Alerts & Seller Tasks */}
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

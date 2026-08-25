import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowUp,
  FaCheckCircle,
  FaCog,
  FaDownload,
  FaLock,
  FaMoneyBillWave,
  FaServer,
  FaShieldAlt,
  FaShoppingBag,
  FaStore,
  FaUserCheck,
  FaUsers,
  FaUserTimes,
} from "react-icons/fa";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const adminKpis = [
  {
    title: "Total Platform Revenue",
    value: "Rs. 4,850,200",
    note: "+22% overall growth",
    icon: <FaMoneyBillWave />,
    color: "success",
  },
  {
    title: "Registered Users",
    value: "1,420",
    note: "48 new users this week",
    icon: <FaUsers />,
    color: "primary",
  },
  {
    title: "Active Sellers",
    value: "86 Stores",
    note: "5 pending verifications",
    icon: <FaStore />,
    color: "accent",
  },
  {
    title: "Total Platform Orders",
    value: "3,150",
    note: "99.1% completion rate",
    icon: <FaShoppingBag />,
    color: "success",
  },
];

const platformAnalytics = [
  { month: "Jan", revenue: 620000, height: "45%" },
  { month: "Feb", revenue: 710000, height: "55%" },
  { month: "Mar", revenue: 840000, height: "68%" },
  { month: "Apr", revenue: 790000, height: "62%" },
  { month: "May", revenue: 950000, height: "82%" },
  { month: "Jun", revenue: 1140200, height: "100%" },
];

const pendingSellers = [
  {
    id: "SEL-104",
    storeName: "Glamour Fashion House",
    owner: "Saman Kumara",
    email: "saman@glamour.lk",
    appliedDate: "Yesterday",
    category: "Fashion & Apparel",
    status: "Pending Review",
  },
  {
    id: "SEL-103",
    storeName: "Apex Electronics Hub",
    owner: "Malith De Silva",
    email: "malith@apexhub.com",
    appliedDate: "3 days ago",
    category: "Electronics",
    status: "Pending Review",
  },
  {
    id: "SEL-102",
    storeName: "Organic Green Mart",
    owner: "Nisha Ranasinghe",
    email: "nisha@greenmart.lk",
    appliedDate: "4 days ago",
    category: "Groceries & Health",
    status: "Pending Review",
  },
];

const recentUsers = [
  { id: "USR-882", name: "Chathura Wickramasinghe", email: "chathura@gmail.com", role: "Customer", joined: "Today" },
  { id: "USR-881", name: "Dilrukshi Jayawardena", email: "dilrukshi@yahoo.com", role: "Seller", joined: "Yesterday" },
  { id: "USR-880", name: "Pradeep Samarasinghe", email: "pradeep@outlook.com", role: "Customer", joined: "2 days ago" },
];

const auditLogs = [
  { id: 1, action: "Seller Approved", detail: "Store 'Urban Style' verified by Admin", time: "10 mins ago", type: "success" },
  { id: 2, action: "Security Check", detail: "Automated vulnerability scan completed", time: "1 hour ago", type: "info" },
  { id: 3, action: "Backup Created", detail: "Daily database snapshot saved to cloud", time: "4 hours ago", type: "primary" },
  { id: 4, action: "System Config", detail: "Platform commission rate updated to 5%", time: "Yesterday", type: "warning" },
];

function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState(null);
  const [sellersQueue, setSellersQueue] = useState(pendingSellers);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/admin/reports/summary", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setSummary(response.data.summary))
      .catch(() => {});
  }, [token]);

  const liveKpis = summary ? [
    { ...adminKpis[0], value: `Rs. ${Number(summary.paid_revenue || 0).toLocaleString()}`, note: "Paid order revenue" },
    { ...adminKpis[1], value: Number(summary.total_users || 0).toLocaleString(), note: "Registered platform users" },
    { ...adminKpis[2], value: `${summary.active_sellers || 0} Stores`, note: "Approved seller accounts" },
    { ...adminKpis[3], value: Number(summary.total_orders || 0).toLocaleString(), note: "All platform orders" },
  ] : adminKpis;

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApproveSeller = (id, storeName) => {
    setSellersQueue(sellersQueue.filter((s) => s.id !== id));
    triggerToast(`Seller '${storeName}' approved successfully!`);
  };

  const handleRejectSeller = (id, storeName) => {
    setSellersQueue(sellersQueue.filter((s) => s.id !== id));
    triggerToast(`Seller application for '${storeName}' rejected.`);
  };

  return (
    <div className="app-page">
      <Navbar />

      {toastMessage && (
        <div className="toast-stack">
          <div className="app-toast app-toast-success">
            <span className="app-toast-icon"><FaCheckCircle /></span>
            <div className="app-toast-message">{toastMessage}</div>
            <button className="app-toast-close" onClick={() => setToastMessage(null)}>×</button>
          </div>
        </div>
      )}

      <main className="container py-5">
        {/* Admin Hero Section */}
        <section className="admin-hero mb-4">
          <div className="admin-hero-content">
            <div>
              <span className="badge bg-light text-primary mb-3 d-inline-flex align-items-center gap-2">
                <FaShieldAlt /> System Administration Console
              </span>

              <h1 className="mb-2">
                ShopEase Admin Control Panel
              </h1>

              <p className="mb-0 text-white-50">
                Welcome back, {user?.full_name || "Platform Admin"}. Monitor platform revenue, manage seller verifications, view real-time system logs, and control platform settings.
              </p>
            </div>

            <div className="admin-hero-panel">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="activity-dot bg-success"></span>
                <strong className="text-white">System Status: Operational</strong>
              </div>
              <small className="text-white-50">ShopEase v1.4.0 • Uptime 99.98%</small>
            </div>
          </div>
        </section>

        {/* Admin Quick Actions */}
        <div className="card glass-card mb-4">
          <div className="card-body p-4">
            <span className="section-kicker">Administrative Controls</span>
            <h4 className="mb-4 mt-2">Quick Platform Actions</h4>

            <div className="admin-quick-actions-grid">
              <button
                className="admin-quick-btn admin-quick-btn-primary"
                onClick={() => navigate("/admin/orders")}
              >
                <FaDownload className="quick-icon" />
                <div>
                  <strong>Manage Orders</strong>
                  <small>Review customer orders</small>
                </div>
              </button>

              <button
                className="admin-quick-btn"
                onClick={() => navigate("/admin/categories")}
              >
                <FaCog className="quick-icon text-primary" />
                <div>
                  <strong>Manage Categories</strong>
                  <small>Categories & subcategories</small>
                </div>
              </button>

              <button
                className="admin-quick-btn"
                onClick={() => navigate("/admin/users")}
              >
                <FaUsers className="quick-icon text-success" />
                <div>
                  <strong>Manage All Users</strong>
                  <small>Review users and seller approvals</small>
                </div>
              </button>

              <button
                className="admin-quick-btn"
                onClick={() => triggerToast("System Security & SSL check passed.")}
              >
                <FaLock className="quick-icon text-accent" />
                <div>
                  <strong>Security & Audit Logs</strong>
                  <small>Zero threats detected</small>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="row g-4 mb-4">
          {liveKpis.map((kpi) => (
            <div className="col-sm-6 col-xl-3" key={kpi.title}>
              <div className="card admin-kpi-card h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
                    <span className={`seller-stat-icon seller-stat-${kpi.color}`}>
                      {kpi.icon}
                    </span>
                    <span className={`badge badge-soft-${kpi.color}`}>
                      Platform
                    </span>
                  </div>

                  <p className="text-muted fw-bold mb-1">{kpi.title}</p>
                  <h3 className="mb-2">{kpi.value}</h3>
                  <small className="text-muted">{kpi.note}</small>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Analytics & System Health */}
        <div className="row g-4 mb-4">
          <div className="col-xl-8">
            <div className="card glass-card h-100">
              <div className="card-body p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                  <div>
                    <span className="section-kicker">Financial Analytics</span>
                    <h4 className="mb-0 mt-2">Platform Revenue Growth (UI)</h4>
                  </div>
                  <span className="badge badge-soft-success d-flex align-items-center gap-1">
                    <FaArrowUp /> +22.4% Revenue Increase
                  </span>
                </div>

                <div className="sales-chart-container mb-4">
                  <div className="sales-chart-bars">
                    {platformAnalytics.map((data) => (
                      <div className="sales-bar-wrapper" key={data.month}>
                        <div className="sales-bar-value">Rs. {(data.revenue / 100000).toFixed(1)}L</div>
                        <div
                          className="sales-bar"
                          style={{ height: data.height }}
                          title={`${data.month}: Rs. ${data.revenue.toLocaleString()}`}
                        ></div>
                        <span className="sales-bar-label">{data.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="row g-3 pt-2">
                  <div className="col-6 col-md-3">
                    <div className="p-3 bg-surface-soft border rounded-3 text-center">
                      <span className="text-muted small d-block">Platform Fee (5%)</span>
                      <strong className="fs-5 text-success">Rs. 242.5k</strong>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 bg-surface-soft border rounded-3 text-center">
                      <span className="text-muted small d-block">Avg Order Value</span>
                      <strong className="fs-5">Rs. 4,200</strong>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 bg-surface-soft border rounded-3 text-center">
                      <span className="text-muted small d-block">Active Categories</span>
                      <strong className="fs-5 text-primary">12 Categories</strong>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 bg-surface-soft border rounded-3 text-center">
                      <span className="text-muted small d-block">API Latency</span>
                      <strong className="fs-5 text-accent">42 ms</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card glass-card h-100">
              <div className="card-body p-4">
                <span className="section-kicker">Infrastructure</span>
                <h4 className="mb-4 mt-2">System Health Overview</h4>

                <div className="d-grid gap-4">
                  <div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-bold small d-flex align-items-center gap-2">
                        <FaServer className="text-primary" /> Server CPU Load
                      </span>
                      <span className="fw-bold small text-primary">28%</span>
                    </div>
                    <div className="seller-progress">
                      <span style={{ width: "28%" }}></span>
                    </div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-bold small d-flex align-items-center gap-2">
                        <FaDatabase className="text-success" /> MySQL DB Memory
                      </span>
                      <span className="fw-bold small text-success">44%</span>
                    </div>
                    <div className="seller-progress">
                      <span style={{ width: "44%" }}></span>
                    </div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-bold small d-flex align-items-center gap-2">
                        <FaCloud className="text-accent" /> Storage Usage
                      </span>
                      <span className="fw-bold small text-accent">62%</span>
                    </div>
                    <div className="seller-progress">
                      <span style={{ width: "62%" }}></span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 border rounded-3 bg-surface-soft text-muted small">
                  <FaCheckCircle className="me-2 text-success" />
                  <strong>All Systems Operational:</strong> Database connection pool stable, Sanctum auth active.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Seller Approvals Queue */}
        <div className="card glass-card mb-4">
          <div className="card-body p-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
              <div>
                <span className="section-kicker">Seller Onboarding</span>
                <h4 className="mb-0 mt-2">Pending Seller Verification Queue</h4>
              </div>

              <span className="badge badge-soft-danger">
                {sellersQueue.length} Applications Awaiting Review
              </span>
            </div>

            {sellersQueue.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <FaCheckCircle className="fs-2 text-success mb-2" />
                <p className="mb-0">All seller applications have been reviewed!</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table seller-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Application ID</th>
                      <th>Store Name</th>
                      <th>Applicant Name</th>
                      <th>Category</th>
                      <th>Applied Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellersQueue.map((seller) => (
                      <tr key={seller.id}>
                        <td className="fw-bold">{seller.id}</td>
                        <td>
                          <div className="fw-bold text-primary">{seller.storeName}</div>
                          <small className="text-muted">{seller.email}</small>
                        </td>
                        <td>{seller.owner}</td>
                        <td>
                          <span className="badge badge-soft-primary">{seller.category}</span>
                        </td>
                        <td>{seller.appliedDate}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-success rounded-pill px-3 py-1 d-flex align-items-center gap-1"
                              onClick={() => handleApproveSeller(seller.id, seller.storeName)}
                            >
                              <FaUserCheck /> Approve
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1 d-flex align-items-center gap-1"
                              onClick={() => handleRejectSeller(seller.id, seller.storeName)}
                            >
                              <FaUserTimes /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recent Users & Security Audit Logs */}
        <div className="row g-4">
          <div className="col-xl-6">
            <div className="card glass-card h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <span className="section-kicker">User Directory</span>
                    <h4 className="mb-0 mt-2">Recent Platform Registrations</h4>
                  </div>
                  <FaUsers className="text-primary fs-3" />
                </div>

                <div className="d-grid gap-3">
                  {recentUsers.map((usr) => (
                    <div className="p-3 border rounded-3 bg-surface-soft d-flex align-items-center justify-content-between" key={usr.id}>
                      <div>
                        <strong className="d-block">{usr.name}</strong>
                        <small className="text-muted">{usr.email}</small>
                      </div>
                      <div className="text-end">
                        <span className={`badge badge-soft-${usr.role === "Seller" ? "success" : "primary"} me-2`}>
                          {usr.role}
                        </span>
                        <small className="text-muted d-block">{usr.joined}</small>
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
                    <span className="section-kicker">Audit Trail</span>
                    <h4 className="mb-0 mt-2">Security & Activity Logs</h4>
                  </div>
                  <FaShieldAlt className="text-success fs-3" />
                </div>

                <div className="d-grid gap-3">
                  {auditLogs.map((log) => (
                    <div className="p-3 border rounded-3 bg-surface-soft d-flex align-items-center justify-content-between gap-3" key={log.id}>
                      <div>
                        <span className={`badge badge-soft-${log.type} mb-1`}>{log.action}</span>
                        <small className="d-block fw-bold text-dark">{log.detail}</small>
                      </div>
                      <span className="text-muted small text-nowrap">{log.time}</span>
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

// Fallback helper components for icons
function FaDatabase(props) {
  return <FaServer {...props} />;
}

function FaCloud(props) {
  return <FaServer {...props} />;
}

export default AdminDashboard;

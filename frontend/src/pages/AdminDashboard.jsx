import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaChartLine,
  FaCog,
  FaMoneyBillWave,
  FaReceipt,
  FaShieldAlt,
  FaShoppingBag,
  FaStore,
  FaUsers,
} from "react-icons/fa";
import {
  ReportDateFilter,
  RevenueTrendChart,
  StatusBreakdown,
  TopProducts,
} from "../components/analytics/AnalyticsWidgets";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { formatReportCurrency, getDefaultReportRange } from "../utils/reportUtils";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const initialRange = getDefaultReportRange();
  const [draftRange, setDraftRange] = useState(initialRange);
  const [range, setRange] = useState(initialRange);
  const [summary, setSummary] = useState(null);
  const [period, setPeriod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadReport = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/admin/reports/summary", {
          headers: { Authorization: `Bearer ${token}` },
          params: range,
          signal: controller.signal,
        });
        setSummary(response.data.summary);
        setPeriod(response.data.period);
      } catch (err) {
        if (err.code !== "ERR_CANCELED") {
          setError(err.response?.data?.message || "Unable to load platform analytics.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    if (token) loadReport();
    return () => controller.abort();
  }, [range, refreshKey, token]);

  const applyRange = (event) => {
    event.preventDefault();
    setRange({ ...draftRange });
  };

  const applyPreset = (days) => {
    const nextRange = getDefaultReportRange(days);
    setDraftRange(nextRange);
    setRange(nextRange);
  };

  const kpis = [
    {
      label: "Paid revenue",
      value: formatReportCurrency(summary?.paid_revenue),
      note: `${summary?.paid_orders || 0} paid orders`,
      icon: <FaMoneyBillWave />,
      tone: "success",
    },
    {
      label: "Orders",
      value: Number(summary?.total_orders || 0).toLocaleString(),
      note: "Created in selected period",
      icon: <FaShoppingBag />,
      tone: "primary",
    },
    {
      label: "Registered users",
      value: Number(summary?.total_users || 0).toLocaleString(),
      note: `${summary?.new_customers || 0} new customers`,
      icon: <FaUsers />,
      tone: "dark",
    },
    {
      label: "Active sellers",
      value: Number(summary?.active_sellers || 0).toLocaleString(),
      note: `${summary?.total_products || 0} catalog products`,
      icon: <FaStore />,
      tone: "warning",
    },
  ];

  return (
    <div className="app-page bg-light-subtle min-vh-100">
      <Navbar />
      <main className="container py-4 py-lg-5">
        <section className="admin-hero mb-4">
          <div className="admin-hero-content flex-wrap">
            <div>
              <span className="badge bg-light text-danger mb-3 d-inline-flex align-items-center gap-2">
                <FaShieldAlt /> Platform administration
              </span>
              <h1 className="h2 mb-2">Commerce performance overview</h1>
              <p className="mb-0 text-white-50">
                Welcome, {user?.full_name || "Administrator"}. Monitor verified revenue, orders, sellers, and product performance.
              </p>
            </div>
            <div className="admin-hero-panel">
              <span>Selected reporting period</span>
              <strong>{period?.days || 30} days</strong>
              <small>{period ? `${period.from} to ${period.to}` : "Loading report dates..."}</small>
            </div>
          </div>
        </section>

        <section className="card glass-card mb-4">
          <div className="card-body p-4">
            <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-3">
              <div>
                <span className="section-kicker">Reports & analytics</span>
                <h2 className="h5 mt-2 mb-1">Filter platform results</h2>
                <p className="text-muted small mb-0">Choose up to 366 days. Revenue includes paid orders only.</p>
              </div>
              <ReportDateFilter
                loading={loading}
                onApply={applyRange}
                onChange={setDraftRange}
                onPreset={applyPreset}
                range={draftRange}
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-3" role="alert">
            <span>{error}</span>
            <button className="btn btn-sm btn-outline-danger" onClick={() => setRefreshKey((key) => key + 1)} type="button">Try again</button>
          </div>
        )}

        {loading && !summary ? (
          <div className="text-center py-5"><LoadingSpinner size="lg" text="Loading platform analytics..." /></div>
        ) : (
          <>
            <section className="row g-3 mb-4" aria-label="Platform performance metrics">
              {kpis.map((kpi) => (
                <div className="col-sm-6 col-xl-3" key={kpi.label}>
                  <article className="card admin-kpi-card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                      <div className={`seller-stat-icon seller-stat-${kpi.tone} mb-3`}>{kpi.icon}</div>
                      <p className="text-muted small fw-semibold mb-1">{kpi.label}</p>
                      <h3 className="h4 mb-1">{kpi.value}</h3>
                      <small className="text-muted">{kpi.note}</small>
                    </div>
                  </article>
                </div>
              ))}
            </section>

            <section className="row g-4 mb-4">
              <div className="col-xl-8">
                <article className="card glass-card h-100">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
                      <div>
                        <span className="section-kicker">Revenue trend</span>
                        <h2 className="h5 mt-2 mb-0">Daily paid revenue</h2>
                      </div>
                      <FaChartLine className="fs-3 text-primary" />
                    </div>
                    <RevenueTrendChart data={summary?.revenue_trend} gradientId="adminRevenueTrend" />
                  </div>
                </article>
              </div>
              <div className="col-xl-4">
                <article className="card glass-card h-100">
                  <div className="card-body p-4">
                    <span className="section-kicker">Order pipeline</span>
                    <h2 className="h5 mt-2 mb-4">Orders by status</h2>
                    <StatusBreakdown statuses={summary?.orders_by_status} />
                    <div className="p-3 bg-surface-soft border rounded-3 mt-4">
                      <span className="text-muted small d-block">Average paid order</span>
                      <strong className="fs-5">{formatReportCurrency(summary?.average_order_value)}</strong>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            <section className="row g-4">
              <div className="col-lg-7">
                <article className="card glass-card h-100">
                  <div className="card-body p-4">
                    <span className="section-kicker">Catalog performance</span>
                    <h2 className="h5 mt-2 mb-4">Top products by paid revenue</h2>
                    <TopProducts products={summary?.top_products} />
                  </div>
                </article>
              </div>
              <div className="col-lg-5">
                <article className="card glass-card h-100">
                  <div className="card-body p-4">
                    <span className="section-kicker">Administrative controls</span>
                    <h2 className="h5 mt-2 mb-4">Quick actions</h2>
                    <div className="d-grid gap-2">
                      <Link className="btn btn-primary text-start" to="/admin/orders"><FaReceipt className="me-2" />Manage orders</Link>
                      <Link className="btn btn-outline-primary text-start" to="/admin/users"><FaUsers className="me-2" />Manage users and sellers</Link>
                      <Link className="btn btn-outline-primary text-start" to="/admin/categories"><FaCog className="me-2" />Manage categories</Link>
                      <Link className="btn btn-outline-primary text-start" to="/seller/products"><FaBoxOpen className="me-2" />Manage catalog</Link>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

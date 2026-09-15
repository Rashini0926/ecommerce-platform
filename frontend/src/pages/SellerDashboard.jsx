import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaChartLine,
  FaClipboardList,
  FaExclamationTriangle,
  FaPlus,
  FaShoppingBag,
  FaStore,
  FaWallet,
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
import { getMyProducts } from "../services/productService";
import api from "../utils/api";
import { formatReportCurrency, getDefaultReportRange } from "../utils/reportUtils";

export default function SellerDashboard() {
  const { user, token } = useAuth();
  const initialRange = getDefaultReportRange();
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [period, setPeriod] = useState(null);
  const [draftRange, setDraftRange] = useState(initialRange);
  const [range, setRange] = useState(initialRange);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const loadWorkspace = async () => {
      setWorkspaceLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [productData, orderData] = await Promise.all([
          getMyProducts(token),
          api.get("/seller/order-items", { headers }),
        ]);
        setProducts(productData || []);
        setItems(orderData.data.order_items || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load seller workspace.");
      } finally {
        setWorkspaceLoading(false);
      }
    };

    if (token) loadWorkspace();
  }, [token]);

  useEffect(() => {
    const controller = new AbortController();

    const loadReport = async () => {
      setReportLoading(true);
      setError("");
      try {
        const response = await api.get("/seller/reports/summary", {
          headers: { Authorization: `Bearer ${token}` },
          params: range,
          signal: controller.signal,
        });
        setSummary(response.data.summary);
        setPeriod(response.data.period);
      } catch (err) {
        if (err.code !== "ERR_CANCELED") {
          setError(err.response?.data?.message || "Unable to load seller analytics.");
        }
      } finally {
        if (!controller.signal.aborted) setReportLoading(false);
      }
    };

    if (token) loadReport();
    return () => controller.abort();
  }, [range, token]);

  const applyRange = (event) => {
    event.preventDefault();
    setRange({ ...draftRange });
  };

  const applyPreset = (days) => {
    const nextRange = getDefaultReportRange(days);
    setDraftRange(nextRange);
    setRange(nextRange);
  };

  const updateFulfillment = async (item, fulfillmentStatus) => {
    setUpdatingId(item.id);
    setError("");
    try {
      const response = await api.patch(
        `/seller/order-items/${item.id}/fulfillment`,
        { fulfillment_status: fulfillmentStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setItems((current) => current.map((entry) => (
        entry.id === item.id ? response.data.order_item : entry
      )));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update fulfillment status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const cards = [
    {
      label: "Catalog products",
      value: summary?.active_products || 0,
      note: `${summary?.low_stock_products || 0} low-stock alerts`,
      icon: <FaBoxOpen />,
      tone: "primary",
    },
    {
      label: "Seller orders",
      value: summary?.total_orders || 0,
      note: `${summary?.order_items || 0} product line items`,
      icon: <FaShoppingBag />,
      tone: "warning",
    },
    {
      label: "Units sold",
      value: summary?.units_sold || 0,
      note: `${summary?.pending_fulfillment || 0} awaiting fulfillment`,
      icon: <FaClipboardList />,
      tone: "dark",
    },
    {
      label: "Paid revenue",
      value: formatReportCurrency(summary?.paid_revenue),
      note: "Your items in paid orders",
      icon: <FaWallet />,
      tone: "success",
    },
  ];

  return (
    <div className="app-page bg-light-subtle min-vh-100">
      <Navbar />
      <main className="container py-4 py-lg-5">
        <section className="rounded-4 p-4 p-lg-5 mb-4 text-white shadow-sm seller-dashboard-hero">
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-4 align-items-lg-center">
            <div>
              <span className="badge text-bg-light text-success mb-3"><FaStore className="me-2" />Seller workspace</span>
              <h1 className="h2 mb-2">Good to see you, {user?.full_name || "Seller"}</h1>
              <p className="mb-0 text-white-50">Use verified sales data to manage your catalog and fulfillment priorities.</p>
            </div>
            <Link to="/seller/products" className="btn btn-light fw-semibold px-4"><FaPlus className="me-2" />Manage products</Link>
          </div>
        </section>

        <section className="card glass-card mb-4">
          <div className="card-body p-4">
            <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-3">
              <div>
                <span className="section-kicker">Sales analytics</span>
                <h2 className="h5 mt-2 mb-1">Filter store performance</h2>
                <p className="text-muted small mb-0">
                  {period ? `Showing ${period.days} days from ${period.from} to ${period.to}.` : "Select up to 366 days."}
                </p>
              </div>
              <ReportDateFilter
                loading={reportLoading}
                onApply={applyRange}
                onChange={setDraftRange}
                onPreset={applyPreset}
                range={draftRange}
              />
            </div>
          </div>
        </section>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        {(workspaceLoading || (reportLoading && !summary)) ? (
          <div className="text-center py-5"><LoadingSpinner size="lg" text="Loading seller workspace..." /></div>
        ) : (
          <>
            <section className="row g-3 mb-4" aria-label="Seller performance metrics">
              {cards.map((card) => (
                <div className="col-sm-6 col-xl-3" key={card.label}>
                  <article className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                      <div className={`seller-stat-icon seller-stat-${card.tone} mb-3`}>{card.icon}</div>
                      <p className="text-muted small fw-semibold mb-1">{card.label}</p>
                      <h3 className="h4 mb-1">{card.value}</h3>
                      <small className="text-muted">{card.note}</small>
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
                      <div><span className="section-kicker">Revenue trend</span><h2 className="h5 mt-2 mb-0">Daily paid sales</h2></div>
                      <FaChartLine className="fs-3 text-success" />
                    </div>
                    <RevenueTrendChart data={summary?.revenue_trend} gradientId="sellerRevenueTrend" />
                  </div>
                </article>
              </div>
              <div className="col-xl-4">
                <article className="card glass-card h-100">
                  <div className="card-body p-4">
                    <span className="section-kicker">Order pipeline</span>
                    <h2 className="h5 mt-2 mb-4">Orders by status</h2>
                    <StatusBreakdown statuses={summary?.orders_by_status} />
                  </div>
                </article>
              </div>
            </section>

            <section className="row g-4 mb-4">
              <div className="col-lg-7">
                <article className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <span className="section-kicker">Product performance</span>
                    <h2 className="h5 mt-2 mb-4">Top products by paid revenue</h2>
                    <TopProducts products={summary?.top_products} />
                  </div>
                </article>
              </div>
              <div className="col-lg-5">
                <article className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <h2 className="h5 mb-3">Inventory attention</h2>
                    {products.filter((product) => Number(product.stock) <= 5).length === 0 ? (
                      <p className="text-success mb-0">All products have healthy stock levels.</p>
                    ) : products.filter((product) => Number(product.stock) <= 5).slice(0, 5).map((product) => (
                      <div className="d-flex gap-3 py-3 border-top" key={product.id}>
                        <FaExclamationTriangle className="text-warning mt-1" />
                        <div><div className="fw-semibold">{product.name}</div><small className="text-muted">Only {product.stock} units remaining</small></div>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </section>

            <section className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                  <div><span className="section-kicker">Operations</span><h2 className="h5 mt-2 mb-1">Fulfillment queue</h2><p className="text-muted small mb-0">Latest customer orders containing your products.</p></div>
                  <Link className="btn btn-outline-success btn-sm" to="/notifications">View notifications</Link>
                </div>
                {items.length === 0 ? (
                  <div className="text-center py-5 text-muted"><FaClipboardList className="fs-2 mb-3" /><p className="mb-0">No seller orders yet.</p></div>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle mb-0 seller-table">
                      <thead><tr><th>Order</th><th>Product</th><th>Customer</th><th>Status</th><th>Action</th><th className="text-end">Amount</th></tr></thead>
                      <tbody>
                        {items.slice(0, 8).map((item) => (
                          <tr key={item.id}>
                            <td><strong>{item.order?.order_number}</strong><br /><small className="text-muted">Qty: {item.quantity}</small></td>
                            <td>{item.product_name}</td>
                            <td>{item.order?.user?.full_name || "Customer"}</td>
                            <td><span className={`badge ${fulfillmentBadge(item.fulfillment_status)}`}>{item.fulfillment_status?.replaceAll("_", " ")}</span></td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                disabled={updatingId === item.id || item.fulfillment_status === "SHIPPED"}
                                onChange={(event) => updateFulfillment(item, event.target.value)}
                                value={item.fulfillment_status}
                              >
                                <option value="PROCESSING">PROCESSING</option>
                                <option value="READY_TO_SHIP">READY TO SHIP</option>
                                <option value="SHIPPED">SHIPPED</option>
                              </select>
                            </td>
                            <td className="text-end fw-semibold">{formatReportCurrency(item.subtotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function fulfillmentBadge(status) {
  if (status === "SHIPPED") return "text-bg-success";
  if (status === "READY_TO_SHIP") return "text-bg-warning";
  return "text-bg-secondary";
}

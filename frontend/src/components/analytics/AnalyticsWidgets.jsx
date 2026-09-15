import { formatReportCurrency, toDateInput } from "../../utils/reportUtils";

const compactCurrency = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const statusLabels = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const statusTones = {
  PENDING: "warning",
  PROCESSING: "primary",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "danger",
};

export function ReportDateFilter({ range, onChange, onApply, onPreset, loading }) {
  const today = toDateInput(new Date());

  return (
    <form className="report-filter" onSubmit={onApply}>
      <div className="report-presets" aria-label="Report period shortcuts">
        {[7, 30, 90].map((days) => (
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={loading}
            key={days}
            onClick={() => onPreset(days)}
            type="button"
          >
            {days} days
          </button>
        ))}
      </div>
      <label>
        <span>From</span>
        <input
          className="form-control form-control-sm"
          max={range.to || today}
          onChange={(event) => onChange({ ...range, from: event.target.value })}
          required
          type="date"
          value={range.from}
        />
      </label>
      <label>
        <span>To</span>
        <input
          className="form-control form-control-sm"
          max={today}
          min={range.from}
          onChange={(event) => onChange({ ...range, to: event.target.value })}
          required
          type="date"
          value={range.to}
        />
      </label>
      <button className="btn btn-sm btn-primary px-3" disabled={loading} type="submit">
        {loading ? "Updating..." : "Apply"}
      </button>
    </form>
  );
}

export function RevenueTrendChart({ data = [], gradientId = "revenueTrend" }) {
  const width = 720;
  const height = 250;
  const padding = 32;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const dataMax = Math.max(...data.map((entry) => Number(entry.revenue || 0)), 0);
  const maxRevenue = Math.max(dataMax, 1);
  const points = data.map((entry, index) => {
    const x = padding + (data.length === 1 ? chartWidth / 2 : (index / (data.length - 1)) * chartWidth);
    const y = padding + chartHeight - (Number(entry.revenue || 0) / maxRevenue) * chartHeight;
    return { ...entry, x, y };
  });
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = points.length > 0
    ? `M ${points[0].x} ${height - padding} ${points.map((point) => `L ${point.x} ${point.y}`).join(" ")} L ${points.at(-1).x} ${height - padding} Z`
    : "";
  const totalRevenue = data.reduce((total, entry) => total + Number(entry.revenue || 0), 0);
  const totalOrders = data.reduce((total, entry) => total + Number(entry.orders || 0), 0);
  const labelIndexes = [...new Set([0, Math.floor((data.length - 1) / 2), data.length - 1])]
    .filter((index) => index >= 0);

  return (
    <div className="report-chart" aria-label="Revenue trend chart">
      <div className="report-chart-summary">
        <div><span>Paid revenue</span><strong>{formatReportCurrency(totalRevenue)}</strong></div>
        <div><span>Orders in trend</span><strong>{totalOrders.toLocaleString()}</strong></div>
      </div>
      <div className="report-chart-canvas">
        <svg role="img" viewBox={`0 0 ${width} ${height}`}>
          <title>Paid revenue over the selected date range</title>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0, 0.5, 1].map((position) => {
            const y = padding + chartHeight * position;
            return <line className="report-grid-line" key={position} x1={padding} x2={width - padding} y1={y} y2={y} />;
          })}
          {area && <path d={area} fill={`url(#${gradientId})`} />}
          {line && <polyline className="report-trend-line" points={line} />}
          {points.length <= 31 && points.map((point) => (
            <circle className="report-trend-point" cx={point.x} cy={point.y} key={point.date} r="4">
              <title>{`${point.date}: ${formatReportCurrency(point.revenue)} from ${point.orders} orders`}</title>
            </circle>
          ))}
          <text className="report-axis-value" x={padding} y={padding - 10}>{compactCurrency.format(dataMax)}</text>
          <text className="report-axis-value" x={padding} y={height - 8}>LKR 0</text>
        </svg>
        {totalRevenue === 0 && <div className="report-chart-empty">No paid sales in this period</div>}
      </div>
      <div className="report-chart-labels">
        {labelIndexes.map((index) => <span key={data[index]?.date}>{formatChartDate(data[index]?.date)}</span>)}
      </div>
    </div>
  );
}

export function StatusBreakdown({ statuses = {} }) {
  const entries = Object.entries(statuses);
  const total = entries.reduce((sum, [, count]) => sum + Number(count || 0), 0);

  return (
    <div className="report-status-list">
      {entries.map(([status, count]) => {
        const numericCount = Number(count || 0);
        const percentage = total > 0 ? (numericCount / total) * 100 : 0;
        return (
          <div className="report-status-item" key={status}>
            <div><span>{statusLabels[status] || status}</span><strong>{numericCount}</strong></div>
            <div className="progress" role="progressbar" aria-label={`${statusLabels[status] || status} orders`} aria-valuemax="100" aria-valuemin="0" aria-valuenow={Math.round(percentage)}>
              <div className={`progress-bar bg-${statusTones[status] || "secondary"}`} style={{ width: `${percentage}%` }} />
            </div>
          </div>
        );
      })}
      {total === 0 && <p className="text-muted small mb-0">No orders in this period.</p>}
    </div>
  );
}

export function TopProducts({ products = [] }) {
  if (products.length === 0) {
    return <p className="text-muted small mb-0">No paid product sales in this period.</p>;
  }

  return (
    <div className="report-product-list">
      {products.map((product, index) => (
        <div className="report-product-item" key={`${product.product_name}-${index}`}>
          <span className="report-rank">{index + 1}</span>
          <div>
            <strong>{product.product_name}</strong>
            <small>{Number(product.units_sold || 0).toLocaleString()} units sold</small>
          </div>
          <strong>{formatReportCurrency(product.revenue)}</strong>
        </div>
      ))}
    </div>
  );
}

function formatChartDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-LK", { month: "short", day: "numeric" })
    .format(new Date(`${value}T00:00:00`));
}

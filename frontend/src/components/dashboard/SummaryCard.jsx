import { Link } from "react-router-dom";

function SummaryCard({
  title,
  value,
  description,
  icon,
  color = "primary",
  link,
  linkLabel = "View Details",
}) {
  return (
    <div className="col-sm-6 col-xl-3">
      <div className="card stat-card dashboard-summary-card h-100">
        <div className="card-body p-4">
          <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
            <div className={`dashboard-stat-icon dashboard-stat-icon-${color}`}>
              {icon}
            </div>

            <span className={`badge badge-soft-${color}`}>
              Live
            </span>
          </div>

          <p className="text-muted fw-bold mb-1">{title}</p>
          <h2 className={`text-${color} mb-2`}>{value}</h2>
          <p className="text-muted small mb-4">{description}</p>

          {link ? (
            <Link to={link} className={`btn btn-outline-${color} w-100`}>
              {linkLabel}
            </Link>
          ) : (
            <button type="button" className={`btn btn-outline-${color} w-100`}>
              {linkLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;

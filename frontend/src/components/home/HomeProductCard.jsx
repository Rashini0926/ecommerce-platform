import { Link } from "react-router-dom";
import { FaCartPlus, FaStar } from "react-icons/fa";

const formatPrice = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const imageSource = (image) => {
  if (!image) return `${import.meta.env.BASE_URL}images/products/placeholder.svg`;
  return image.startsWith("http") ? image : `${import.meta.env.BASE_URL}${image.replace(/^\/+/, "")}`;
};

export default function HomeProductCard({ product, actionLabel, adding, onAction, tone = "primary", showSales = false }) {
  const hasDiscount = Number(product.discount_percentage) > 0;

  return <article className="card product-card hover-lift card-hover-shadow h-100">
    <Link to={`/products/${product.id}`} className="product-image-wrap position-relative d-block">
      <img src={imageSource(product.image)} className="product-image" alt={product.name} onError={(event) => { event.currentTarget.src = `${import.meta.env.BASE_URL}images/products/placeholder.svg`; }} />
      {hasDiscount && <span className="badge bg-danger position-absolute top-0 start-0 m-3">-{Number(product.discount_percentage)}%</span>}
    </Link>
    <div className="card-body d-flex flex-column">
      <small className="text-muted mb-2">{product.category?.name || "Product"}</small>
      <h3 className="h5"><Link to={`/products/${product.id}`} className="text-decoration-none text-dark">{product.name}</Link></h3>
      <div className="text-warning small mb-2"><FaStar className="me-1" />{Number(product.rating || 0).toFixed(1)}{showSales && <span className="text-muted ms-2">· {Number(product.units_sold || 0)} sold</span>}</div>
      <div className="mt-auto mb-3">{hasDiscount && <small className="text-muted text-decoration-line-through d-block">{formatPrice(product.price)}</small>}<strong className={`fs-5 text-${tone}`}>{formatPrice(product.sale_price ?? product.price)}</strong></div>
      <button className={`btn btn-${tone} w-100`} disabled={adding || product.stock < 1} onClick={() => onAction(product)}><FaCartPlus className="me-2" />{adding ? "Adding..." : product.stock < 1 ? "Out of stock" : actionLabel}</button>
    </div>
  </article>;
}

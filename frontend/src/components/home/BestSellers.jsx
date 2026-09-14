import { Link } from "react-router-dom";
import HomeProductCard from "./HomeProductCard";

function BestSellers({ products, loading, addingId, onAdd }) {
  return <section className="container section-padding">
    <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
      <div><span className="section-kicker">Popular choices</span><h2 className="mt-2 mb-0 text-primary">Best Sellers</h2></div>
      <Link to="/products" className="btn btn-outline-primary">View All</Link>
    </div>
    {loading ? <div className="text-center text-muted py-5">Loading best sellers...</div> : products.length === 0 ? <div className="alert alert-light border">No best-selling products are available yet.</div> : <div className="row g-4">{products.map((product) => <div className="col-sm-6 col-lg-3" key={product.id}><HomeProductCard product={product} actionLabel="Add to Cart" adding={addingId === product.id} onAction={onAdd} showSales /></div>)}</div>}
  </section>;
}

export default BestSellers;

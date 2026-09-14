import { Link } from "react-router-dom";
import { FaBolt } from "react-icons/fa6";
import HomeProductCard from "./HomeProductCard";

function FlashDeals({ products, loading, addingId, onAdd }) {
  return <section className="container section-padding">
    <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
      <div><span className="section-kicker"><FaBolt className="me-2" />Limited time</span><h2 className="mt-2 mb-0 text-danger">Flash Deals</h2></div>
      <Link to="/products" className="btn btn-outline-danger">View All</Link>
    </div>
    {loading ? <div className="text-center text-muted py-5">Loading flash deals...</div> : products.length === 0 ? <div className="alert alert-light border">There are no active flash deals right now.</div> : <div className="row g-4">{products.map((product) => <div className="col-sm-6 col-lg-3" key={product.id}><HomeProductCard product={product} actionLabel="Buy Now" adding={addingId === product.id} onAction={(item) => onAdd(item, true)} tone="danger" /></div>)}</div>}
  </section>;
}

export default FlashDeals;

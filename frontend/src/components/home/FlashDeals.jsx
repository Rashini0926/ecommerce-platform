import { FaBolt, FaCartShopping, FaClock } from "react-icons/fa6";

const deals = [
  {
    id: 1,
    name: "Gaming Mouse",
    oldPrice: "Rs. 4,500",
    newPrice: "Rs. 2,999",
    discount: "33%",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    name: "Wireless Earbuds",
    oldPrice: "Rs. 8,000",
    newPrice: "Rs. 5,999",
    discount: "25%",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    name: "Office Chair",
    oldPrice: "Rs. 24,000",
    newPrice: "Rs. 18,500",
    discount: "23%",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    oldPrice: "Rs. 12,500",
    newPrice: "Rs. 9,500",
    discount: "24%",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80",
  },
];

function FlashDeals() {
  return (
    <section className="container section-padding">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <span className="section-kicker">
            <FaBolt className="me-2" />
            Limited time
          </span>
          <h2 className="mt-2 mb-0 text-danger">Flash Deals</h2>
        </div>

        <button className="btn btn-outline-danger">
          View All
        </button>
      </div>

      <div className="row g-4">
        {deals.map((item) => (
          <div className="col-sm-6 col-lg-3" key={item.id}>
            <div className="card product-card hover-lift card-hover-shadow h-100">
              <div className="product-image-wrap position-relative">
                <img
                  src={item.image}
                  className="product-image"
                  alt={item.name}
                />

                <span className="badge bg-danger position-absolute top-0 start-0 m-3">
                  -{item.discount}
                </span>
              </div>

              <div className="card-body">
                <div className="d-flex align-items-center text-muted small mb-2">
                  <FaClock className="me-2 text-danger" />
                  Ends soon
                </div>

                <h5>{item.name}</h5>

                <p className="mb-1 text-decoration-line-through text-muted">
                  {item.oldPrice}
                </p>

                <h5 className="text-danger fw-bold">
                  {item.newPrice}
                </h5>

                <button className="btn btn-danger w-100 mt-2 ripple">
                  <FaCartShopping className="me-2" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FlashDeals;

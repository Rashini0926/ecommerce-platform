import { FaCartPlus, FaStar } from "react-icons/fa";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "Rs. 8,500",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: "Rs. 12,000",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    name: "Laptop Backpack",
    price: "Rs. 4,500",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: "Rs. 6,000",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80",
  },
];

function FeaturedProducts() {
  return (
    <section className="container section-padding">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <span className="section-kicker">Fresh picks</span>
          <h2 className="mt-2 mb-0">Featured Products</h2>
        </div>

        <span className="badge badge-soft-primary">
          <FaStar className="me-2" />
          Curated for you
        </span>
      </div>

      <div className="row g-4">
        {products.map((product) => (
          <div className="col-sm-6 col-lg-3" key={product.id}>
            <div className="card product-card hover-lift card-hover-shadow h-100">
              <div className="product-image-wrap">
                <img
                  src={product.image}
                  className="product-image"
                  alt={product.name}
                />
              </div>

              <div className="card-body">
                <span className="badge badge-soft-accent mb-3">New arrival</span>
                <h5>{product.name}</h5>

                <p className="text-primary fw-bold fs-5">
                  {product.price}
                </p>

                <button className="btn btn-outline-primary w-100 ripple">
                  <FaCartPlus className="me-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;

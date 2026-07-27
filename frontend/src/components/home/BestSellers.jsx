import { FaCartPlus, FaStar } from "react-icons/fa";

const bestSellers = [
  {
    id: 1,
    name: "Apple AirPods Pro",
    price: "Rs. 65,000",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=700&q=80",
    rating: 5,
  },
  {
    id: 2,
    name: "Samsung Galaxy Watch",
    price: "Rs. 58,000",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=700&q=80",
    rating: 5,
  },
  {
    id: 3,
    name: "Dell Laptop Backpack",
    price: "Rs. 8,500",
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=700&q=80",
    rating: 4,
  },
  {
    id: 4,
    name: "JBL Bluetooth Speaker",
    price: "Rs. 18,500",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=700&q=80",
    rating: 5,
  },
];

function BestSellers() {
  return (
    <section className="container section-padding">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <span className="section-kicker">Top rated</span>
          <h2 className="mt-2 mb-0 text-primary">Best Sellers</h2>
        </div>

        <button className="btn btn-outline-primary">
          View All
        </button>
      </div>

      <div className="row g-4">
        {bestSellers.map((product) => (
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
                <h5>{product.name}</h5>

                <p className="mb-2 text-warning">
                  {Array.from({ length: product.rating }).map((_, index) => (
                    <FaStar key={index} className="me-1" />
                  ))}
                </p>

                <h5 className="text-primary">
                  {product.price}
                </h5>

                <button className="btn btn-primary w-100 ripple">
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

export default BestSellers;

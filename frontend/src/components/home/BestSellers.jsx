const bestSellers = [
  {
    id: 1,
    name: "Apple AirPods Pro",
    price: "Rs. 65,000",
    image: "https://placehold.co/300x250?text=AirPods+Pro",
    rating: "⭐⭐⭐⭐⭐",
  },
  {
    id: 2,
    name: "Samsung Galaxy Watch",
    price: "Rs. 58,000",
    image: "https://placehold.co/300x250?text=Galaxy+Watch",
    rating: "⭐⭐⭐⭐⭐",
  },
  {
    id: 3,
    name: "Dell Laptop Backpack",
    price: "Rs. 8,500",
    image: "https://placehold.co/300x250?text=Backpack",
    rating: "⭐⭐⭐⭐",
  },
  {
    id: 4,
    name: "JBL Bluetooth Speaker",
    price: "Rs. 18,500",
    image: "https://placehold.co/300x250?text=JBL+Speaker",
    rating: "⭐⭐⭐⭐⭐",
  },
];

function BestSellers() {
  return (
    <section className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="fw-bold text-primary">
          ⭐ Best Sellers
        </h2>

        <button className="btn btn-outline-primary">
          View All
        </button>

      </div>

      <div className="row">

        {bestSellers.map((product) => (

          <div className="col-md-3 mb-4" key={product.id}>

            <div className="card shadow-sm h-100">

              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
              />

              <div className="card-body">

                <h5>{product.name}</h5>

                <p>{product.rating}</p>

                <h5 className="text-primary">
                  {product.price}
                </h5>

                <button className="btn btn-primary w-100">
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
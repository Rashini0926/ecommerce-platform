const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "Rs. 8,500",
    image: "https://placehold.co/300x250"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: "Rs. 12,000",
    image: "https://placehold.co/300x250"
  },
  {
    id: 3,
    name: "Laptop Backpack",
    price: "Rs. 4,500",
    image: "https://placehold.co/300x250"
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: "Rs. 6,000",
    image: "https://placehold.co/300x250"
  }
];


function FeaturedProducts() {
  return (
    <section className="container py-5">

      <h2 className="text-center mb-4">
        Featured Products
      </h2>

      <div className="row">

        {products.map((product)=>(
          <div className="col-md-3 mb-4" key={product.id}>

            <div className="card shadow-sm h-100">

              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
              />

              <div className="card-body">

                <h5>{product.name}</h5>

                <p className="text-primary fw-bold">
                  {product.price}
                </p>

                <button className="btn btn-outline-primary w-100">
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
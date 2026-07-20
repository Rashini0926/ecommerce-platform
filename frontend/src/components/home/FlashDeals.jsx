const deals = [
  {
    id: 1,
    name: "Gaming Mouse",
    oldPrice: "Rs. 4,500",
    newPrice: "Rs. 2,999",
    discount: "33%",
    image: "https://placehold.co/300x250?text=Gaming+Mouse",
  },
  {
    id: 2,
    name: "Wireless Earbuds",
    oldPrice: "Rs. 8,000",
    newPrice: "Rs. 5,999",
    discount: "25%",
    image: "https://placehold.co/300x250?text=Earbuds",
  },
  {
    id: 3,
    name: "Office Chair",
    oldPrice: "Rs. 24,000",
    newPrice: "Rs. 18,500",
    discount: "23%",
    image: "https://placehold.co/300x250?text=Office+Chair",
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    oldPrice: "Rs. 12,500",
    newPrice: "Rs. 9,500",
    discount: "24%",
    image: "https://placehold.co/300x250?text=Keyboard",
  },
];

function FlashDeals() {
  return (
    <section className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="fw-bold text-danger">
          ⚡ Flash Deals
        </h2>

        <button className="btn btn-outline-danger">
          View All
        </button>

      </div>

      <div className="row">

        {deals.map((item) => (

          <div className="col-md-3 mb-4" key={item.id}>

            <div className="card shadow-sm h-100">

              <img
                src={item.image}
                className="card-img-top"
                alt={item.name}
              />

              <div className="card-body">

                <span className="badge bg-danger mb-2">
                  -{item.discount}
                </span>

                <h5>{item.name}</h5>

                <p className="mb-1 text-decoration-line-through text-muted">
                  {item.oldPrice}
                </p>

                <h5 className="text-danger fw-bold">
                  {item.newPrice}
                </h5>

                <button className="btn btn-danger w-100 mt-2">
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
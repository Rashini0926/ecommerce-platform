import {
  FaBasketShopping,
  FaCouch,
  FaDumbbell,
  FaLaptop,
  FaShirt,
  FaSpa,
} from "react-icons/fa6";

const categories = [
  { id: 1, name: "Electronics", icon: <FaLaptop /> },
  { id: 2, name: "Fashion", icon: <FaShirt /> },
  { id: 3, name: "Home & Living", icon: <FaCouch /> },
  { id: 4, name: "Beauty", icon: <FaSpa /> },
  { id: 5, name: "Sports", icon: <FaDumbbell /> },
  { id: 6, name: "Groceries", icon: <FaBasketShopping /> },
];

function Categories() {
  return (
    <section className="container section-padding">
      <div className="text-center mb-5 fade-in">
        <span className="section-kicker">Explore departments</span>
        <h2 className="mt-2">Shop by Category</h2>
      </div>

      <div className="row g-4">
        {categories.map((category) => (
          <div className="col-6 col-md-4 col-lg-2" key={category.id}>
            <div className="card glass-card hover-lift card-hover-shadow text-center h-100">
              <div className="card-body py-4">
                <div className="icon-circle fs-3 mb-3">{category.icon}</div>
                <h6 className="mb-0">{category.name}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;

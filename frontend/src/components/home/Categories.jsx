const categories = [
  { id: 1, name: "Electronics", icon: "💻" },
  { id: 2, name: "Fashion", icon: "👕" },
  { id: 3, name: "Home & Living", icon: "🏠" },
  { id: 4, name: "Beauty", icon: "💄" },
  { id: 5, name: "Sports", icon: "⚽" },
  { id: 6, name: "Groceries", icon: "🛒" },
];

function Categories() {
  return (
    <section className="container py-5">
      <h2 className="text-center mb-4">Shop by Category</h2>

      <div className="row">
        {categories.map((category) => (
          <div className="col-md-4 col-lg-2 mb-4" key={category.id}>
            <div className="card text-center shadow-sm h-100">
              <div className="card-body">
                <div style={{ fontSize: "40px" }}>{category.icon}</div>
                <h6 className="mt-3">{category.name}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;
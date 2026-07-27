import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (brand) params.append('brand', brand);
    if (color) params.append('color', color);
    if (minPrice) params.append('min_price', minPrice);
    if (maxPrice) params.append('max_price', maxPrice);

    fetch(`http://127.0.0.1:8000/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearFilters = () => {
    setSearch('');
    setBrand('');
    setColor('');
    setMinPrice('');
    setMaxPrice('');
    setTimeout(fetchProducts, 0);
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Filter Sidebar */}
        <div className="col-md-3">
          <form onSubmit={handleFilter} className="p-3 border rounded-3 shadow-sm">
            <h6 className="fw-bold mb-3">Filters</h6>

            <div className="mb-3">
              <label className="form-label small">Search</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small">Brand</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="e.g. Apple"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small">Color</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="e.g. Black"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small">Price Range</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-sm w-100 mb-2">
              Apply Filters
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm w-100"
              onClick={clearFilters}
            >
              Clear
            </button>
          </form>
        </div>

        {/* Product Grid */}
        <div className="col-md-9">
          <h4 className="fw-bold mb-4">
            {loading ? 'Loading...' : `${products.length} Products Found`}
          </h4>

          {!loading && products.length === 0 && (
            <p className="text-muted">No products match your filters.</p>
          )}

          <div className="row g-4">
            {products.map((product) => (
              <div className="col-md-4" key={product.id}>
                <Link
                  to={`/products/${product.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    className="card h-100 shadow-sm"
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      border: '1px solid #eef0f3',
                      borderRadius: '12px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
                    />
                    <div className="card-body">
                      <p className="text-muted small mb-1">{product.brand}</p>
                      <h6 className="fw-bold mb-2">{product.name}</h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold" style={{ color: '#2563eb' }}>
                          ${product.price}
                        </span>
                        <span className="small text-warning">★ {product.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
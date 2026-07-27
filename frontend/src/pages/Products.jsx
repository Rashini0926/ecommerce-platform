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

  const inputStyle = {
    fontSize: '13.5px',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  };

  return (
    <div style={{ background: '#fafbfc', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="row g-4">
          {/* Filter Sidebar */}
          <div className="col-lg-3">
            <form
              onSubmit={handleFilter}
              style={{
                background: '#ffffff',
                border: '1px solid #eef0f3',
                borderRadius: '14px',
                padding: '22px',
                position: 'sticky',
                top: '20px',
              }}
            >
              <h6 className="fw-bold mb-4" style={{ fontSize: '15px', letterSpacing: '0.02em' }}>
                FILTERS
              </h6>

              <div className="mb-3">
                <label className="d-block mb-2" style={{ fontSize: '12.5px', color: '#6b7280', fontWeight: 500 }}>
                  Search
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={inputStyle}
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="d-block mb-2" style={{ fontSize: '12.5px', color: '#6b7280', fontWeight: 500 }}>
                  Brand
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={inputStyle}
                  placeholder="e.g. Apple"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="d-block mb-2" style={{ fontSize: '12.5px', color: '#6b7280', fontWeight: 500 }}>
                  Color
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={inputStyle}
                  placeholder="e.g. Black"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="d-block mb-2" style={{ fontSize: '12.5px', color: '#6b7280', fontWeight: 500 }}>
                  Price Range
                </label>
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    className="form-control"
                    style={inputStyle}
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control"
                    style={inputStyle}
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-100 mb-2"
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1d4ed8')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#2563eb')}
              >
                Apply Filters
              </button>
              <button
                type="button"
                className="w-100"
                style={{
                  background: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '13.5px',
                  fontWeight: 500,
                }}
                onClick={clearFilters}
              >
                Clear all
              </button>
            </form>
          </div>

          {/* Product Grid */}
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0" style={{ fontSize: '22px' }}>
                {loading ? 'Loading...' : `${products.length} Products`}
              </h4>
            </div>

            {!loading && products.length === 0 && (
              <div
                className="text-center py-5"
                style={{ background: '#fff', borderRadius: '14px', border: '1px solid #eef0f3' }}
              >
                <p className="text-muted mb-0">No products match your filters.</p>
              </div>
            )}

            <div className="row g-4">
              {products.map((product) => (
                <div className="col-md-4" key={product.id}>
                  <Link
                    to={`/products/${product.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #eef0f3',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                        height: '100%',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.boxShadow = '0 20px 32px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ background: '#f7f8fa', height: '210px' }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ padding: '18px' }}>
                        <p
                          className="mb-1"
                          style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500, letterSpacing: '0.03em' }}
                        >
                          {product.brand?.toUpperCase()}
                        </p>
                        <h6 className="mb-3" style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>
                          {product.name}
                        </h6>
                        <div className="d-flex justify-content-between align-items-center">
                          <span style={{ fontSize: '17px', fontWeight: 700, color: '#2563eb' }}>
                            ${product.price}
                          </span>
                          <span style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 500 }}>
                            ★ {product.rating}
                          </span>
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
    </div>
  );
}

export default Products;
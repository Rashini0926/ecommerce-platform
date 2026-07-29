import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load product:', err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center text-muted">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">Product not found.</p>
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#fafbfc', minHeight: '100vh' }}>
      <div className="container py-5">
        <Link
          to="/products"
          style={{ fontSize: '13.5px', color: '#6b7280', textDecoration: 'none' }}
        >
          ← Back to Products
        </Link>

        <div className="row g-5 mt-2">
          {/* Image */}
          <div className="col-md-5">
            <div
              style={{
                background: '#f7f8fa',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #eef0f3',
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '420px', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="col-md-7">
            <p
              className="mb-2"
              style={{ fontSize: '12.5px', color: '#9ca3af', fontWeight: 600, letterSpacing: '0.05em' }}
            >
              {product.brand?.toUpperCase()}
            </p>

            <h2 className="fw-bold mb-3" style={{ fontSize: '28px' }}>
              {product.name}
            </h2>

            <div className="d-flex align-items-center gap-3 mb-4">
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#2563eb' }}>
                ${product.price}
              </span>
              <span
                style={{
                  fontSize: '13.5px',
                  color: '#f59e0b',
                  fontWeight: 600,
                  background: '#fff7ed',
                  padding: '4px 10px',
                  borderRadius: '999px',
                }}
              >
                ★ {product.rating}
              </span>
            </div>

            <p className="mb-4" style={{ fontSize: '14.5px', color: '#4b5563', lineHeight: 1.7 }}>
              {product.description}
            </p>

            {/* Specifications */}
            <div
              className="mb-4"
              style={{
                background: '#ffffff',
                border: '1px solid #eef0f3',
                borderRadius: '12px',
                padding: '18px',
              }}
            >
              <h6 className="fw-bold mb-3" style={{ fontSize: '14px' }}>
                Specifications
              </h6>
              <div className="row gy-2" style={{ fontSize: '13.5px' }}>
                <div className="col-6 text-muted">Category</div>
                <div className="col-6 fw-medium">{product.category?.name || '—'}</div>

                <div className="col-6 text-muted">Subcategory</div>
                <div className="col-6 fw-medium">{product.subcategory?.name || '—'}</div>

                <div className="col-6 text-muted">Brand</div>
                <div className="col-6 fw-medium">{product.brand || '—'}</div>

                <div className="col-6 text-muted">Color</div>
                <div className="col-6 fw-medium">{product.color || '—'}</div>

                <div className="col-6 text-muted">Size</div>
                <div className="col-6 fw-medium">{product.size || '—'}</div>

                <div className="col-6 text-muted">Stock</div>
                <div className="col-6 fw-medium">
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </div>
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center"
                style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: '8px 14px',
                    fontSize: '16px',
                  }}
                >
                  −
                </button>
                <span style={{ padding: '0 14px', fontSize: '14px', fontWeight: 600 }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: '8px 14px',
                    fontSize: '16px',
                  }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  background: added ? '#16a34a' : '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14.5px',
                  fontWeight: 600,
                  transition: 'background 0.2s ease',
                }}
              >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews placeholder */}
        <div className="mt-5 pt-4" style={{ borderTop: '1px solid #eef0f3' }}>
          <h5 className="fw-bold mb-3">Reviews</h5>
          <p className="text-muted" style={{ fontSize: '14px' }}>
            No reviews yet for this product.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
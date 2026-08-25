import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { addToCart } from '../services/customerService';
import { getProduct } from '../services/productService';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load product:', err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      showToast('Please log in as a customer to add products to your cart.', 'info');
      navigate('/login');
      return;
    }

    if (user?.role !== 'customer') {
      showToast('Only customer accounts can use the shopping cart.', 'warning');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(token, product.id, quantity);
      setAdded(true);
      showToast('Product added to cart.', 'success');
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to add product to cart.', 'danger');
    } finally {
      setIsAdding(false);
    }
  };

  const placeholderImage = `${import.meta.env.BASE_URL}images/products/placeholder.svg`;

  const getImageSrc = (image) => {
    if (!image) {
      return placeholderImage;
    }

    return image.startsWith('http')
      ? image
      : `${import.meta.env.BASE_URL}${image.replace(/^\/+/, '')}`;
  };

  if (loading) {
    return (
      <div
        style={{
          background: 'linear-gradient(180deg, #f4f7fc 0%, #eef2f9 100%)',
          minHeight: '100vh',
          color: '#0f172a',
          padding: '48px 0',
        }}
      >
        <div className="container">
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e7eefb',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 16px 34px rgba(15, 23, 42, 0.06)',
              textAlign: 'center',
            }}
          >
            <p className="mb-2" style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Product details
            </p>
            <p style={{ fontSize: '16px', color: '#64748b', marginBottom: 0 }}>
              Loading product...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          background: 'linear-gradient(180deg, #f4f7fc 0%, #eef2f9 100%)',
          minHeight: '100vh',
          color: '#0f172a',
          padding: '48px 0',
        }}
      >
        <div className="container">
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e7eefb',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 16px 34px rgba(15, 23, 42, 0.06)',
              textAlign: 'center',
            }}
          >
            <p className="mb-2" style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Product details
            </p>
            <p className="mb-3" style={{ fontSize: '16px', color: '#64748b' }}>
              Product not found.
            </p>
            <Link
              to="/products"
              style={{
                fontSize: '14px',
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #f4f7fc 0%, #eef2f9 100%)',
        minHeight: '100vh',
        color: '#0f172a',
        padding: '48px 0',
      }}
    >
      <div className="container">
        <Link
          to="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13.5px',
            color: '#2563eb',
            textDecoration: 'none',
            fontWeight: 700,
            marginBottom: '24px',
          }}
        >
          <span aria-hidden="true">←</span>
          <span>Back to Products</span>
        </Link>

        <div className="row g-5 align-items-start">
          {/* Image */}
          <div className="col-12 col-lg-5">
            <div
              style={{
                background: '#f4f7fc',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid #e7eefb',
                boxShadow: '0 16px 34px rgba(15, 23, 42, 0.06)',
                padding: '18px',
              }}
            >
              <img
                src={getImageSrc(product.image)}
                alt={product.name}
                style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '18px' }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = placeholderImage;
                }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="col-12 col-lg-7">
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e7eefb',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 16px 34px rgba(15, 23, 42, 0.06)',
              }}
            >
              <p
                className="mb-2"
                style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}
              >
                {product.brand?.toUpperCase()}
              </p>

              <h2 className="fw-bold mb-3" style={{ fontSize: '28px', color: '#0f172a' }}>
                {product.name}
              </h2>

              <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#2563eb' }}>
                  ${product.price}
                </span>
                <span
                  style={{
                    fontSize: '13.5px',
                    color: '#f59e0b',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    boxShadow: 'inset 0 1px 2px rgba(249, 115, 22, 0.12)',
                  }}
                >
                  ★ {product.rating}
                </span>
              </div>

              <p className="mb-4" style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.7 }}>
                {product.description}
              </p>

              {/* Specifications */}
              <div
                className="mb-4"
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e7eefb',
                  borderRadius: '18px',
                  padding: '18px 20px',
                }}
              >
                <h6 className="fw-bold mb-3" style={{ fontSize: '14px', color: '#0f172a' }}>
                  Specifications
                </h6>
                <div style={{ fontSize: '13.5px' }}>
                  <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid #e7eefb' }}>
                    <span style={{ color: '#64748b' }}>Category</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{product.category?.name || '—'}</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid #e7eefb' }}>
                    <span style={{ color: '#64748b' }}>Subcategory</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{product.subcategory?.name || '—'}</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid #e7eefb' }}>
                    <span style={{ color: '#64748b' }}>Brand</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{product.brand || '—'}</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid #e7eefb' }}>
                    <span style={{ color: '#64748b' }}>Color</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{product.color || '—'}</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid #e7eefb' }}>
                    <span style={{ color: '#64748b' }}>Size</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{product.size || '—'}</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center py-2">
                    <span style={{ color: '#64748b' }}>Stock</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>
                      {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity + Add to Cart */}
              <div className="d-flex flex-column flex-md-row align-items-stretch gap-3">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    border: '1px solid #dbe7f8',
                    borderRadius: '999px',
                    padding: '4px',
                    background: '#f8fbff',
                    minWidth: '150px',
                  }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      width: '42px',
                      height: '42px',
                      fontSize: '18px',
                      color: '#2563eb',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    −
                  </button>
                  <span style={{ padding: '0 12px', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      width: '42px',
                      height: '42px',
                      fontSize: '18px',
                      color: '#2563eb',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock < 1}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 26px rgba(37, 99, 235, 0.26)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 10px 22px rgba(37, 99, 235, 0.2)';
                  }}
                  style={{
                    flex: 1,
                    background: added ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '12px 18px',
                    fontSize: '14.5px',
                    fontWeight: 700,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '0 10px 22px rgba(37, 99, 235, 0.2)',
                  }}
                >
                  {isAdding ? 'Adding...' : added ? '✓ Added to Cart' : product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews placeholder */}
        <div className="mt-5 pt-4" style={{ borderTop: '1px solid #e7eefb' }}>
          <h5 className="fw-bold mb-3" style={{ color: '#0f172a' }}>
            Reviews
          </h5>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: 0 }}>
            No reviews yet for this product.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

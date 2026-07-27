import { useState, useEffect } from 'react';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load categories:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="container py-5">
        <h2 className="text-center mb-4">Shop by Category</h2>
        <p className="text-center text-muted">Loading categories...</p>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold mb-2">Shop by Category</h2>
        <p className="text-muted">Explore our wide range of products</p>
      </div>

      <div className="row g-3">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <div
              className="col-6 col-md-4 col-lg-2"
              key={category.id}
              onMouseEnter={() => setActiveCategory(category.id)}
              onMouseLeave={() => setActiveCategory(null)}
              style={{ position: 'relative' }}
            >
              <div
                className="text-center h-100"
                style={{
                  cursor: 'pointer',
                  padding: '28px 12px',
                  borderRadius: '16px',
                  background: isActive ? '#f5f8ff' : '#ffffff',
                  border: `1px solid ${isActive ? '#2563eb' : '#eef0f3'}`,
                  transition: 'all 0.25s ease',
                  transform: isActive ? 'translateY(-6px)' : 'none',
                  boxShadow: isActive
                    ? '0 16px 28px rgba(37, 99, 235, 0.12)'
                    : '0 2px 6px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    margin: '0 auto 14px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    background: isActive ? '#2563eb' : '#f7f8fa',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {category.icon}
                </div>
                <h6
                  className="mb-0"
                  style={{
                    fontWeight: 600,
                    color: isActive ? '#2563eb' : '#1f2430',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {category.name}
                </h6>
              </div>

              {isActive && category.subcategories?.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    minWidth: '200px',
                    background: '#ffffff',
                    border: '1px solid #eef0f3',
                    borderRadius: '12px',
                    padding: '10px 0',
                    boxShadow: '0 16px 32px rgba(0,0,0,0.08)',
                    zIndex: 20,
                    animation: 'catFadeIn 0.18s ease',
                  }}
                >
                  {category.subcategories.map((sub) => (
                    <div
                      key={sub.id}
                      style={{
                        padding: '9px 20px',
                        fontSize: '13.5px',
                        color: '#374151',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f5f8ff';
                        e.currentTarget.style.color = '#2563eb';
                        e.currentTarget.style.paddingLeft = '24px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                    >
                      {sub.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes catFadeIn {
          from { opacity: 0; transform: translate(-50%, -6px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </section>
  );
}

export default Categories;
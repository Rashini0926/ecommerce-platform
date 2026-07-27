import { FaHeart, FaRegHeart } from "react-icons/fa";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import WishlistCard from "../components/wishlist/WishlistCard";

function Wishlist() {
  const wishlist = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 12990,
      image: "https://picsum.photos/400/300?random=1",
    },
    {
      id: 2,
      name: "Gaming Mouse",
      price: 5990,
      image: "https://picsum.photos/400/300?random=2",
    },
    {
      id: 3,
      name: "Smart Watch",
      price: 18990,
      image: "https://picsum.photos/400/300?random=3",
    },
  ];

  return (
    <div className="app-page">
      <Navbar />

      <main className="container py-5">
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <div>
            <span className="section-kicker">Saved products</span>
            <h2 className="mb-0 mt-2">
              <FaHeart className="me-2 text-danger" />
              My Wishlist
            </h2>
          </div>

          <span className="badge badge-soft-danger">
            {wishlist.length} saved items
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="card glass-card empty-state">
            <div className="empty-illustration mb-4">
              <FaRegHeart size={42} />
            </div>

            <h4>Your wishlist is empty.</h4>
            <p className="text-muted">
              Save products you love and compare them later.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="col-lg-4 col-md-6"
              >
                <WishlistCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Wishlist;

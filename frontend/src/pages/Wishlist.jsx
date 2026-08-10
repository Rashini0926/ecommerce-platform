import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import WishlistCard from "../components/wishlist/WishlistCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  addToCart,
  getWishlist,
  removeFromWishlist,
} from "../services/customerService";

function Wishlist() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);

      try {
        const response = await getWishlist(token);
        setWishlist(response.items || []);
      } catch (error) {
        showToast(
          error.response?.data?.message || "Failed to load wishlist.",
          "danger"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      loadWishlist();
    }
  }, [showToast, token]);

  const handleRemove = async (wishlistItemId) => {
    setProcessingId(wishlistItemId);

    try {
      await removeFromWishlist(token, wishlistItemId);
      setWishlist((currentItems) =>
        currentItems.filter((item) => item.id !== wishlistItemId)
      );
      showToast("Product removed from wishlist.", "info");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to remove wishlist item.",
        "danger"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleMoveToCart = async (item) => {
    setProcessingId(item.id);

    try {
      await addToCart(token, item.product_id, 1);
      await removeFromWishlist(token, item.id);
      setWishlist((currentItems) =>
        currentItems.filter((wishlistItem) => wishlistItem.id !== item.id)
      );
      showToast("Product moved to cart.", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to move product to cart.",
        "danger"
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="app-page">
      <Navbar />

      <main className="container py-5">
        <div className="page-header mb-4">
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

        {isLoading ? (
          <div className="card glass-card empty-state">
            <LoadingSpinner text="Loading wishlist" />
          </div>
        ) : wishlist.length === 0 ? (
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
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="col-lg-4 col-md-6"
              >
                <WishlistCard
                  item={item}
                  isProcessing={processingId === item.id}
                  onMoveToCart={handleMoveToCart}
                  onRemove={handleRemove}
                />
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

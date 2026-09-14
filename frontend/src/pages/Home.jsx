import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import FeaturedProducts from "../components/home/FeaturedProducts";
import FlashDeals from "../components/home/FlashDeals";
import BestSellers from "../components/home/BestSellers";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Newsletter from "../components/home/Newsletter";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { addToCart } from "../services/customerService";
import { getHomepageProducts } from "../services/productService";

function Home() {
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [sections, setSections] = useState({ featured_products: [], flash_deals: [], best_sellers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getHomepageProducts()
      .then((data) => { if (!cancelled) setSections(data); })
      .catch(() => { if (!cancelled) setError("Unable to load homepage products. Please try again shortly."); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const addProduct = async (product, checkout = false) => {
    if (!token) {
      showToast("Log in as a customer to continue.", "info");
      navigate("/login");
      return;
    }

    if (user?.role !== "customer") {
      showToast("Only customer accounts can purchase products.", "warning");
      return;
    }

    setAddingId(product.id);
    try {
      await addToCart(token, product.id, 1);
      showToast(`${product.name} added to your cart.`, "success");
      if (checkout) navigate("/checkout");
    } catch (requestError) {
      const validationMessage = requestError.response?.data?.errors?.quantity?.[0];
      showToast(validationMessage || requestError.response?.data?.message || "Unable to add this product.", "danger");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <>
      <Navbar />

      <Hero />

      {error && <div className="container mt-4"><div className="alert alert-danger mb-0">{error}</div></div>}

      <FeaturedProducts products={sections.featured_products} loading={loading} addingId={addingId} onAdd={addProduct} />

      <FlashDeals products={sections.flash_deals} loading={loading} addingId={addingId} onAdd={addProduct} />

      <BestSellers products={sections.best_sellers} loading={loading} addingId={addingId} onAdd={addProduct} />

      <WhyChooseUs />

      <Newsletter />

      <Footer />
    </>
  );
}

export default Home;

import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import FlashDeals from "../components/home/FlashDeals";
import BestSellers from "../components/home/BestSellers";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Newsletter from "../components/home/Newsletter";
import Footer from "../components/layout/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <Categories />

      <FeaturedProducts />

      <FlashDeals />

      <BestSellers />

      <WhyChooseUs />

      <Newsletter />

      <Footer />
    </>
  );
}

export default Home;
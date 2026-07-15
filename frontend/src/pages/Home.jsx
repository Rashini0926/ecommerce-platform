import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Footer from "../components/layout/Footer";


function Home() {

  return (
    <>
      <Navbar />

      <Hero />

      <Categories />

      <FeaturedProducts />
      <Footer />

    </>
  );
}

export default Home;
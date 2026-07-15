import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";


function Home() {

  return (
    <>
      <Navbar />

      <Hero />

      <Categories />

      <FeaturedProducts />

    </>
  );
}

export default Home;
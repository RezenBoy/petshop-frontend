import Footer from "./common/user/Footer";
import Navbar from "./common/user/NavBar";
import { Link } from "react-router-dom";
import CategorySection from "./home/CategorySection";
import FeaturedProducts from "./home/FeaturedProducts";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-100 via-blue-100 to-yellow-100 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-6">
            <div className="text-5xl md:text-6xl mb-3">🐾</div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4">
              Happy Pets, Happy You
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover everything your furry friends need — from nutritious food
              to cozy accessories and playful toys.
            </p>
            <Link
              to="/shop"
              className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-6 py-3 rounded-full text-lg font-medium hover:opacity-90 transition-all shadow-md"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Shop by Category */}
      <CategorySection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* About */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            About Bowlfull Buddies
          </h2>
          <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl p-8 shadow">
            <p className="text-gray-700 leading-relaxed">
              At Bowlfull Buddies, we believe every pet deserves the very best.
              Founded by passionate pet lovers, we're dedicated to providing
              high-quality products that keep your furry friends healthy, happy,
              and loved. From premium nutrition to engaging toys and essential
              accessories, our mission is simple: to strengthen the bond between
              you and your beloved pets.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;

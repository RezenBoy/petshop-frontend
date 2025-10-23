import { useEffect, useState } from "react";
import Footer from "./common/user/Footer";
import axios from "axios";
import {
  ShoppingCart,
} from "lucide-react";
import Navbar from "./common/user/NavBar";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, productRes] = await Promise.all([
          axios.get("http://localhost:8080/api/categories"),
          axios.get("http://localhost:8080/api/products"), // changed from /featured
        ]);

        setCategories(categoryRes.data || []);
        setProducts(productRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
        <div className="text-lg font-medium text-gray-600 animate-pulse">
          Loading pet paradise...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <Navbar />

      {/* 🦴 Hero Section */}
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

      {/* 🐶 Dynamic Categories */}
      <section className="py-16 bg-white" id="categories">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Shop by Category
          </h2>

          {categories.length === 0 ? (
            <p className="text-center text-gray-500">No categories found.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id || idx}
                  className={`bg-gradient-to-br from-pink-100 to-blue-100 rounded-2xl p-8 text-center hover:shadow-lg transition-all cursor-pointer`}
                >
                  <div className="text-5xl mb-3">
                    {cat.categoryName === "Dog"
                      ? "🐶"
                      : cat.categoryName === "Cat"
                      ? "🐱"
                      : "🎾"}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {cat.categoryName}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {cat.description || "Find great pet products!"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 🛍️ Dynamic Featured Products */}
      <section className="py-16 bg-gray-50" id="featured">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Featured Products
          </h2>

          {products.length === 0 ? (
            <p className="text-center text-gray-500">
              No products available yet.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden group"
                >
                  {/* Wrap image area with Link */}
                  <Link to={`/product/${product.id}`}>
                    <div className="bg-gradient-to-br from-pink-50 to-blue-50 h-44 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                      🐾
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      {/* Wrap product title with Link */}
                      <Link
                        to={`/product/${product.id}`}
                        className="text-lg font-semibold text-gray-800 hover:text-pink-500 transition"
                      >
                        {product.productName}
                      </Link>

                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        {product.productSubCategory?.subCategoryName ||
                          "General"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-pink-500">
                        ₹{product.mrp}
                      </span>

                      {/* Add button can also navigate to ProductView */}
                      <Link
                        to={`/product/${product.id}`}
                        className="bg-gradient-to-r from-pink-400 to-blue-400 text-white px-3 py-2 rounded-lg hover:opacity-90 transition-all flex items-center space-x-1 text-sm"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>View</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 🐾 About */}
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

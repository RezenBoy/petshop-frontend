import { useEffect, useState } from "react";
import Footer from "../components/common/user/Footer";
import axios from "axios";
import Navbar from "../components/common/user/NavBar";
import { Link } from "react-router-dom";
import api from "../libs/api";
import bg from "../assets/images/backgroundImage.png";
// import bg from "../assets/images/background.png";
import { ShoppingCart, ArrowRight, Package, Award, PawPrint, HeadphonesIcon } from "lucide-react";
import { ReactComponent as DeliveryIcon } from "../assets/svg/fast-delivery-svgrepo-com.svg";
import { ReactComponent as QualityIcon } from "../assets/svg/quality-supervision-svgrepo-com.svg";
import { ReactComponent as BestPriceIcon } from "../assets/svg/best-price-guarantee-warranty-svgrepo-com.svg";
import { ReactComponent as SupportIcon } from "../assets/svg/pet-svgrepo-com.svg";


const API = process.env.REACT_APP_API_URL;

const getCategoryIcon = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("dog")) return "🐶";
  if (n.includes("cat")) return "🐱";
  if (n.includes("bird")) return "🐦";
  if (n.includes("fish")) return "🐠";
  if (n.includes("rabbit") || n.includes("bunny")) return "🐰";
  return "🐾";
};

const getCategoryGradient = (index) => {
  const gradients = [
    "from-pink-100 to-rose-100",
    "from-blue-100 to-indigo-100",
    "from-amber-100 to-yellow-100",
    "from-green-100 to-emerald-100",
    "from-purple-100 to-violet-100",
    "from-teal-100 to-cyan-100",
  ];
  return gradients[index % gradients.length];
};

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const unauthApi = axios.create({
      baseURL: API + "/api",
      headers: { "Content-Type": "application/json" },
    });

    const fetchData = async () => {
      setLoading(true);
      try {
        const [productRes, categoryRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);
        if (!mounted) return;
        setProducts(productRes.data || []);
        setCategories(categoryRes.data || []);
      } catch (err) {
        console.warn("Primary API fetch failed, attempting unauth fallback:", err?.response?.status ?? err);
        try {
          const [productRes2, categoryRes2] = await Promise.all([
            unauthApi.get("/products"),
            unauthApi.get("/categories"),
          ]);
          if (!mounted) return;
          setProducts(productRes2.data || []);
          setCategories(categoryRes2.data || []);
        } catch (err2) {
          console.error("Fallback unauthenticated fetch also failed:", err2);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 gap-4">
        <div className="text-4xl animate-bounce">🐾</div>
        <p className="text-base font-medium text-gray-500 animate-pulse">Loading pet paradise...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <Navbar />

      {/* Spacer for fixed navbar */}
      {/* <div className="h-0" /> */}

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/10 to-transparent" />
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-pink-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-28">
          {/* Two column layout */}
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 lg:gap-12">

            {/* LEFT — Text content */}
            <div className="flex-1 text-left max-w-xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-pink-200/50 px-3 py-1.5 rounded-full text-xs sm:text-sm text-pink-600 font-medium mb-5">
                <span className="text-base leading-none">🐾</span>
                Your trusted pet store
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-5 leading-tight tracking-tight">
                Happy Pets,{" "}
                <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                  Happy You
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-700 mb-8 leading-relaxed max-w-md">
                Everything your furry friends need — nutritious food, cozy accessories, and playful toys, all in one place.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white px-7 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-pink-200"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#categories"
                  className="inline-flex items-center justify-center gap-2 bg-white/80 text-gray-700 border border-gray-200 px-7 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-medium hover:bg-white hover:border-pink-200 active:scale-95 transition-all"
                >
                  Browse Categories
                </a>
              </div>
            </div>

            {/* RIGHT — spacer so the background image pet shows on the right */}
            <div className="hidden lg:block flex-1" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-t from-white to-transparent" />
      </section>
      {/* ── Categories ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white" id="categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">
              Shop by Category
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
              Find exactly what your pet needs
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No categories found.</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-5 sm:gap-6 lg:gap-8">
              {categories.map((cat, idx) => (
                <Link
                  key={cat.id || idx}
                  to={`/shop?category=${cat.id}`}
                  className={`group bg-gradient-to-br ${getCategoryGradient(idx)} rounded-2xl p-4 sm:p-6 text-center hover:shadow-md active:scale-95 transition-all cursor-pointer border border-white/60 w-[calc(50%-10px)] sm:w-[calc(33.33%-16px)] lg:w-[calc(25%-18px)] xl:w-[calc(20%-20px)]`}
                >
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200">
                    {getCategoryIcon(cat.categoryName)}
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-0.5 line-clamp-1">
                    {cat.categoryName}
                  </h3>
                  <p className="text-gray-500 text-xs hidden sm:block line-clamp-2">
                    {cat.description || "Find great products!"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50/80" id="featured">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
                Featured Products
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">Handpicked favorites for your pets</p>
            </div>
            <Link
              to="/shop"
              className="flex items-center gap-1.5 text-sm font-medium text-pink-500 hover:text-pink-600 transition-colors self-start sm:self-auto whitespace-nowrap"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-1">No products available yet</p>
              <p className="text-sm">Check back soon for exciting new arrivals!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all group flex flex-col"
                >
                  {/* Image */}
                  <Link to={`/product/${product.id}`} className="block flex-shrink-0">
                    <div className="relative bg-gradient-to-br from-pink-50 to-blue-50 h-40 sm:h-44 lg:h-48 flex items-center justify-center overflow-hidden">
                      {product.imageUrls?.length > 0 ? (
                        <img
                          src={API + product.imageUrls[0]}
                          alt={product.productName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-5xl group-hover:scale-110 transition-transform duration-200">🐾</span>
                      )}
                      {/* Badge */}
                      <span className="absolute top-2.5 left-2.5 bg-yellow-100 text-yellow-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {product.productSubCategory?.subCategoryName || "General"}
                      </span>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-3.5 sm:p-4 flex flex-col flex-1 gap-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="text-sm sm:text-base font-semibold text-gray-800 hover:text-pink-500 transition-colors line-clamp-2 leading-snug"
                    >
                      {product.productName}
                    </Link>

                    {product.description && (
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed ">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-1">
                      <div className="flex flex-col">
                        <span className="text-lg sm:text-xl font-bold text-pink-500">
                          ₹{product.mrp}
                        </span>
                        {product.originalPrice && product.originalPrice > product.mrp && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/product/${product.id}`}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-blue-500 text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-medium hover:opacity-90 active:scale-95 transition-all shadow-sm shadow-pink-100"
                        aria-label={`View ${product.productName}`}
                      >
                        <ShoppingCart className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="hidden xs:inline">View</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10 sm:mb-14">
            Why Pet Parents Love Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[
              { Icon: DeliveryIcon, title: "Fast Delivery", desc: "Get orders delivered to your doorstep quickly and reliably.", color: "bg-pink-50" },
              { Icon: QualityIcon, title: "Quality Assured", desc: "Every product is vet-reviewed and safe for your pets.", color: "bg-blue-50" },
              { Icon: BestPriceIcon, title: "Best Prices", desc: "Competitive pricing with regular deals and discounts.", color: "bg-amber-50" },
              { Icon: SupportIcon, title: "Pet Expert Support", desc: "Our team of pet lovers is always ready to help.", color: "bg-green-50" },
            ].map(({ Icon, title, desc, color }) => (
              <div key={title} className="flex flex-col items-center text-center p-4 rounded-2xl bg-gradient-to-br from-pink-50/50 to-blue-50/50 border border-gray-100 hover:border-pink-200/60 hover:shadow-sm transition-all">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-2.5 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Left */}
            <div className="flex-1 text-left">
              <span className="text-xs font-semibold tracking-widest text-pink-500 uppercase">
                Who We Are
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-5 leading-tight">
                Built for pets,<br /> by pet lovers.
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full mb-5" />
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-3">
                At Bowlfull Buddies, we believe every pet deserves the very best. We're dedicated to providing
                high-quality products that keep your furry friends healthy, happy, and loved.
              </p>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8">
                From premium nutrition to engaging toys and essential accessories — our mission is to strengthen
                the bond between you and your beloved pets.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-blue-500 px-6 py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right — Stats */}
            <div className="flex-1 w-full grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { value: "500+", label: "Products available", icon: Package, color: "text-pink-500 bg-pink-50" },
                { value: "50+", label: "Trusted brands", icon: Award, color: "text-blue-500 bg-blue-50" },
                { value: "10k+", label: "Happy pet parents", icon: PawPrint, color: "text-purple-500 bg-purple-50" },
                { value: "24/7", label: "Customer support", icon: HeadphonesIcon, color: "text-green-500 bg-green-50" },
              ].map(({ value, label, icon: Icon, color }) => (
                <div
                  key={label}
                  className="border border-gray-100 hover:border-pink-200 rounded-2xl p-5 sm:p-6 flex flex-col gap-1 transition-all hover:shadow-sm bg-white"
                >
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-1 ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                    {value}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400 leading-snug">{label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>


      {/* ── CTA Banner ── */}
      <section className="relative py-12 sm:py-16 bg-white">

        {/* Top Fade */}
        {/* <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none" /> */}

        {/* Bottom Fade */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" /> */}

        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">

          <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
            Ready to spoil your pet?
          </h2>

          <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">
            Browse hundreds of products curated just for your furry, feathered, or scaly friends.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-pink-50/50 to-blue-50/50 border border-gray-100 hover:border-pink-200/60 hover:shadow-sm transition-all text-pink-600 font-semibold px-7 py-3 rounded-full hover:bg-pink-50 active:scale-95 transition-all shadow-md text-sm sm:text-base"
          >
            Shop All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
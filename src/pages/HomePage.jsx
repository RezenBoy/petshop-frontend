import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ShoppingCart,
  ArrowRight,
  Package,
  Award,
  PawPrint,
  HeadphonesIcon,
  Loader2,
} from "lucide-react";

import Footer from "../components/common/user/Footer";
import Navbar from "../components/common/user/NavBar";
import api from "../libs/api";
import { BRAND } from "../components/common/brand";

import heroImage from "../assets/images/heroImage.png";
import { ReactComponent as DeliveryIcon } from "../assets/svg/fast-delivery-svgrepo-com.svg";
import { ReactComponent as QualityIcon } from "../assets/svg/quality-supervision-svgrepo-com.svg";
import { ReactComponent as BestPriceIcon } from "../assets/svg/best-price-guarantee-warranty-svgrepo-com.svg";
import { ReactComponent as SupportIcon } from "../assets/svg/pet-svgrepo-com.svg";

const API = process.env.REACT_APP_API_URL || "";

// Created once instead of on every fetch
const unauthApi = axios.create({
  baseURL: `${API}/api`,
  headers: { "Content-Type": "application/json" },
});

// ─── Constants ─────────────────────────────────────────────
const CATEGORY_GRADIENTS = [
  "from-primary/15 to-secondary/30",
  "from-accent/20 to-secondary/30",
  "from-secondary/40 to-surface",
  "from-primary/15 to-accent/20",
  "from-primary/10 to-accent/15",
  "from-accent/15 to-secondary/30",
];

const FEATURES = [
  {
    Icon: DeliveryIcon,
    title: "Fast Delivery",
    desc: "Get orders delivered to your doorstep quickly and reliably.",
    color: "bg-primary/15 text-primary",
  },
  {
    Icon: QualityIcon,
    title: "Quality Assured",
    desc: "Every product is vet-reviewed and safe for your pets.",
    color: "bg-accent/20 text-accent",
  },
  {
    Icon: BestPriceIcon,
    title: "Best Prices",
    desc: "Competitive pricing with regular deals and discounts.",
    color: "bg-secondary/30 text-text",
  },
  {
    Icon: SupportIcon,
    title: "Pet Expert Support",
    desc: "Our team of pet lovers is always ready to help.",
    color: "bg-secondary/40 text-primary",
  },
];

const STATS = [
  { value: "500+", label: "Products available", icon: Package, color: "text-primary bg-primary/10" },
  { value: "50+", label: "Trusted brands", icon: Award, color: "text-accent bg-accent/15" },
  { value: "10k+", label: "Happy pet parents", icon: PawPrint, color: "text-text bg-secondary/30" },
  { value: "24/7", label: "Customer support", icon: HeadphonesIcon, color: "text-text bg-accent/25" },
];

// ─── Utilities ───────────────────────────────────────────────
const getCategoryIcon = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("dog")) return "🐶";
  if (n.includes("cat")) return "🐱";
  if (n.includes("bird")) return "🐦";
  if (n.includes("fish")) return "🐠";
  if (n.includes("rabbit") || n.includes("bunny")) return "🐰";
  return "🐾";
};

const getCategoryGradient = (index) =>
  CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length];

const buildImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/")) return `${API}${imagePath}`;
  return `${API}/${imagePath}`;
};

const toArray = (data) => (Array.isArray(data) ? data : []);

// ─── Custom Hook: Data Fetching ────────────────────────────
const useHomeData = () => {
  const [state, setState] = useState({
    categories: [],
    products: [],
    loading: true,
    error: null,
  });
  const controllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    // Cancel any in-flight request before starting a new one
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const { signal } = controller;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    const load = async (client) => {
      const [productRes, categoryRes] = await Promise.all([
        client.get("/products", { signal }),
        client.get("/categories", { signal }),
      ]);
      return {
        products: toArray(productRes.data),
        categories: toArray(categoryRes.data),
      };
    };

    try {
      const data = await load(api);
      if (signal.aborted) return;
      setState({ ...data, loading: false, error: null });
    } catch (err) {
      if (signal.aborted || axios.isCancel(err)) return;

      // Fallback to unauthenticated client
      try {
        const data = await load(unauthApi);
        if (signal.aborted) return;
        setState({ ...data, loading: false, error: null });
      } catch (err2) {
        if (signal.aborted || axios.isCancel(err2)) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Unable to load content. Please check your connection.",
        }));
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
    return () => controllerRef.current?.abort();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
};

// ─── Sub-Components ──────────────────────────────────────
const HeroSection = () => (
  <section className="relative overflow-hidden min-h-[420px]">
    <img
      src={heroImage}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-contain p-6 pr-0 sm:p-10 sm:pr-0 translate-x-8 sm:translate-x-16 pointer-events-none select-none"
    />

    <div className="absolute inset-0 bg-gradient-to-r from-surface/20 via-surface/10 to-transparent pointer-events-none" />
    <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-32">
      <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8 lg:gap-12">
        <div className="flex-1 text-left w-full max-w-lg">
          <div className="inline-flex items-center gap-2 bg-surface/90 backdrop-blur-sm border border-secondary px-3 py-1.5 rounded-full text-xs sm:text-sm text-primary font-medium mb-5">
            <span className="text-base leading-none">🐾</span>
            Your trusted pet store
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-text mb-4 sm:mb-5 leading-tight tracking-tight">
            Happy Pets,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Happy You
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-textMuted mb-7 sm:mb-8 leading-relaxed max-w-md">
            Everything your furry friends need — nutritious food, cozy accessories, and playful toys, all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-surface px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-semibold active:scale-95 transition-all shadow-lg shadow-primary/20 w-full sm:w-auto"
            >
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#categories"
              className="inline-flex items-center justify-center gap-2 bg-surface/90 text-text border border-border px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-medium hover:bg-surface hover:border-primary active:scale-95 transition-all w-full sm:w-auto"
            >
              Browse Categories
            </a>
          </div>
        </div>
        <div className="hidden lg:block flex-1" />
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
  </section>
);

/*
 * Widths = (100% - total gaps) / columns, matched to the container's gap:
 *  base  : 2 cols, gap-4 (16px)  → 50%    - 8px
 *  sm    : 3 cols, gap-5 (20px)  → 33.33% - 13.33px
 *  lg    : 4 cols, gap-8 (32px)  → 25%    - 24px
 *  xl    : 5 cols, gap-8 (32px)  → 20%    - 25.6px
 * A small extra margin is subtracted to avoid sub-pixel wrapping.
 */
const CategoryCard = ({ category, index }) => {
  const gradient = useMemo(() => getCategoryGradient(index), [index]);
  const icon = useMemo(() => getCategoryIcon(category.categoryName), [category.categoryName]);

  return (
    <Link
      to={`/shop?category=${category.id}`}
      className={`group min-w-0 bg-gradient-to-br ${gradient} rounded-2xl p-4 sm:p-6 text-center hover:shadow-md active:scale-95 transition-all cursor-pointer border border-border/50 w-[calc(50%-8.5px)] sm:w-[calc(33.333%-13.5px)] lg:w-[calc(25%-24.5px)] xl:w-[calc(20%-25.8px)]`}
    >
      <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-text mb-0.5 line-clamp-1 break-words">
        {category.categoryName}
      </h3>
      <p className="text-textMuted text-xs hidden sm:block line-clamp-2 break-words">
        {category.description || "Find great products!"}
      </p>
    </Link>
  );
};

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl = useMemo(() => {
    if (imageError || !product.imageUrls?.length) return null;
    return buildImageUrl(product.imageUrls[0]);
  }, [product.imageUrls, imageError]);

  // Reset loader state if the product image changes
  useEffect(() => {
    setImageLoaded(false);
  }, [imageUrl]);

  const subcategory = product.productSubCategory?.subCategoryName || "General";

  return (
    <article className="bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-border transition-all group flex flex-col min-w-0">
      <Link
        to={`/product/${product.id}`}
        className="block flex-shrink-0"
        aria-label={`View ${product.productName}`}
      >
        <div className="relative bg-gradient-to-br from-secondary/20 to-accent/20 h-36 sm:h-44 lg:h-48 flex items-center justify-center overflow-hidden">
          {!imageLoaded && imageUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-textMuted animate-spin" />
            </div>
          )}

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.productName}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-200">
              🐾
            </span>
          )}

          <span className="absolute top-2 left-2 max-w-[calc(100%-1rem)] truncate bg-accent/30 text-text text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {subcategory}
          </span>
        </div>
      </Link>

      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-1.5 sm:gap-2 min-w-0">
        <Link
          to={`/product/${product.id}`}
          className="text-xs sm:text-sm lg:text-base font-semibold text-text hover:text-primary transition-colors line-clamp-2 leading-snug break-words"
        >
          {product.productName}
        </Link>

        {product.description && (
          <p className="text-xs text-textMuted leading-relaxed line-clamp-2 break-words">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          <div className="flex flex-col min-w-0">
            <span className="text-base sm:text-lg lg:text-xl font-bold text-primary truncate">
              ₹{product.mrp}
            </span>
            {product.originalPrice && product.originalPrice > product.mrp && (
              <span className="text-xs text-textMuted line-through truncate">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          <Link
            to={`/product/${product.id}`}
            className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 bg-primary hover:bg-primary/90 text-surface px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium active:scale-95 transition-all shadow-sm shadow-primary/20"
            aria-label={`View ${product.productName} details`}
          >
            <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">View</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

const FeatureCard = ({ Icon, title, desc, color }) => (
  <div className="flex flex-col items-center text-center p-3.5 sm:p-4 rounded-2xl bg-surface border border-border hover:border-primary/50 hover:shadow-sm transition-all">
    <div className={`h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 rounded-xl flex items-center justify-center mb-2 sm:mb-2.5 ${color}`}>
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
    </div>
    <h3 className="font-semibold text-text text-xs sm:text-sm mb-1">{title}</h3>
    <p className="text-textMuted text-xs leading-relaxed hidden sm:block">{desc}</p>
  </div>
);

const StatCard = ({ value, label, icon: Icon, color }) => (
  <div className="border border-border hover:border-primary/50 rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col gap-1 transition-all hover:shadow-sm bg-surface min-w-0">
    <div className={`h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 rounded-xl flex items-center justify-center mb-1 ${color}`}>
      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
    </div>
    <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
      {value}
    </span>
    <span className="text-xs sm:text-sm text-textMuted leading-snug">{label}</span>
  </div>
);

// ─── Main Component ──────────────────────────────────────
const HomePage = () => {
  const { categories, products, loading } = useHomeData();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <HeroSection />

      {/* Categories */}
      <section className="py-12 sm:py-16 lg:py-20 bg-surface scroll-mt-20" id="categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text mb-2 sm:mb-3">
              Shop by Category
            </h2>
            <p className="text-textMuted text-sm sm:text-base max-w-md mx-auto">
              Find exactly what your pet needs
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-8">
              {categories.map((cat, idx) => (
                <CategoryCard key={cat.id || idx} category={cat} index={idx} />
              ))}
            </div>
          ) : (
            // Don't flash the empty message while data is still loading
            !loading && (
              <div className="text-center py-12 text-textMuted">
                <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No categories found.</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background scroll-mt-20" id="featured">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text mb-1 sm:mb-2">
                Featured Products
              </h2>
              <p className="text-textMuted text-sm sm:text-base">
                Handpicked favorites for your pets
              </p>
            </div>
            <Link
              to="/shop"
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-accent transition-colors self-start sm:self-auto whitespace-nowrap flex-shrink-0"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            !loading && (
              <div className="text-center py-16 text-textMuted">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-1">No products available yet</p>
                <p className="text-sm">Check back soon for exciting new arrivals!</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 lg:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-text mb-8 sm:mb-12">
            Why Pet Parents Love Us
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 bg-background scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 sm:gap-12 lg:gap-20">
            <div className="flex-1 text-left w-full min-w-0">
              <span className="text-xs font-semibold tracking-widest text-accent uppercase">
                Who We Are
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text mt-2 mb-4 sm:mb-5 leading-tight">
                Built for pets,<br /> by pet lovers.
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-primary to-accent rounded-full mb-4 sm:mb-5" />
              <p className="text-textMuted text-sm sm:text-base leading-relaxed mb-3">
                At {BRAND.name}, we believe every pet deserves the very best. We're dedicated to providing
                high-quality products that keep your furry friends healthy, happy, and loved.
              </p>
              <p className="text-textMuted text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                From premium nutrition to engaging toys and essential accessories — our mission is to strengthen
                the bond between you and your beloved pets.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-surface bg-primary hover:bg-primary/90 px-6 py-2.5 rounded-full active:scale-95 transition-all shadow-sm shadow-primary/20"
              >
                Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex-1 w-full min-w-0 grid grid-cols-2 gap-3 sm:gap-4">
              {STATS.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-12 sm:py-16 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-3xl font-bold text-text mb-3 sm:mb-4">
            Ready to spoil your pet?
          </h2>
          <p className="text-textMuted text-sm sm:text-base mb-6 sm:mb-8">
            Browse hundreds of products curated just for your furry, feathered, or scaly friends.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-surface font-semibold px-6 sm:px-7 py-3 rounded-full active:scale-95 shadow-md text-sm sm:text-base transition-all"
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
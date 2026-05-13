import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, Filter, X, ChevronDown, Search, Loader2 } from "lucide-react";
import axios from "axios";
import Footer from "../components/common/user/Footer";

const API = process.env.REACT_APP_API_URL;

// ─── Constants ─────────────────────────────────────────────
const PRICE_RANGES = {
  "0-500": [0, 500],
  "500-1000": [500, 1000],
  "1000-2000": [1000, 2000],
  "2000+": [2000, Infinity]
};

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" }
];

// ─── Custom Hook: Cart ─────────────────────────────────────
const useCart = () => {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cartItems")) || [];
    } catch {
      return [];
    }
  });

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      let next;
      
      if (existing) {
        next = prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        next = [...prev, {
          id: Date.now(),
          productId: product.id,
          name: product.productName,
          price: product.price || product.mrp,
          image: product.imageUrls?.[0] || "",
          quantity: 1
        }];
      }
      
      localStorage.setItem("cartItems", JSON.stringify(next));
      window.dispatchEvent(new Event("cartUpdated"));
      return next;
    });
  }, []);

  return { cart, addToCart };
};

// ─── Custom Hook: Wishlist ─────────────────────────────────
const useWishlist = () => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      return [];
    }
  });

  const toggleWishlist = useCallback((productId) => {
    setWishlist(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem("wishlist", JSON.stringify(next));
      return next;
    });
  }, []);

  return { wishlist, toggleWishlist };
};

// ─── Sub-Components ────────────────────────────────────────

const ProductImage = ({ product, apiUrl }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const url = useMemo(() => {
    if (error || !product.imageUrls?.length) return null;
    const raw = product.imageUrls[0];
    return raw.startsWith('http') ? raw : `${apiUrl}${raw}`;
  }, [product.imageUrls, apiUrl, error]);

  return (
    <div className="relative aspect-square bg-gray-50 overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-gray-300 animate-spin" />
        </div>
      )}
      {url ? (
        <img
          src={url}
          alt={product.productName || "Product image"}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          onLoad={() => setLoading(false)}
          onError={() => { setError(true); setLoading(false); }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          No Image Available
        </div>
      )}
    </div>
  );
};

const StarRating = ({ rating = 4, count = 87 }) => (
  <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5 stars`}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
        aria-hidden="true"
      />
    ))}
    <span className="text-xs text-gray-500 ml-1">({count})</span>
  </div>
);

const FilterSelect = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none bg-white text-sm"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// ─── Main Component ──────────────────────────────────────
const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    subCategory: "all",
    priceRange: "all",
    sortBy: "featured"
  });

  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const searchInputRef = useRef(null);

  // Fetch products
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/api/products`, {
          signal: controller.signal
        });
        setProducts(res.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError("Failed to load products. Please try again.");
          console.error("Error fetching products:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Memoized filter options
  const categories = useMemo(() => 
    ["all", ...new Set(products.map(p => p.category).filter(Boolean))],
    [products]
  );

  const subCategories = useMemo(() => 
    ["all", ...new Set(products.map(p => p.subCategory).filter(Boolean))],
    [products]
  );

  // Memoized filtered products (expensive computation)
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.productName?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      );
    }

    if (filters.category !== "all") {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters.subCategory !== "all") {
      result = result.filter(p => p.subCategory === filters.subCategory);
    }

    if (filters.priceRange !== "all") {
      const [min, max] = PRICE_RANGES[filters.priceRange];
      result = result.filter(p => {
        const price = p.price || p.mrp || 0;
        return price >= min && price < max;
      });
    }

    // Sort
    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => (a.price || a.mrp || 0) - (b.price || b.mrp || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.price || b.mrp || 0) - (a.price || a.mrp || 0));
        break;
      case "name":
        result.sort((a, b) => (a.productName || "").localeCompare(b.productName || ""));
        break;
      case "newest":
        result.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      default:
        break;
    }

    return result;
  }, [products, filters, searchQuery]);

  // Handlers
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ category: "all", subCategory: "all", priceRange: "all", sortBy: "featured" });
    setSearchQuery("");
  }, []);

  const handleAddToCart = useCallback((product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.quantity <= 0) return;
    
    addToCart(product);
    
    // Toast notification instead of alert()
    // You can integrate react-hot-toast or similar
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    toast.textContent = `Added ${product.productName} to cart!`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }, [addToCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="relative">
          <div className="animate-spin h-12 w-12 border-4 border-pink-400 border-t-transparent rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Heart className="h-5 w-5 text-pink-400 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Shop All Products
          </h1>
          <p className="text-gray-600">
            Discover premium products for your beloved pets
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products... (Ctrl+K)"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none bg-white shadow-sm transition-colors"
              aria-label="Search products"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-wrap items-start gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-pink-400 transition-colors"
              aria-expanded={showFilters}
              aria-controls="filter-panel"
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters ? <X className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {/* Desktop Filters */}
            <div 
              id="filter-panel"
              className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-wrap gap-4 w-full lg:w-auto`}
            >
              <FilterSelect
                label="Category"
                value={filters.category}
                onChange={(e) => updateFilter("category", e.target.value)}
                options={categories.map(c => ({ 
                  value: c, 
                  label: c === "all" ? "All Categories" : c 
                }))}
              />
              
              <FilterSelect
                label="Type"
                value={filters.subCategory}
                onChange={(e) => updateFilter("subCategory", e.target.value)}
                options={subCategories.map(s => ({ 
                  value: s, 
                  label: s === "all" ? "All Types" : s 
                }))}
              />
              
              <FilterSelect
                label="Price"
                value={filters.priceRange}
                onChange={(e) => updateFilter("priceRange", e.target.value)}
                options={[
                  { value: "all", label: "All Prices" },
                  { value: "0-500", label: "₹0 - ₹500" },
                  { value: "500-1000", label: "₹500 - ₹1000" },
                  { value: "1000-2000", label: "₹1000 - ₹2000" },
                  { value: "2000+", label: "₹2000+" }
                ]}
              />
              
              <FilterSelect
                label="Sort"
                value={filters.sortBy}
                onChange={(e) => updateFilter("sortBy", e.target.value)}
                options={SORT_OPTIONS}
              />
            </div>

            {/* Results Count & Clear */}
            <div className="ml-auto flex items-center gap-4">
              {(filters.category !== "all" || filters.subCategory !== "all" || filters.priceRange !== "all" || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                >
                  Clear all
                </button>
              )}
              <span className="text-sm text-gray-600 font-medium">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-gray-300 mb-4">
              <ShoppingCart className="h-24 w-24 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all active:scale-95"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              const isOutOfStock = product.quantity <= 0;
              const discount = product.mrp && product.price && product.mrp > product.price
                ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                : null;

              return (
                <article
                  key={product.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                  {/* Product Image */}
                  <Link 
                    to={`/product/${product.id}`} 
                    className="relative block overflow-hidden"
                    aria-label={`View ${product.productName}`}
                  >
                    <ProductImage product={product} apiUrl={API} />
                    
                    {/* Discount Badge */}
                    {discount && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                        {discount}% OFF
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all hover:scale-110 ${
                        isWishlisted
                          ? "bg-pink-500 text-white"
                          : "bg-white text-gray-600 hover:bg-pink-50"
                      }`}
                      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart
                        className={`h-5 w-5 ${isWishlisted ? "fill-white" : ""}`}
                      />
                    </button>

                    {/* Stock Status */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    {/* Category */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      {product.subCategory && (
                        <span className="text-xs text-gray-500">• {product.subCategory}</span>
                      )}
                    </div>

                    {/* Product Name */}
                    <Link
                      to={`/product/${product.id}`}
                      className="block font-semibold text-gray-900 hover:text-pink-600 transition-colors mb-2 line-clamp-2"
                    >
                      {product.productName}
                    </Link>

                    {/* Rating */}
                    <div className="mb-3">
                      <StarRating rating={product.rating} count={product.reviewsCount} />
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{product.price || product.mrp || 0}
                      </span>
                      {product.mrp && product.price && product.mrp > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.mrp}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={isOutOfStock}
                      className={`mt-auto w-full py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                        isOutOfStock
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                      }`}
                      aria-label={isOutOfStock ? "Out of stock" : `Add ${product.productName} to cart`}
                    >
                      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ShopPage;
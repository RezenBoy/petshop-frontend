import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, Filter, X, ChevronDown, Search } from "lucide-react";
import axios from "axios";
import Footer from "../components/common/user/Footer";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter states
  const [filters, setFilters] = useState({
    category: "all",
    subCategory: "all",
    priceRange: "all",
    sortBy: "featured"
  });
const API = process.env.REACT_APP_API_URL;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/api/products`);
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== "all") {
      result = result.filter(product => product.category === filters.category);
    }

    // SubCategory filter
    if (filters.subCategory !== "all") {
      result = result.filter(product => product.subCategory === filters.subCategory);
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      const ranges = {
        "0-500": [0, 500],
        "500-1000": [500, 1000],
        "1000-2000": [1000, 2000],
        "2000+": [2000, Infinity]
      };
      const [min, max] = ranges[filters.priceRange];
      result = result.filter(product => product.price >= min && product.price < max);
    }

    // Sort
    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => (a.price || a.mrp) - (b.price || b.mrp));
        break;
      case "price-high":
        result.sort((a, b) => (b.price || b.mrp) - (a.price || a.mrp));
        break;
      case "name":
        result.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, filters, searchQuery]);

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Get unique categories and subcategories
  const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];
  const subCategories = ["all", ...new Set(products.map(p => p.subCategory).filter(Boolean))];

  // Get image URL
  const getImageUrl = (product) => {
    if (product.imageUrls && product.imageUrls.length > 0) {
      const url = product.imageUrls[0];
      return url.startsWith('http') ? url : `${API}${url}`;
    }
    return "https://via.placeholder.com/400x400?text=No+Image";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="relative">
          <div className="animate-spin h-12 w-12 border-4 border-pink-400 border-t-transparent rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Heart className="h-5 w-5 text-pink-400 animate-pulse" />
          </div>
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
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-pink-400 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters ? <X className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {/* Desktop Filters */}
            <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-wrap gap-4 w-full lg:w-auto`}>
              {/* Category */}
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>

              {/* SubCategory */}
              <select
                value={filters.subCategory}
                onChange={(e) => setFilters({ ...filters, subCategory: e.target.value })}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none bg-white"
              >
                {subCategories.map(sub => (
                  <option key={sub} value={sub}>
                    {sub === "all" ? "All Types" : sub}
                  </option>
                ))}
              </select>

              {/* Price Range */}
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none bg-white"
              >
                <option value="all">All Prices</option>
                <option value="0-500">₹0 - ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-2000">₹1000 - ₹2000</option>
                <option value="2000+">₹2000+</option>
              </select>

              {/* Sort By */}
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none bg-white"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="ml-auto text-sm text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
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
              onClick={() => {
                setFilters({ category: "all", subCategory: "all", priceRange: "all", sortBy: "featured" });
                setSearchQuery("");
              }}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Product Image */}
                <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={getImageUrl(product)}
                    alt={product.productName}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                    }}
                  />
                  
                  {/* Discount Badge */}
                  {product.mrp && product.price && product.mrp > product.price && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                      {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all ${
                      wishlist.includes(product.id)
                        ? "bg-pink-500 text-white"
                        : "bg-white text-gray-600 hover:bg-pink-50"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        wishlist.includes(product.id) ? "fill-white" : ""
                      }`}
                    />
                  </button>

                  {/* Stock Status */}
                  {product.quantity <= 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  {/* Category */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                    {product.subCategory && (
                      <span className="text-xs text-gray-500">
                        • {product.subCategory}
                      </span>
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
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (product.rating || 4)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      ({product.reviewsCount || 87})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{product.price || product.mrp}
                    </span>
                    {product.mrp && product.price && product.mrp > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.mrp}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => alert(`Added ${product.productName} to cart!`)}
                    disabled={product.quantity <= 0}
                    className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      product.quantity <= 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ShopPage;
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Check,
  Truck,
  Shield,
  Package,
} from "lucide-react";
import axios from "axios";
import Footer from "../components/common/user/Footer";
import COLORS from "../components/common/color_pallate";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ProductView = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    reviewerName: "",
    comment: "",
    rating: 5,
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // API base URL for images

  const features = [
    { icon: Truck, text: "Free delivery on orders above ₹999" },
    { icon: Shield, text: "100% Authentic products" },
    { icon: Package, text: "Easy 7-day returns" },
  ];

  const handleHelpful = async (reviewId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/products/${id}/reviews/${reviewId}/helpful`
      );
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
        )
      );
    } catch (err) {
      console.error("Error marking helpful:", err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!newReview.reviewerName.trim() || !newReview.comment.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setSubmittingReview(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/products/${id}/reviews`,
        newReview
      );

      // Reset form and fetch updated reviews
      setNewReview({ reviewerName: "", comment: "", rating: 5 });
      setShowReviewForm(false);
      await fetchReviews();
      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };
  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/products/${id}/reviews`
      );
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    // fetchReviews();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Heart className="h-5 w-5 text-accent animate-pulse" />
          </div>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-text bg-background">
        <div className="text-6xl mb-4">🐾</div>
        <p className="text-xl font-semibold">Product not found</p>
        <Link
          to="/shop"
          className="mt-4 text-primary hover:text-primary/80 font-medium"
        >
          Back to Shop
        </Link>
      </div>
    );

  // Product images handling
  const productImages = (() => {
    console.log("Product data:", product);

    // Check for imageUrls (your actual API response)
    if (
      product.imageUrls &&
      Array.isArray(product.imageUrls) &&
      product.imageUrls.length > 0
    ) {
      const processedImages = product.imageUrls
        .map((imageUrl, index) => {
          console.log(`Processing image ${index}:`, imageUrl);

          // Skip if no valid URL
          if (!imageUrl) {
            console.log(`Image ${index} has no URL`);
            return null;
          }

          // Build full URL - ensure no double slashes
          let fullUrl;
          if (imageUrl.startsWith("http")) {
            fullUrl = imageUrl;
          } else {
            // Remove leading slash if present to avoid double slashes
            const cleanPath = imageUrl.startsWith("/")
              ? imageUrl
              : `/${imageUrl}`;
            fullUrl = `${API_BASE_URL}${cleanPath}`;
          }

          console.log(`Final URL for image ${index}:`, fullUrl);
          return fullUrl;
        })
        .filter(Boolean); // Remove any null values

      console.log("All processed images:", processedImages);
      return processedImages.length > 0 ? processedImages : [];
    }

    // Fallback to productImages if it exists (old structure)
    if (
      product.productImages &&
      Array.isArray(product.productImages) &&
      product.productImages.length > 0
    ) {
      return product.productImages
        .map((imgObj) => {
          const imageUrl = imgObj?.imageUrl || imgObj;
          if (!imageUrl) return null;
          const cleanPath = imageUrl.startsWith("/")
            ? imageUrl
            : `/${imageUrl}`;
          return imageUrl.startsWith("http")
            ? imageUrl
            : `${API_BASE_URL}${cleanPath}`;
        })
        .filter(Boolean);
    }

    // Fallback to single imageUrl if it exists
    if (product.imageUrl) {
      const cleanPath = product.imageUrl.startsWith("/")
        ? product.imageUrl
        : `/${product.imageUrl}`;
      const singleImage = product.imageUrl.startsWith("http")
        ? product.imageUrl
        : `${API_BASE_URL}${cleanPath}`;
      console.log("Using single image:", singleImage);
      return [singleImage];
    }

    // No images available
    console.log("No product images found");
    return [];
  })();

  console.log("Final productImages array:", productImages);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Product Section */}
        <div className="bg-surface border border-border rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-8">
            {/* Left: Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-secondary/15 rounded-xl overflow-hidden aspect-square">
                {productImages.length > 0 ? (
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    crossOrigin="anonymous"
                    onLoad={(e) => {
                      console.log(
                        "✅ Image loaded successfully:",
                        e.target.src
                      );
                    }}
                    onError={(e) => {
                      console.error("❌ Image load failed:", e.target.src);
                      console.error("Error details:", e);
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src =
                        "https://via.placeholder.com/600x600?text=Image+Not+Available";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/15">
                    <div className="text-center text-textMuted/60">
                      <svg
                        className="mx-auto h-24 w-24 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm font-medium">No image available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex flex-wrap gap-3">
                  {productImages.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? "border-primary shadow-md scale-105"
                          : "border-border hover:border-textMuted"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error("Thumbnail load failed:", e.target.src);
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/150x150?text=No+Image";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
                            {/* Features */}
              <div className="bg-secondary/15 rounded-xl p-5 border border-border">
                <h4 className="text-sm font-semibold text-text mb-4 uppercase tracking-wide">
                  Why Choose Us
                </h4>
                <div className="space-y-3">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-surface shadow-sm flex items-center justify-center">
                        <feature.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-text font-medium">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col space-y-5">
              {/* Category Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-secondary/30 rounded-full">
                  {product.category || "Pet Accessories"}
                </span>
                {product.subCategory && (
                  <span className="text-textMuted">›</span>
                )}
                {product.subCategory && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-text bg-accent/25 rounded-full">
                    {product.subCategory}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-text leading-tight">
                {product.productName || product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-accent text-lg">
                      {i < (product.rating || 4) ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <span className="text-textMuted text-sm font-medium">
                  {product.rating || 4.0} ({reviews.length} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-border">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl font-bold text-text">
                    ₹{product.price || product.mrp || 999}
                  </span>
                  {product.mrp &&
                    product.price &&
                    product.mrp > product.price && (
                      <>
                        <span className="text-xl text-textMuted/60 line-through">
                          ₹{product.mrp}
                        </span>
                        <span className="text-sm font-semibold text-text bg-accent/25 px-2.5 py-1 rounded-lg">
                          {Math.round(
                            ((product.mrp - product.price) / product.mrp) * 100
                          )}
                          % OFF
                        </span>
                      </>
                    )}
                </div>
                <p className="text-sm text-textMuted mt-2">
                  Inclusive of all taxes
                </p>
                {product.mrp &&
                  product.price &&
                  product.mrp > product.price && (
                    <p className="text-sm text-accent mt-1 font-medium">
                      You save ₹{(product.mrp - product.price).toFixed(2)}!
                    </p>
                  )}
              </div>

              {/* Stock Status */}
              <div>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm ${
                    product.quantity > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.quantity > 0 ? (
                    <>
                      <Check className="h-4 w-4" />
                      In Stock ({product.quantity} available)
                    </>
                  ) : (
                    "Out of Stock"
                  )}
                </div>
              </div>

              {/* Short Description Preview */}
              {product.description && (
                <div className="mt-2 mb-6">
                  <h3 className="text-sm font-semibold text-text mb-1 uppercase tracking-wide">
                    About This Product
                  </h3>
                  <p
                    className="text-textMuted text-sm leading-relaxed line-clamp-3"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 10,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {product.description}
                  </p>
                  <button
                    onClick={() => {
                      const descriptionTab = document.getElementById(
                        "product-description-tab"
                      );
                      if (descriptionTab) {
                        descriptionTab.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                        setActiveTab("description");
                      }
                    }}
                    className="mt-1 text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    View More ↓
                  </button>
                </div>
              )}

              {/* Size and Color Selection */}
              {((product.sizes && product.sizes.length > 0) ||
                (product.colors && product.colors.length > 0)) && (
                <div className="mb-6 pb-6 border-b border-border">
                  {/* Sizes */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-text mb-2">
                        Size
                      </label>
                      <div className="flex gap-2">
                        {product.sizes.map((size, idx) => (
                          <button
                            key={idx}
                            className="px-4 py-2 border-2 border-primary text-primary bg-secondary/20 rounded-lg text-sm font-semibold hover:bg-secondary/40 transition-colors"
                          >
                            {size.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Colors */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-text mb-2">
                        Color
                      </label>
                      <div className="flex gap-2">
                        {product.colors.map((color, idx) => {
                          const colorName = color.split("(")[0].trim();
                          const hexMatch = color.match(/#[0-9A-Fa-f]{6}/);
                          const hexColor = hexMatch ? hexMatch[0] : COLORS.text;

                          return (
                            <button
                              key={idx}
                              className="relative group"
                              title={colorName}
                            >
                              <div
                                className="w-10 h-10 rounded-full border-2 border-primary shadow-md hover:scale-110 transition-transform"
                                style={{ backgroundColor: hexColor }}
                              ></div>
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-textMuted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {colorName}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-border hover:border-primary hover:bg-secondary/20 transition-colors text-text font-semibold disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-16 h-10 flex items-center justify-center font-semibold text-lg border-2 border-border rounded-lg bg-surface text-text">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.quantity, quantity + 1))
                    }
                    className="w-10 h-10 rounded-lg border-2 border-border hover:border-primary hover:bg-secondary/20 transition-colors text-text font-semibold disabled:opacity-50"
                    disabled={quantity >= product.quantity}
                  >
                    +
                  </button>
                  <span className="text-sm text-textMuted ml-2">
                    Max: {product.quantity}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Buy Now Button */}
                <button
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-surface px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  onClick={() =>
                    alert(`Proceeding to buy ${quantity} item(s)!`)
                  }
                  disabled={product.quantity <= 0}
                >
                  Buy Now
                </button>

                {/* Add to Cart Button */}
                <button
                  className={`px-6 py-4 rounded-xl border-2 shadow-md transition-all font-semibold flex items-center justify-center gap-2 ${
                    wishlist
                      ? "bg-accent/20 text-text border-accent shadow-sm"
                      : "border-border text-text hover:bg-secondary/20 hover:border-primary"
                  }`}
                  onClick={() => {
                    const cartStr = localStorage.getItem("cartItems");
                    let cart = cartStr ? JSON.parse(cartStr) : [];
                    const existingItem = cart.find(item => item.productId === product.id);
                    
                    if (existingItem) {
                      existingItem.quantity += quantity;
                    } else {
                      cart.push({
                        id: Date.now(),
                        productId: product.id,
                        name: product.productName || product.name,
                        price: product.price || product.mrp,
                        image: productImages.length > 0 ? productImages[0] : "",
                        quantity: quantity
                      });
                    }
                    
                    localStorage.setItem("cartItems", JSON.stringify(cart));
                    window.dispatchEvent(new Event("cartUpdated"));
                    alert(`${product.productName || product.name} added to cart!`);
                  }}
                  disabled={product.quantity <= 0}
                >
                  <ShoppingCart
                    className={`h-5 w-5 ${
                      wishlist ? "text-accent fill-accent" : "text-text"
                    }`}
                  />
                  Add to Cart
                </button>
              </div>


            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-border">
            <div className="flex">
              <button
                onClick={() => setActiveTab("description")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === "description"
                    ? "text-primary border-b-2 border-primary font-semibold"
                    : "text-textMuted hover:text-text font-medium"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === "details"
                    ? "text-primary border-b-2 border-primary font-semibold"
                    : "text-textMuted hover:text-text font-medium"
                }`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === "reviews"
                    ? "text-primary border-b-2 border-primary font-semibold"
                    : "text-textMuted hover:text-text font-medium"
                }`}
              >
                Reviews ({reviews.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            {activeTab === "description" && (
              <div
                id="product-description-tab"
                className="prose max-w-none scroll-mt-24"
              >
                <div className="text-textMuted leading-relaxed text-sm whitespace-pre-line">
                  {product.description ||
                    "This premium pet product is designed with your furry friend's comfort and happiness in mind. Made from high-quality materials, it ensures durability and safety. Perfect for daily use and guaranteed to bring joy to your beloved pet!"}
                </div>

                <h4 className="text-lg font-semibold text-text mt-6 mb-3">
                  Key Features:
                </h4>
                <ul className="space-y-2 text-textMuted">
                  <li>• Premium quality materials for maximum durability</li>
                  <li>• Comfortable and safe for daily use</li>
                  <li>• Easy to clean and maintain</li>
                  <li>• Perfect size for all pet breeds</li>
                  <li>• Designed by pet care experts</li>
                </ul>
              </div>
            )}

            {activeTab === "details" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-text mb-4">
                    Specifications
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-textMuted">Brand</span>
                      <span className="font-medium text-text">
                        {product.brand || "Premium Pet"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-textMuted">Sub Category</span>
                      <span className="font-medium text-text">
                        {product.subCategory || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-textMuted">Available Sizes</span>
                      <span className="font-medium text-text">
                        {product.sizes && product.sizes.length > 0
                          ? product.sizes.join(", ").toUpperCase()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-textMuted">Available Colors</span>
                      <span className="font-medium text-text">
                        {product.colors && product.colors.length > 0
                          ? product.colors
                              .map((c) => c.split("(")[0].trim())
                              .join(", ")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-textMuted">Stock Quantity</span>
                      <span className="font-medium text-text">
                        {product.quantity || 0} units
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-textMuted">Category</span>
                      <span className="font-medium text-text">
                        {product.category || "Pet Accessories"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-text mb-4">
                    Shipping & Returns
                  </h4>
                  <div className="space-y-3 text-sm text-textMuted">
                    <div className="flex items-start gap-2">
                      <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-text">
                          Free Shipping
                        </p>
                        <p className="text-textMuted">
                          On orders above ₹999. Standard delivery in 3-5 days.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-text">
                          Easy Returns
                        </p>
                        <p className="text-textMuted">
                          7-day return policy. 100% refund guarantee.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-text">
                          Authentic Products
                        </p>
                        <p className="text-textMuted">
                          100% genuine products with quality assurance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {/* Reviews Summary */}
                <div className="mb-8 pb-8 border-b border-border">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="text-center md:text-left">
                      <div className="text-5xl font-bold text-text mb-2">
                        {product.rating || 4.5}
                      </div>
                      <div className="flex items-center justify-center md:justify-start mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-accent text-xl">
                            {i < Math.floor(product.rating || 4) ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-textMuted">
                        Based on {reviews.length} reviews
                      </p>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div
                          key={star}
                          className="flex items-center gap-3 mb-2"
                        >
                          <span className="text-sm text-textMuted w-8">
                            {star}★
                          </span>
                          <div className="flex-1 bg-secondary/40 rounded-full h-2">
                            <div
                              className="bg-accent h-2 rounded-full"
                              style={{
                                width: `${
                                  star === 5
                                    ? 70
                                    : star === 4
                                    ? 20
                                    : star === 3
                                    ? 7
                                    : star === 2
                                    ? 2
                                    : 1
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-textMuted w-12">
                            {star === 5
                              ? 70
                              : star === 4
                              ? 20
                              : star === 3
                              ? 7
                              : star === 2
                              ? 2
                              : 1}
                            %
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="pb-6 border-b border-border/50 last:border-0"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-surface font-semibold">
                              {review.reviewerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-text">
                                  {review.reviewerName}
                                </h4>
                                {review.verifiedPurchase && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                    <Check className="h-3 w-3" />
                                    Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-textMuted/70">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-accent text-sm">
                                {i < review.rating ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-textMuted mb-3 leading-relaxed">
                          {review.comment}
                        </p>
                        <button
                          onClick={() => handleHelpful(review.id)}
                          className="text-sm text-textMuted hover:text-primary transition-colors"
                        >
                          Helpful ({review.helpfulCount})
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-textMuted text-sm italic">
                      No reviews yet. Be the first to review this product!
                    </p>
                  )}
                </div>

                {/* Write Review Section */}
                <div className="mt-8">
                  {!showReviewForm ? (
                    <div className="text-center">
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-surface rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        Write a Review
                      </button>
                    </div>
                  ) : (
                    <div className="bg-secondary/15 rounded-xl p-6 border border-border">
                      <h3 className="text-lg font-semibold text-text mb-4">
                        Write Your Review
                      </h3>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        {/* Name Input */}
                        <div>
                          <label className="block text-sm font-medium text-text mb-2">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            value={newReview.reviewerName}
                            onChange={(e) =>
                              setNewReview({
                                ...newReview,
                                reviewerName: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-border bg-surface text-text rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter your name"
                            required
                          />
                        </div>

                        {/* Rating Input */}
                        <div>
                          <label className="block text-sm font-medium text-text mb-2">
                            Rating *
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() =>
                                  setNewReview({ ...newReview, rating: star })
                                }
                                className="text-3xl focus:outline-none transition-transform hover:scale-110"
                              >
                                <span
                                  className={
                                    star <= newReview.rating
                                      ? "text-accent"
                                      : "text-secondary"
                                  }
                                >
                                  ★
                                </span>
                              </button>
                            ))}
                            <span className="ml-2 text-sm text-textMuted self-center">
                              ({newReview.rating} star
                              {newReview.rating !== 1 ? "s" : ""})
                            </span>
                          </div>
                        </div>

                        {/* Comment Input */}
                        <div>
                          <label className="block text-sm font-medium text-text mb-2">
                            Your Review *
                          </label>
                          <textarea
                            value={newReview.comment}
                            onChange={(e) =>
                              setNewReview({
                                ...newReview,
                                comment: e.target.value,
                              })
                            }
                            rows="4"
                            className="w-full px-4 py-2 border border-border bg-surface text-text rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            placeholder="Share your experience with this product..."
                            required
                          ></textarea>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={submittingReview}
                            className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-surface rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submittingReview
                              ? "Submitting..."
                              : "Submit Review"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowReviewForm(false);
                              setNewReview({
                                reviewerName: "",
                                comment: "",
                                rating: 5,
                              });
                            }}
                            disabled={submittingReview}
                            className="px-6 py-3 border-2 border-border text-text rounded-xl font-semibold hover:bg-secondary/20 transition-all disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductView;

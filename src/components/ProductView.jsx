import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  Package,
  Star,
  ChevronLeft,
} from "lucide-react";
import Navbar from "./common/user/NavBar";
import Footer from "./common/user/Footer";
import productImg from "../assets/categories/dog_food.jpg";

// Hardcoded products data (same IDs as FeaturedProducts)
const productsData = {
  1: {
    name: "Steel Dog Bowl",
    category: "Bowls",
    description:
      "Premium stainless steel dog bowl, rust-resistant and easy to clean. Perfect for food and water. Non-slip rubber base keeps the bowl in place.",
    material: "Stainless Steel",
    variants: ["200ml", "400ml", "600ml", "800ml", "1000ml"],
    prices: { "200ml": 199, "400ml": 299, "600ml": 399, "800ml": 499, "1000ml": 599 },
    rating: 4.5,
    reviewCount: 128,
    image: productImg,
  },
  2: {
    name: "Printed Dog Bowl",
    category: "Bowls",
    description:
      "Beautiful printed melamine bowl with fun pet designs. Lightweight, durable, and dishwasher safe. Available in multiple sizes and patterns.",
    material: "Melamine",
    variants: ["200ml", "400ml", "600ml", "800ml", "1000ml", "1200ml", "1500ml"],
    prices: { "200ml": 149, "400ml": 249, "600ml": 349, "800ml": 449, "1000ml": 549, "1200ml": 649, "1500ml": 749 },
    rating: 4.3,
    reviewCount: 95,
    image: productImg,
  },
  3: {
    name: "Dog Cage (Iron)",
    category: "Cages",
    description:
      "Foldable iron cage, easy to lift, strong and durable. Powder-coated finish prevents rust. Includes removable tray for easy cleaning.",
    material: "Powder-coated Iron",
    variants: ['18"', '24"', '30"', '36"', '42"'],
    prices: { '18"': 1499, '24"': 1999, '30"': 2499, '36"': 2999, '42"': 3499 },
    rating: 4.7,
    reviewCount: 203,
    image: productImg,
  },
  4: {
    name: "Pipe Dog Cage",
    category: "Cages",
    description:
      "Heavy-duty pipe cage for large breeds. Sturdy construction with secure locking mechanism. Easy assembly, no tools required.",
    material: "MS Pipe",
    variants: ['Base Pipe 49"', 'Full Pipe 36"', 'Full Pipe 49"'],
    prices: { 'Base Pipe 49"': 3999, 'Full Pipe 36"': 4999, 'Full Pipe 49"': 5999 },
    rating: 4.6,
    reviewCount: 87,
    image: productImg,
  },
  5: {
    name: "Premium Dog Food",
    category: "Dog Food",
    description:
      "Nutritionally balanced premium dog food made with real chicken and wholesome grains. Supports healthy digestion, shiny coat, and strong bones.",
    material: "Chicken & Rice Formula",
    variants: ["1kg", "5kg", "10kg", "15kg"],
    prices: { "1kg": 399, "5kg": 1499, "10kg": 2599, "15kg": 3499 },
    rating: 4.8,
    reviewCount: 342,
    image: productImg,
  },
  6: {
    name: "Cat Grooming Kit",
    category: "Grooming",
    description:
      "Complete grooming kit for cats including brush, nail clipper, comb, and shampoo. Gentle on skin, perfect for regular grooming sessions.",
    material: "Stainless Steel & Plastic",
    variants: ["Basic", "Standard", "Premium"],
    prices: { Basic: 499, Standard: 799, Premium: 1299 },
    rating: 4.4,
    reviewCount: 156,
    image: productImg,
  },
  7: {
    name: "Pet Chew Bone",
    category: "Pet Toys",
    description:
      "Durable rubber chew bone that cleans teeth while your pet plays. Non-toxic material, safe for aggressive chewers. Helps reduce anxiety and boredom.",
    material: "Natural Rubber",
    variants: ["Small", "Medium", "Large"],
    prices: { Small: 149, Medium: 249, Large: 349 },
    rating: 4.2,
    reviewCount: 89,
    image: productImg,
  },
  8: {
    name: "Adjustable Collar",
    category: "Accessories",
    description:
      "Comfortable adjustable collar with quick-release buckle. Reflective stitching for nighttime safety. Soft padded interior prevents irritation.",
    material: "Nylon & Neoprene",
    variants: ["S", "M", "L", "XL"],
    prices: { S: 199, M: 249, L: 299, XL: 349 },
    rating: 4.5,
    reviewCount: 214,
    image: productImg,
  },
};

const ProductView = () => {
  const { id } = useParams();
  const product = productsData[id];

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-700 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-6xl mb-4">🐾</div>
        <p className="text-xl font-semibold">Product not found</p>
        <Link
          to="/"
          className="mt-4 text-pink-600 hover:text-pink-700 font-medium"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const currentVariant = selectedVariant || product.variants[0];
  const currentPrice = product.prices[currentVariant];

  const features = [
    { icon: Truck, text: "Free delivery on orders above ₹999" },
    { icon: Shield, text: "100% Authentic products" },
    { icon: Package, text: "Easy 7-day returns" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-pink-500 transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Link>

        {/* Product Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Product Image */}
            <div className="bg-gray-50 p-8 lg:p-12 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-[450px] object-contain"
              />
            </div>

            {/* Right: Product Details */}
            <div className="p-6 lg:p-10 flex flex-col">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-100">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Material */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                <span className="text-sm text-gray-500">Material</span>
                <span className="text-sm font-semibold text-gray-800">
                  {product.material}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Variants */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Variants
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                        currentVariant === variant
                          ? "border-pink-500 bg-pink-50 text-pink-600"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{currentPrice}
                  </span>
                  <span className="text-sm text-gray-500">
                    Inclusive of all taxes
                  </span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition-colors font-semibold"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-14 h-10 flex items-center justify-center font-semibold text-lg border-2 border-gray-200 rounded-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition-colors font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold"
                  onClick={() =>
                    alert(`Proceeding to buy ${quantity} x ${currentVariant}!`)
                  }
                >
                  Buy Now
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-6 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold"
                  onClick={() =>
                    alert(`${product.name} (${currentVariant}) added to cart!`)
                  }
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
                <button
                  onClick={() => setWishlist(!wishlist)}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all ${
                    wishlist
                      ? "border-pink-400 bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      wishlist
                        ? "text-pink-500 fill-pink-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>

              {/* Features */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <feature.icon className="h-4 w-4 text-pink-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductView;

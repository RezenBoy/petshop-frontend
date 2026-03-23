import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Heart } from "lucide-react";
import Footer from "../../components/common/user/Footer";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // ✅ Load cart from localStorage (or API later)
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
      setLoading(false);
    } else {
      // Temporary mocked cart (replace with API call later)
      setTimeout(() => {
        const mockData = [
          {
            id: 1,
            productId: 3,
            name: "Premium Dog Toy",
            image: "https://via.placeholder.com/150x150?text=Dog+Toy",
            price: 99,
            mrp: 120,
            quantity: 2,
            size: "M",
            color: "Red",
            inStock: true,
            maxStock: 10,
          },
          {
            id: 2,
            productId: 5,
            name: "Cat Food Bowl",
            image: "https://via.placeholder.com/150x150?text=Cat+Bowl",
            price: 299,
            mrp: 399,
            quantity: 1,
            size: "L",
            color: "Blue",
            inStock: true,
            maxStock: 5,
          },
        ];
        setCartItems(mockData);
        localStorage.setItem("cartItems", JSON.stringify(mockData));
        setLoading(false);
      }, 400);
    }
  }, []);

  // ✅ Persist cart in localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // ✅ Totals & Discounts
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalMRP = cartItems.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const productDiscount = totalMRP - subtotal;
  const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const deliveryCharge = subtotal >= 999 ? 0 : 50;
  const total = subtotal - couponDiscount + deliveryCharge;

  // ✅ Quantity Management
  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(Math.max(1, item.quantity + delta), item.maxStock),
            }
          : item
      )
    );
  };

  // ✅ Remove item
  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  // ✅ Coupon logic
  const applyCoupon = () => {
    const validCoupons = {
      SAVE10: 10,
      SAVE20: 20,
      PETLOVER: 15,
    };
    const discount = validCoupons[couponCode];
    if (discount) {
      setAppliedCoupon({ code: couponCode, discount });
    } else {
      alert("Invalid coupon code!");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  // ✅ Loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="animate-spin h-12 w-12 border-4 border-pink-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // ✅ Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven’t added any items to your cart yet.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Continue Shopping
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ✅ Main Cart UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= CART ITEMS ================= */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-4">
                  <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg border-2 border-gray-100"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-lg font-semibold text-gray-900 hover:text-pink-600 transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>• Color: {item.color}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
                        {item.mrp > item.price && (
                          <span className="text-sm text-gray-400 line-through">₹{item.mrp}</span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-pink-500 hover:bg-pink-50 transition disabled:opacity-50 flex items-center justify-center"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-pink-500 hover:bg-pink-50 transition disabled:opacity-50 flex items-center justify-center"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {item.quantity >= item.maxStock && (
                      <p className="text-xs text-amber-600 mt-2">
                        Maximum stock limit reached
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Save for later section */}
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6 border border-pink-200">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-pink-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Save for later?</h3>
                  <p className="text-sm text-gray-600">
                    Move items to your wishlist to purchase later.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= ORDER SUMMARY ================= */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Coupon Section */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Have a coupon code?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="SAVE10"
                      disabled={appliedCoupon}
                      className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none text-sm disabled:bg-gray-100"
                    />
                  </div>
                  {appliedCoupon ? (
                    <button
                      onClick={removeCoupon}
                      className="px-4 py-2.5 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition text-sm"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={applyCoupon}
                      disabled={!couponCode}
                      className="px-4 py-2.5 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition disabled:bg-gray-300 text-sm"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-green-600 mt-2 font-medium">
                    ✓ Coupon "{appliedCoupon.code}" applied! {appliedCoupon.discount}% off
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                {productDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product Discount</span>
                    <span className="font-semibold text-green-600">-₹{productDiscount.toFixed(2)}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Coupon Discount ({appliedCoupon.discount}%)
                    </span>
                    <span className="font-semibold text-green-600">
                      -₹{couponDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charges</span>
                  {deliveryCharge === 0 ? (
                    <span className="font-semibold text-green-600">FREE</span>
                  ) : (
                    <span className="font-semibold text-gray-900">₹{deliveryCharge}</span>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 py-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg px-4">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-pink-600">₹{total.toFixed(2)}</span>
              </div>

              {/* Savings Message */}
              {(productDiscount + couponDiscount) > 0 && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-sm font-semibold text-green-700">
                    You're saving ₹{(productDiscount + couponDiscount).toFixed(2)} on this order! 🎉
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <button className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </button>

              {/* Continue Shopping */}
              <Link
                to="/shop"
                className="block w-full py-3 mt-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-base text-center hover:bg-gray-50 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;

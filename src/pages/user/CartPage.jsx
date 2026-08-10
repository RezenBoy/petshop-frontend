import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, 
  Heart, X, Loader2, MapPin, Phone, Mail, AlertCircle 
} from "lucide-react";
import Footer from "../../components/common/user/Footer";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// ─── Constants ─────────────────────────────────────────────
const COUPONS = {
  SAVE10: { discount: 10, minOrder: 500, label: "10% off (min ₹500)" },
  SAVE20: { discount: 20, minOrder: 1500, label: "20% off (min ₹1500)" },
  PETLOVER: { discount: 15, minOrder: 0, label: "15% off" },
  FIRST50: { discount: 50, minOrder: 2000, label: "50% off first order (min ₹2000)" }
};

const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_CHARGE = 50;

// ─── Validation Utilities ──────────────────────────────────
const validators = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  mobile: (v) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, "")),
  pincode: (v) => /^\d{6}$/.test(v),
  required: (v) => v.trim().length > 0
};

// ─── Custom Hook: Cart Persistence ─────────────────────────
const useCart = () => {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      setItems(saved ? JSON.parse(saved) : []);
    } catch {
      setItems([]);
    }
    setLoaded(true);
  }, []);

  // Single source of truth for persistence
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("cartItems", JSON.stringify(items));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, [items, loaded]);

  const updateItem = useCallback((id, updater) => {
    setItems(prev => prev.map(item => item.id === id ? updater(item) : item));
  }, []);

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return { items, setItems, updateItem, removeItem, clearCart, loaded };
};

// ─── Custom Hook: User Profile ─────────────────────────────
const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios.get(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      if (res.data?.address) {
        setProfile({
          email: res.data.address.email || res.data.email || "",
          mobileNo: res.data.address.mobileNo || res.data.mobileNo || "",
          city: res.data.address.city || "",
          landMark: res.data.address.landMark || "",
          pincode: res.data.address.pincode || ""
        });
      }
    })
    .catch(err => console.error("Profile fetch failed:", err))
    .finally(() => setLoading(false));
  }, []);

  return { profile, loading };
};

// ─── Custom Hook: Focus Trap ───────────────────────────────
const useFocusTrap = (active, containerRef) => {
  useEffect(() => {
    if (!active || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusable = container.querySelectorAll(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    first?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, containerRef]);
};

// ─── Sub-Components ──────────────────────────────────────

const QuantityControl = ({ quantity, maxStock, onIncrease, onDecrease, disabled }) => (
  <div className="flex items-center gap-2">
    <button
      onClick={onDecrease}
      disabled={disabled || quantity <= 1}
      className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-primary-light hover:bg-secondary-light transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
      aria-label="Decrease quantity"
    >
      <Minus className="h-4 w-4" />
    </button>
    <span className="w-12 text-center font-semibold tabular-nums" aria-live="polite">
      {quantity}
    </span>
    <button
      onClick={onIncrease}
      disabled={disabled || quantity >= (maxStock || 99)}
      className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-primary-light hover:bg-secondary-light transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
      aria-label="Increase quantity"
    >
      <Plus className="h-4 w-4" />
    </button>
  </div>
);

const PriceDisplay = ({ price, mrp }) => (
  <div className="flex items-baseline gap-2">
    <span className="text-xl font-bold text-gray-900">₹{price}</span>
    {mrp > price && (
      <>
        <span className="text-sm text-gray-400 line-through">₹{mrp}</span>
        <span className="text-xs font-medium text-green-600">
          {Math.round(((mrp - price) / mrp) * 100)}% off
        </span>
      </>
    )}
  </div>
);

const FormInput = ({ 
  icon: Icon, 
  label, 
  error, 
  required, 
  className = "", 
  ...props 
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      )}
      <input
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition ${
          error 
            ? "border-red-300 bg-red-50 focus:ring-red-400" 
            : "border-gray-300 bg-white"
        } ${Icon ? "pl-10" : ""}`}
        {...props}
      />
    </div>
    {error && (
      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" /> {error}
      </p>
    )}
  </div>
);

const SavingsBanner = ({ amount }) => (
  <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
    <p className="text-sm font-semibold text-green-700 text-center flex items-center justify-center gap-2">
      <Tag className="h-4 w-4" />
      You're saving ₹{amount.toFixed(2)} on this order!
    </p>
  </div>
);

// ─── Main Component ──────────────────────────────────────
const CartPage = () => {
  const navigate = useNavigate();
  const { items: cartItems, updateItem, removeItem, clearCart, loaded } = useCart();
  const { profile } = useUserProfile();
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  
  const [address, setAddress] = useState({
    email: "", mobileNo: "", city: "", landMark: "", pincode: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const modalRef = useRef(null);
  useFocusTrap(showCheckout, modalRef);

  // Prefill address from profile
  useEffect(() => {
    if (profile) {
      setAddress(prev => ({ ...prev, ...profile }));
    }
  }, [profile]);

  // ─── Computed Values ─────────────────────────────────────
  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const totalMRP = cartItems.reduce((sum, item) => sum + (item.mrp || item.price || 0) * item.quantity, 0);
    const productDiscount = totalMRP - subtotal;
    
    let couponDiscount = 0;
    if (appliedCoupon) {
      couponDiscount = (subtotal * appliedCoupon.discount) / 100;
    }
    
    const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
    const total = Math.max(0, subtotal - couponDiscount + deliveryCharge);
    const totalSavings = productDiscount + couponDiscount;

    return {
      subtotal, totalMRP, productDiscount, 
      couponDiscount, deliveryCharge, total, totalSavings
    };
  }, [cartItems, appliedCoupon]);

  // ─── Handlers ────────────────────────────────────────────
  const updateQuantity = useCallback((id, delta) => {
    setProcessingId(id);
    updateItem(id, item => {
      const max = item.maxStock || 99;
      const nextQty = Math.min(Math.max(1, item.quantity + delta), max);
      return { ...item, quantity: nextQty };
    });
    setTimeout(() => setProcessingId(null), 200);
  }, [updateItem]);

  const handleRemove = useCallback((id) => {
    if (window.confirm("Remove this item from your cart?")) {
      removeItem(id);
    }
  }, [removeItem]);

  const validateCoupon = useCallback(() => {
    const code = couponCode.trim().toUpperCase();
    const coupon = COUPONS[code];
    
    if (!coupon) {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
      return;
    }
    
    if (totals.subtotal < coupon.minOrder) {
      setCouponError(`Minimum order ₹${coupon.minOrder} required`);
      setAppliedCoupon(null);
      return;
    }
    
    setAppliedCoupon({ code, ...coupon });
    setCouponError("");
  }, [couponCode, totals.subtotal]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  }, []);

  const validateField = useCallback((name, value) => {
    switch (name) {
      case "email": return !validators.email(value) ? "Enter a valid email" : "";
      case "mobileNo": return !validators.mobile(value) ? "Enter valid 10-digit mobile" : "";
      case "pincode": return !validators.pincode(value) ? "Enter valid 6-digit pincode" : "";
      case "city": case "landMark": return !validators.required(value) ? "This field is required" : "";
      default: return "";
    }
  }, []);

  const handleAddressChange = useCallback((field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({ ...prev, [field]: validateField(field, address[field]) }));
  }, [address, validateField]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(address).forEach(key => {
      newErrors[key] = validateField(key, address[key]);
    });
    setErrors(newErrors);
    setTouched(Object.keys(address).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
    return !Object.values(newErrors).some(Boolean);
  }, [address, validateField]);

  const handleCheckout = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setCheckoutLoading(true);
    try {
      const payload = {
        shippingAddress: address,
        paymentMode: "CASH",
        cartItems: cartItems.map(({ productId, quantity }) => ({ productId, quantity }))
      };

      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      await axios.post(`${API_URL}/api/user/orders/checkout`, payload, config);
      
      clearCart();
      setShowCheckout(false);
      navigate("/user/orders", { state: { orderSuccess: true } });
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || "Failed to place order. Please try again.";
      setErrors(prev => ({ ...prev, submit: message }));
    } finally {
      setCheckoutLoading(false);
    }
  }, [address, cartItems, validateForm, clearCart, navigate]);

  // ─── Loading State ───────────────────────────────────────
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-light via-primary to-secondary-soft">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // ─── Empty Cart ──────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-light via-primary to-secondary-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-lg mx-auto">
            <div className="w-24 h-24 bg-secondary-light rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-8">
              Discover amazing products for your furry friends!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              Start Shopping
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── Main UI ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-light via-primary to-secondary-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const isProcessing = processingId === item.id;
              const maxStock = item.maxStock || 99;
              const atMax = item.quantity >= maxStock;
              
              return (
                <article
                  key={item.id}
                  className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    <Link 
                      to={`/product/${item.productId}`} 
                      className="flex-shrink-0"
                      aria-label={`View ${item.name}`}
                    >
                      <img
                        src={item.image || "/placeholder-product.jpg"}
                        alt={item.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-100"
                        loading="lazy"
                        onError={(e) => { e.target.src = "/placeholder-product.jpg"; }}
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <Link
                            to={`/product/${item.productId}`}
                            className="text-base font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          {(item.size || item.color) && (
                            <p className="text-sm text-gray-500 mt-1">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && " • "}
                              {item.color && `Color: ${item.color}`}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50 flex-shrink-0"
                          aria-label={`Remove ${item.name} from cart`}
                          title="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-3">
                        <PriceDisplay price={item.price || 0} mrp={item.mrp} />
                        
                        <QuantityControl
                          quantity={item.quantity}
                          maxStock={maxStock}
                          onIncrease={() => updateQuantity(item.id, 1)}
                          onDecrease={() => updateQuantity(item.id, -1)}
                          disabled={isProcessing}
                        />
                      </div>

                      {atMax && (
                        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Maximum stock limit reached
                        </p>
                      )}
                      
                      <p className="text-sm font-medium text-gray-900 mt-2 text-right sm:text-left">
                        Item total: ₹{((item.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Wishlist CTA */}
            <div className="bg-gradient-to-r from-secondary-light to-primary-light rounded-xl p-6 border border-primary-light">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Save for later?</h3>
                  <p className="text-sm text-gray-600">
                    Move items to your wishlist to purchase later.
                  </p>
                </div>
                <Link
                  to="/wishlist"
                  className="ml-auto text-sm font-medium text-primary hover:text-primary whitespace-nowrap"
                >
                  View Wishlist →
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Have a coupon?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      placeholder="SAVE10"
                      disabled={appliedCoupon}
                      className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none text-sm disabled:bg-gray-100 uppercase"
                    />
                  </div>
                  {appliedCoupon ? (
                    <button
                      onClick={removeCoupon}
                      className="px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition text-sm whitespace-nowrap"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={validateCoupon}
                      disabled={!couponCode.trim()}
                      className="px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition disabled:bg-gray-300 text-sm whitespace-nowrap"
                    >
                      Apply
                    </button>
                  )}
                </div>
                
                {couponError && (
                  <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {couponError}
                  </p>
                )}
                
                {appliedCoupon && (
                  <p className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    "{appliedCoupon.code}" applied — {appliedCoupon.discount}% off
                  </p>
                )}
                
                {!appliedCoupon && !couponError && (
                  <p className="mt-2 text-xs text-gray-400">
                    Try: {Object.keys(COUPONS).slice(0, 2).join(", ")}
                  </p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-gray-900">₹{totals.subtotal.toFixed(2)}</span>
                </div>
                
                {totals.productDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product Discount</span>
                    <span className="font-semibold text-green-600">
                      -₹{totals.productDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                
                {appliedCoupon && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Coupon ({appliedCoupon.discount}%)
                    </span>
                    <span className="font-semibold text-green-600">
                      -₹{totals.couponDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  {totals.deliveryCharge === 0 ? (
                    <span className="font-semibold text-green-600 flex items-center gap-1">
                      FREE <Tag className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="font-semibold text-gray-900">₹{totals.deliveryCharge}</span>
                  )}
                </div>
                
                {totals.deliveryCharge > 0 && (
                  <p className="text-xs text-gray-500">
                    Free delivery on orders above ₹{FREE_DELIVERY_THRESHOLD}
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 py-4 bg-gradient-to-r from-secondary-light to-primary-light rounded-lg px-4">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">₹{totals.total.toFixed(2)}</span>
                  {totals.totalSavings > 0 && (
                    <p className="text-xs text-green-600 font-medium">
                      You save ₹{totals.totalSavings.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              {totals.totalSavings > 0 && <SavingsBanner amount={totals.totalSavings} />}

              {/* Checkout */}
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </button>

              <Link
                to="/shop"
                className="block w-full py-3 mt-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-50 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => !checkoutLoading && setShowCheckout(false)}
          />
          
          {/* Modal */}
          <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
            <div
              ref={modalRef}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-title"
            >
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
                <h2 id="checkout-title" className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Delivery Details
                </h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  disabled={checkoutLoading}
                  className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                  aria-label="Close checkout"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleCheckout} className="p-6 space-y-4">
                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {errors.submit}
                  </div>
                )}

                <FormInput
                  icon={Mail}
                  label="Email Address"
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => handleAddressChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  error={touched.email ? errors.email : ""}
                  placeholder="your@email.com"
                />

                <FormInput
                  icon={Phone}
                  label="Mobile Number"
                  type="tel"
                  required
                  value={address.mobileNo}
                  onChange={(e) => handleAddressChange("mobileNo", e.target.value)}
                  onBlur={() => handleBlur("mobileNo")}
                  error={touched.mobileNo ? errors.mobileNo : ""}
                  placeholder="9876543210"
                  maxLength={10}
                />

                <FormInput
                  icon={MapPin}
                  label="City"
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  onBlur={() => handleBlur("city")}
                  error={touched.city ? errors.city : ""}
                  placeholder="Mumbai"
                />

                <FormInput
                  label="Landmark / Street Address"
                  type="text"
                  required
                  value={address.landMark}
                  onChange={(e) => handleAddressChange("landMark", e.target.value)}
                  onBlur={() => handleBlur("landMark")}
                  error={touched.landMark ? errors.landMark : ""}
                  placeholder="Near Central Park, 123 Main Street"
                />

                <FormInput
                  label="Pincode"
                  type="text"
                  required
                  value={address.pincode}
                  onChange={(e) => handleAddressChange("pincode", e.target.value.replace(/\D/g, ""))}
                  onBlur={() => handleBlur("pincode")}
                  error={touched.pincode ? errors.pincode : ""}
                  placeholder="400001"
                  maxLength={6}
                  className="sm:w-1/2"
                />

                {/* Order preview */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items</span>
                    <span className="font-medium">{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="font-bold text-primary">₹{totals.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment</span>
                    <span className="font-medium text-gray-900">Cash on Delivery</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className="w-full py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-bold text-lg hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;





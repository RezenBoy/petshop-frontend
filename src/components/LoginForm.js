import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, EyeOff } from "lucide-react";
import axios from "axios";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    addressEmbeddable: { email: "" },
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Validation
  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Minimum 6 characters required";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setFormData({
        ...formData,
        addressEmbeddable: { ...formData.addressEmbeddable, email: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const value =
      name === "email" ? formData.addressEmbeddable.email : formData[name];
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  useEffect(() => {
    const hasErrors = Object.values(errors).some(Boolean);
    const filled = formData.addressEmbeddable.email && formData.password;
    setIsValid(!hasErrors && filled);
  }, [errors, formData]);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/users/login",
        formData
      );

      if (res.status === 200) {
        sessionStorage.setItem("user", JSON.stringify(res.data));
        window.location.href = "/";
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (err.response?.status === 401
            ? "Invalid email or password"
            : "Something went wrong")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-6 relative"
      style={{
        background: "linear-gradient(135deg, #fdf2f8 0%, #eff6ff 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Subtle decorative background */}
      <div
        className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/paw-prints.png')] bg-repeat pointer-events-none"
        style={{ backgroundSize: "180px" }}
      ></div>

      {/* Card Container */}
      <div className="relative flex flex-col lg:flex-row w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-white my-2">
        {/* LEFT Gradient Panel */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500">
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          
          <div className="relative flex flex-col justify-between p-10 text-white z-10">
            <div>
              {/* Logo */}
              <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
                <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">Bowlfull Buddies</h1>
                  <p className="text-xs text-white/80">Pet Paradise</p>
                </div>
              </Link>

              {/* Hero Content */}
              <h2 className="text-3xl font-bold leading-snug mb-4">
                Welcome back to your pet's happy place 🐾
              </h2>
              <p className="text-white/90 text-sm leading-relaxed">
                Sign in to continue exploring premium toys, treats, and accessories for your furry friends.
              </p>
            </div>

            {/* Footer */}
            <p className="text-xs text-white/60 mt-6">
              © 2025 Bowlfull Buddies. All rights reserved.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="w-full lg:w-1/2 bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto">
            {/* Mobile Logo */}
            <Link to="/" className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <div className="bg-gradient-to-r from-pink-500 to-blue-500 p-2 rounded-xl">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                Bowlfull Buddies
              </span>
            </Link>

            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-1.5">
                Sign in to your account
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-3 mb-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-xs text-red-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  autoFocus
                  value={formData.addressEmbeddable.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border-2 transition-all focus:outline-none ${
                    errors.email
                      ? "border-red-300 bg-red-50 focus:border-red-500"
                      : touched.email && !errors.email
                      ? "border-green-300 bg-green-50 focus:border-green-500"
                      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-2.5 pr-12 text-sm rounded-xl border-2 transition-all focus:outline-none ${
                      errors.password
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : touched.password && !errors.password
                        ? "border-green-300 bg-green-50 focus:border-green-500"
                        : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-pink-500 focus:ring-2 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <span className="select-none">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-pink-600 hover:text-pink-700 font-semibold transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all ${
                  !isValid || isSubmitting
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-blue-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex justify-center items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
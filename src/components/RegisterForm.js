import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Heart, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validate individual field
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Minimum 8 characters required";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value))
          return "Must include uppercase, lowercase and number";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle blur for validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Re-validate confirm password when password changes
  useEffect(() => {
    if (touched.confirmPassword && formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField("confirmPassword", formData.confirmPassword),
      }));
    }
  }, [formData.password]);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const payload = {
          fullName: formData.fullName.trim(),
          email: formData.email,
          password: formData.password,
          usersCategory: "CUSTOMER",
          addressEmbeddable: { email: formData.email },
        };
        await axios.post("http://localhost:8080/api/users/register", payload);
        setIsRegistered(true);

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } catch (error) {
        console.error("Registration failed:", error);
        setErrors({
          submit: error.response?.data?.message || "Failed to register. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Success Screen
  if (isRegistered) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 relative"
        style={{
          background: "linear-gradient(135deg, #fdf2f8 0%, #eff6ff 100%)",
          backgroundAttachment: "fixed",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/paw-prints.png')] bg-repeat pointer-events-none"
          style={{ backgroundSize: "180px" }}
        ></div>

        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full relative z-10">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Registration Successful! 🎉
          </h1>
          <p className="text-gray-600 mb-2">
            Welcome to Bowlfull Buddies, <span className="font-semibold text-pink-600">{formData.fullName}</span>!
          </p>
          <p className="text-sm text-gray-500">
            Redirecting you to login page...
          </p>
        </div>
      </div>
    );
  }

  // Registration Form
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-6 relative"
      style={{
        background: "linear-gradient(135deg, #fdf2f8 0%, #eff6ff 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Paw Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/paw-prints.png')] bg-repeat pointer-events-none"
        style={{ backgroundSize: "180px" }}
      ></div>

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
                Join our pet-loving community 🐾
              </h2>
              <p className="text-white/90 text-sm leading-relaxed">
                Create an account to start exploring premium pet products, toys, and accessories tailored just for your furry friends.
              </p>
            </div>

            {/* Footer */}
            <p className="text-xs text-white/60 mt-6">
              © 2025 Bowlfull Buddies. All rights reserved.
            </p>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
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
                Create your account
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 mb-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-xs text-red-700 font-medium">{errors.submit}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border-2 transition-all focus:outline-none ${
                    errors.fullName
                      ? "border-red-300 bg-red-50 focus:border-red-500"
                      : touched.fullName && !errors.fullName
                      ? "border-green-300 bg-green-50 focus:border-green-500"
                      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2.5 pr-12 text-sm rounded-xl border-2 transition-all focus:outline-none ${
                      errors.confirmPassword
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : touched.confirmPassword && !errors.confirmPassword
                        ? "border-green-300 bg-green-50 focus:border-green-500"
                        : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all ${
                  isSubmitting
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
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
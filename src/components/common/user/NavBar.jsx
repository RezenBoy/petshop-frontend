import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/logo.jpg";
import { Menu, X, ShoppingCart, Search, User, LogOut, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const location = useLocation();

  const updateCartCount = () => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const fullName = localStorage.getItem("fullName");
    if (token && userId) setUser({ token, userId, fullName });
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    setUser(null);
    window.location.href = "/login";
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-white/80 backdrop-blur-md border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 min-w-0">
              <img
                src={logo}
                alt="Bowlfull Buddies Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full flex-shrink-0"
              />
              <div className="leading-tight min-w-0">
                <span className="block text-sm sm:text-base font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent whitespace-nowrap">
                  Bowlfull Buddies
                </span>
                <span className="hidden sm:block text-[10px] text-gray-400 tracking-wide">
                  Pet Paradise
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-pink-500 bg-pink-50"
                      : "text-gray-600 hover:text-pink-500 hover:bg-pink-50/50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Search — Desktop */}
              <div className="hidden lg:block relative" ref={searchRef}>
                <div className={`flex items-center transition-all duration-300 ${searchOpen ? "w-52 xl:w-64" : "w-9"}`}>
                  <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className="absolute left-2 z-10 text-gray-400 hover:text-pink-500 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className={`pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white ${
                      searchOpen ? "opacity-100 w-full" : "opacity-0 w-0 pointer-events-none"
                    }`}
                  />
                </div>
              </div>

              {/* Search icon — Mobile/Tablet */}
              <button
                className="lg:hidden p-2 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                aria-label={`Cart with ${cartCount} items`}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 text-[10px] rounded-full text-white bg-pink-500 flex items-center justify-center font-medium shadow-sm">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Desktop Auth */}
              {user ? (
                <div className="relative hidden lg:block" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                    aria-expanded={dropdownOpen}
                  >
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-pink-400 to-blue-400 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                      {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                    </div>
                    <span className="hidden xl:block max-w-[100px] truncate text-gray-700">
                      {user.fullName}
                    </span>
                    <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
                      <div className="px-4 py-2.5 border-b border-gray-50">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-medium text-gray-800 truncate">{user.fullName}</p>
                      </div>
                      <Link to="/user/profile" className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-500 transition-colors" onClick={() => setDropdownOpen(false)}>
                        My Profile
                      </Link>
                      <Link to="/user/orders" className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-500 transition-colors" onClick={() => setDropdownOpen(false)}>
                        My Orders
                      </Link>
                      <div className="border-t border-gray-50">
                        <button
                          onClick={() => { handleLogout(); setDropdownOpen(false); }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden xl:inline">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-1.5 text-sm text-white rounded-full bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90 transition-opacity shadow-sm font-medium whitespace-nowrap"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger */}
              <button
                className="lg:hidden p-2 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 sm:w-80 bg-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="h-8 w-8 object-contain rounded-full" />
            <span className="font-semibold text-gray-800 text-sm">Menu</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:outline-none transition-all"
            />
          </div>

          {/* Nav Links */}
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive(item.href)
                    ? "text-pink-500 bg-pink-50"
                    : "text-gray-600 hover:text-pink-500 hover:bg-pink-50/60"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Auth */}
          {user ? (
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-400 to-blue-400 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{user.fullName}</p>
                  <p className="text-xs text-gray-400">My Account</p>
                </div>
              </div>
              <Link
                to="/user/profile"
                className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link
                to="/user/orders"
                className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                My Orders
              </Link>
              <button
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-gray-700 border border-gray-200 hover:border-pink-400 hover:text-pink-500 rounded-full transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center w-full py-2.5 text-sm font-medium text-white rounded-full bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90 transition-opacity shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
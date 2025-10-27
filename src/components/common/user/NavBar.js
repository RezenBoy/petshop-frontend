import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Menu,
  X,
  ShoppingCart,
  Search,
  User,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load user from memory state (replace localStorage with in-memory state)
  useEffect(() => {
    // For production, replace with your state management solution
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* LEFT: Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <span className="inline-flex p-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 shadow-sm">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </span>
              <span className="leading-tight">
                <span className="block text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                  Bowlfull Buddies
                </span>
                <span className="hidden sm:block text-[11px] text-gray-500">
                  Pet Paradise
                </span>
              </span>
            </Link>

            {/* CENTER: Desktop Nav */}
            <div className="hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative text-gray-700 hover:text-pink-500 font-medium text-sm transition-colors group"
                >
                  {item.name}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-pink-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Bar - Desktop only */}
              <div className="hidden lg:block w-56 xl:w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-pink-400 focus:border-pink-400 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Search Icon - Mobile/Tablet */}
              <button className="lg:hidden text-gray-700 hover:text-pink-500 transition p-2">
                <Search className="h-5 w-5" />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-pink-500 transition p-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-5 w-5 text-[11px] rounded-full text-white bg-pink-500 flex items-center justify-center shadow-sm">
                  3
                </span>
              </Link>

              {/* Desktop Auth */}
              {user ? (
                <div className="relative hidden lg:block">
                  {/* User button */}
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-pink-500 transition"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center text-white font-semibold text-xs">
                      {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                    </div>
                    <span className="hidden xl:inline">{user.fullName}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg overflow-hidden z-50 animate-fade-slide"
                    >
                      <Link
                        to="/user/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/user/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden lg:inline-flex items-center gap-1 text-sm text-gray-700 hover:text-pink-500 transition"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden xl:inline">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-flex items-center text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full text-white bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90 transition shadow-sm whitespace-nowrap"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-gray-700 hover:text-pink-500 transition p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 sm:w-80 bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-semibold text-gray-800">Menu</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-64px)] p-4 space-y-4">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-full focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-3 py-2 text-gray-700 hover:text-pink-500 hover:bg-pink-50 font-medium rounded-lg transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Account Section */}
          {user ? (
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center gap-3 px-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                </div>
                <span className="font-medium text-gray-800 truncate">
                  {user.fullName}
                </span>
              </div>
              <Link
                to="/user/profile"
                className="block px-3 py-2 text-sm text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition"
                onClick={() => setIsMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link
                to="/user/orders"
                className="block px-3 py-2 text-sm text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition"
                onClick={() => setIsMenuOpen(false)}
              >
                My Orders
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t space-y-2">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 border-2 border-gray-200 hover:border-pink-500 hover:text-pink-500 rounded-full transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                Login
              </Link>
              <Link
                to="/register"
                className="block text-center text-sm text-white rounded-full px-4 py-2.5 bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90 transition shadow-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;

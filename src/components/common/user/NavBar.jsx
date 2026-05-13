import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.jpg";
import { Menu, X, ShoppingCart, Search, User, LogOut, ChevronDown } from "lucide-react";

// ─── Constants ─────────────────────────────────────────────
const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

const AUTH_STORAGE_KEYS = ["token", "userId", "fullName"];

// ─── Custom Hook: LocalStorage with Sync ───────────────────
const useAuthUser = () => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const fullName = localStorage.getItem("fullName");
    return token && userId ? { token, userId, fullName } : null;
  });

  useEffect(() => {
    const handleStorage = (e) => {
      if (AUTH_STORAGE_KEYS.includes(e.key)) {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const fullName = localStorage.getItem("fullName");
        setUser(token && userId ? { token, userId, fullName } : null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return user;
};

// ─── Custom Hook: Cart Count ───────────────────────────────
const useCartCount = () => {
  const [count, setCount] = useState(0);

  const update = useCallback(() => {
    try {
      const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCount(items.reduce((sum, item) => sum + (item.quantity || 1), 0));
    } catch {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("cartUpdated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cartUpdated", update);
      window.removeEventListener("storage", update);
    };
  }, [update]);

  return count;
};

// ─── Custom Hook: Scroll State (throttled) ──────────────────
const useScrolled = (threshold = 10) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
};

// ─── Custom Hook: Click Outside ────────────────────────────
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
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

// ─── Custom Hook: Lock Body Scroll ─────────────────────────
const useLockBodyScroll = (lock) => {
  useEffect(() => {
    if (!lock) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [lock]);
};

// ─── Sub-Components ──────────────────────────────────────

const UserAvatar = ({ name, size = "sm" }) => {
  const initial = name ? name[0].toUpperCase() : "U";
  const sizeClasses = size === "sm" 
    ? "h-7 w-7 text-xs" 
    : "h-9 w-9 text-sm";
  
  return (
    <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-pink-400 to-blue-400 flex items-center justify-center text-white font-semibold flex-shrink-0`}>
      {initial}
    </div>
  );
};

const CartBadge = ({ count }) => (
  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 text-[10px] rounded-full text-white bg-pink-500 flex items-center justify-center font-medium shadow-sm">
    {count > 9 ? "9+" : count}
  </span>
);

const NavLink = ({ item, isActive, onClick }) => (
  <Link
    to={item.href}
    onClick={onClick}
    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? "text-pink-500 bg-pink-50"
        : "text-gray-600 hover:text-pink-500 hover:bg-pink-50/50"
    }`}
    aria-current={isActive ? "page" : undefined}
  >
    {item.name}
  </Link>
);

const IconButton = ({ onClick, label, children, className = "" }) => (
  <button
    onClick={onClick}
    className={`p-2 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors ${className}`}
    aria-label={label}
  >
    {children}
  </button>
);

// ─── Main Component ──────────────────────────────────────
const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const drawerRef = useRef(null);
  const searchInputRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = useAuthUser();
  const cartCount = useCartCount();
  const scrolled = useScrolled();

  // Close dropdown/search on outside click
  useClickOutside(dropdownRef, () => setDropdownOpen(false));
  useClickOutside(searchRef, () => setSearchOpen(false));

  // Focus trap for mobile drawer
  useFocusTrap(isMenuOpen, drawerRef);
  useLockBodyScroll(isMenuOpen);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setDropdownOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  const handleLogout = useCallback(() => {
    AUTH_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
    window.location.href = "/login";
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  }, [searchQuery, navigate]);

  const isActive = useCallback(
    (href) => location.pathname === href,
    [location.pathname]
  );

  const activeNavItems = useMemo(() => 
    NAV_ITEMS.map(item => ({ ...item, active: isActive(item.href) })),
    [isActive]
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-white/80 backdrop-blur-md border-b border-gray-200"
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 min-w-0">
              <img
                src={logo}
                alt="Bowlfull Buddies"
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
              {activeNavItems.map((item) => (
                <NavLink 
                  key={item.name} 
                  item={item} 
                  isActive={item.active} 
                />
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Search — Desktop */}
              <div className="hidden lg:block relative" ref={searchRef}>
                <form 
                  onSubmit={handleSearch}
                  className={`flex items-center transition-all duration-300 ${searchOpen ? "w-52 xl:w-64" : "w-9"}`}
                >
                  <button
                    type="button"
                    onClick={() => setSearchOpen(!searchOpen)}
                    className="absolute left-2 z-10 text-gray-400 hover:text-pink-500 transition-colors"
                    aria-label={searchOpen ? "Close search" : "Open search"}
                  >
                    <Search className="h-4 w-4" />
                  </button>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className={`pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white ${
                      searchOpen ? "opacity-100 w-full" : "opacity-0 w-0 pointer-events-none"
                    }`}
                    aria-label="Search products"
                  />
                  {searchOpen && searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </form>
              </div>

              {/* Search icon — Mobile/Tablet (opens search overlay) */}
              <IconButton
                onClick={() => setIsMenuOpen(true)}
                label="Open menu"
                className="lg:hidden"
              >
                <Search className="h-5 w-5" />
              </IconButton>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                aria-label={`Cart with ${cartCount} items`}
              >
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                {cartCount > 0 && <CartBadge count={cartCount} />}
              </Link>

              {/* Desktop Auth */}
              {user ? (
                <div className="relative hidden lg:block" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(prev => !prev)}
                    className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    <UserAvatar name={user.fullName} />
                    <span className="hidden xl:block max-w-[100px] truncate text-gray-700">
                      {user.fullName}
                    </span>
                    <ChevronDown 
                      className={`h-3 w-3 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} 
                      aria-hidden="true"
                    />
                  </button>

                  {dropdownOpen && (
                    <div 
                      className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50"
                      role="menu"
                    >
                      <div className="px-4 py-2.5 border-b border-gray-50">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-medium text-gray-800 truncate">{user.fullName}</p>
                      </div>
                      <Link 
                        to="/user/profile" 
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                        role="menuitem"
                      >
                        My Profile
                      </Link>
                      <Link 
                        to="/user/orders" 
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                        role="menuitem"
                      >
                        My Orders
                      </Link>
                      <div className="border-t border-gray-50">
                        <button
                          onClick={() => { handleLogout(); setDropdownOpen(false); }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
                          role="menuitem"
                        >
                          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
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
                    <User className="h-4 w-4" aria-hidden="true" />
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
              <IconButton
                onClick={() => setIsMenuOpen(prev => !prev)}
                label={isMenuOpen ? "Close menu" : "Open menu"}
                className="lg:hidden"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </IconButton>
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
        ref={drawerRef}
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
          <IconButton
            onClick={() => setIsMenuOpen(false)}
            label="Close menu"
          >
            <X className="h-5 w-5 text-gray-500" />
          </IconButton>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:outline-none transition-all"
              aria-label="Search products"
            />
          </form>

          {/* Nav Links */}
          <nav className="space-y-0.5" aria-label="Mobile navigation">
            {activeNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  item.active
                    ? "text-pink-500 bg-pink-50"
                    : "text-gray-600 hover:text-pink-500 hover:bg-pink-50/60"
                }`}
                onClick={() => setIsMenuOpen(false)}
                aria-current={item.active ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="border-t border-gray-100" role="separator" />

          {/* Auth */}
          {user ? (
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl">
                <UserAvatar name={user.fullName} size="md" />
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
                <LogOut className="h-4 w-4" aria-hidden="true" />
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
                <User className="h-4 w-4" aria-hidden="true" />
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
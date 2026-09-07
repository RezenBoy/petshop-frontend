import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.jpg";
import { Menu, X, ShoppingCart, Search, User, LogOut, ChevronDown } from "lucide-react";
import { BRAND } from "../brand";

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
    <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-surface font-semibold flex-shrink-0`}>
      {initial}
    </div>
  );
};

const CartBadge = ({ count }) => (
  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 text-[10px] rounded-full text-surface bg-accent flex items-center justify-center font-medium shadow-sm">
    {count > 9 ? "9+" : count}
  </span>
);

const NavLink = ({ item, isActive, onClick }) => (
  <Link
    to={item.href}
    onClick={onClick}
    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? "text-primary bg-secondary/30 font-semibold"
        : "text-text hover:text-primary hover:bg-secondary/20"
    }`}
    aria-current={isActive ? "page" : undefined}
  >
    {item.name}
  </Link>
);

const IconButton = ({ onClick, label, children, className = "" }) => (
  <button
    onClick={onClick}
    className={`p-2 text-text hover:text-primary hover:bg-secondary/20 rounded-lg transition-colors ${className}`}
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
            ? "bg-surface/95 backdrop-blur-md shadow-sm border-b border-border/60"
            : "bg-surface/85 backdrop-blur-md border-b border-border"
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 min-w-0">
              <img
                src={logo}
                alt={BRAND.name}
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full flex-shrink-0"
              />
              <div className="leading-tight min-w-0">
                <span className="block text-sm sm:text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap">
                  {BRAND.name}
                </span>
                <span className="hidden sm:block text-[10px] text-textMuted tracking-wide">
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
                    className="absolute left-2 z-10 text-textMuted hover:text-primary transition-colors"
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
                    className={`pl-8 pr-3 py-1.5 text-sm border border-border rounded-full focus:ring-2 focus:ring-secondary focus:border-primary focus:outline-none transition-all duration-300 bg-background focus:bg-surface text-text ${
                      searchOpen ? "opacity-100 w-full" : "opacity-0 w-0 pointer-events-none"
                    }`}
                    aria-label="Search products"
                  />
                  {searchOpen && searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 text-textMuted hover:text-text"
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
                className="relative p-2 text-text hover:text-primary hover:bg-secondary/20 rounded-lg transition-colors"
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
                    className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-text hover:bg-secondary/20 rounded-lg transition-colors"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    <UserAvatar name={user.fullName} />
                    <span className="hidden xl:block max-w-[100px] truncate text-text">
                      {user.fullName}
                    </span>
                    <ChevronDown 
                      className={`h-3 w-3 text-textMuted transition-transform ${dropdownOpen ? "rotate-180" : ""}`} 
                      aria-hidden="true"
                    />
                  </button>

                  {dropdownOpen && (
                    <div 
                      className="absolute right-0 mt-1.5 w-44 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-50"
                      role="menu"
                    >
                      <div className="px-4 py-2.5 border-b border-border/50">
                        <p className="text-xs text-textMuted">Signed in as</p>
                        <p className="text-sm font-medium text-text truncate">{user.fullName}</p>
                      </div>
                      <Link 
                        to="/user/profile" 
                        className="block px-4 py-2.5 text-sm text-text hover:bg-secondary/20 hover:text-primary transition-colors"
                        onClick={() => setDropdownOpen(false)}
                        role="menuitem"
                      >
                        My Profile
                      </Link>
                      <Link 
                        to="/user/orders" 
                        className="block px-4 py-2.5 text-sm text-text hover:bg-secondary/20 hover:text-primary transition-colors"
                        onClick={() => setDropdownOpen(false)}
                        role="menuitem"
                      >
                        My Orders
                      </Link>
                      <div className="border-t border-border/50">
                        <button
                          onClick={() => { handleLogout(); setDropdownOpen(false); }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-textMuted hover:bg-red-50 hover:text-red-600 transition-colors"
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
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text hover:text-primary hover:bg-secondary/20 rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden xl:inline">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-1.5 text-sm text-surface rounded-full bg-primary hover:bg-primary/90 transition-opacity shadow-sm font-medium whitespace-nowrap"
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
        className={`fixed top-0 right-0 h-full w-72 sm:w-80 bg-surface z-50 lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="h-8 w-8 object-contain rounded-full" />
            <span className="font-semibold text-text text-sm">Menu</span>
          </div>
          <IconButton
            onClick={() => setIsMenuOpen(false)}
            label="Close menu"
          >
            <X className="h-5 w-5 text-textMuted" />
          </IconButton>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-full bg-background focus:bg-surface focus:ring-2 focus:ring-secondary focus:border-primary focus:outline-none transition-all text-text"
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
                    ? "text-primary bg-secondary/30"
                    : "text-text hover:text-primary hover:bg-secondary/20"
                }`}
                onClick={() => setIsMenuOpen(false)}
                aria-current={item.active ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="border-t border-border" role="separator" />

          {/* Auth */}
          {user ? (
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-4 py-3 bg-secondary/30 rounded-xl">
                <UserAvatar name={user.fullName} size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text truncate">{user.fullName}</p>
                  <p className="text-xs text-textMuted">My Account</p>
                </div>
              </div>
              <Link
                to="/user/profile"
                className="flex items-center px-4 py-2.5 text-sm text-text hover:text-primary hover:bg-secondary/20 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link
                to="/user/orders"
                className="flex items-center px-4 py-2.5 text-sm text-text hover:text-primary hover:bg-secondary/20 rounded-xl transition-colors"
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
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-text border border-border hover:border-primary hover:text-primary rounded-full transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" aria-hidden="true" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center w-full py-2.5 text-sm font-medium text-surface rounded-full bg-primary hover:bg-primary/90 transition-opacity shadow-sm"
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
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X, ShoppingCart, Search, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [user, setUser] = React.useState(null); // store logged-in user

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Shop', href: '#shop' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  // Load user from in-memory storage (replacing localStorage)
  React.useEffect(() => {
    // Simulate checking for logged-in user
    // In a real app, this would check your authentication state
    const savedUser = null; // Replace localStorage with in-memory state
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    setUser(null);
    // In a real app, you'd clear authentication tokens/state
    window.location.reload(); // refresh page or redirect
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-pink-400 to-blue-400 p-2 rounded-full">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                Bowlfull Buddies
              </span>
              <span className="text-xs text-gray-500 -mt-1">Pet Paradise</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a 
                key={item.name}
                href={item.href} 
                className="relative text-gray-700 hover:text-pink-500 transition-colors font-medium group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-600 hover:text-pink-500 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {isSearchOpen && (
                <div className="absolute right-0 top-8 w-64 bg-white shadow-lg rounded-lg border p-2">
                  <input
                    type="text"
                    placeholder="Search for products..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    autoFocus
                  />
                </div>
              )}
            </div>
            
            {/* Cart */}
            <button className="relative text-gray-600 hover:text-pink-500 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-400 to-blue-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
            
            {/* User Account */}
            <div className="hidden md:flex items-center space-x-3">
              {!user ? (
                <>
                  <Link 
                    to="/login"
                    className="text-gray-700 hover:text-pink-500 transition-colors font-medium flex items-center space-x-1"
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                  <Link 
                    to="/register"
                    className="bg-gradient-to-r from-pink-400 to-blue-400 text-white px-4 py-2 rounded-full hover:from-pink-500 hover:to-blue-500 transition-all shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-pink-500 transition-colors">
                    <User className="h-4 w-4" />
                    <span>{user.username}</span>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute hidden group-hover:block right-0 mt-2 w-40 bg-white border rounded-lg shadow-md">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 w-full text-left text-gray-700 hover:bg-pink-50 hover:text-pink-500"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="text-gray-700 hover:text-pink-500 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-gray-50"
                />
              </div>
              
              {/* Mobile Navigation Items */}
              {navItems.map((item) => (
                <a 
                  key={item.name}
                  href={item.href} 
                  className="block px-3 py-2 text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors font-medium"
                >
                  {item.name}
                </a>
              ))}
              
              {/* Mobile Account Actions */}
              <div className="px-3 py-2 space-y-2 border-t border-gray-200 mt-2 pt-4">
                {!user ? (
                  <>
                    <Link 
                      to="/login"
                      className="block w-full text-left text-gray-700 hover:text-pink-500 font-medium py-2"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register"
                      className="block w-full bg-gradient-to-r from-pink-400 to-blue-400 text-white px-4 py-2 rounded-full hover:from-pink-500 hover:to-blue-500 transition-all text-center"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-700 hover:text-pink-500 font-medium py-2 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Search Overlay for Mobile */}
      {isSearchOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t p-4">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            autoFocus
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
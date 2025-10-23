import React, { useState } from "react";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({
    username: "Harman Singh",
    email: "harman@mail.com",
    phone: "+91 98765 43210",
    address: "123 Pet Street, Animal City, Punjab 147001",
    joinedDate: "January 2024",
  });
  const [pets, setPets] = useState([
    { id: 1, name: "Buddy", type: "Dog", breed: "Labrador", age: 2, color: "from-amber-400 to-orange-500" },
    { id: 2, name: "Mittens", type: "Cat", breed: "Persian", age: 3, color: "from-gray-400 to-slate-500" },
  ]);
  const [wishlist, setWishlist] = useState([
    { id: 1, name: "Premium Dog Food", price: "₹1,999", image: "🦴" },
    { id: 2, name: "Cat Scratching Post", price: "₹3,299", image: "🐱" },
    { id: 3, name: "Pet Carrier Bag", price: "₹2,499", image: "👜" },
  ]);
  const [orders, setOrders] = useState([
    { id: "ORD123", date: "2025-10-14", items: 3, total: "₹4,999", status: "Delivered" },
    { id: "ORD124", date: "2025-10-15", items: 1, total: "₹1,999", status: "Shipped" },
    { id: "ORD125", date: "2025-10-18", items: 2, total: "₹3,499", status: "Processing" },
  ]);
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState(user);

  const handleLogout = () => {
    alert("Logging out...");
  };

  const handleAddPet = () => {
    const colors = [
      "from-pink-400 to-rose-500",
      "from-blue-400 to-indigo-500",
      "from-green-400 to-emerald-500",
      "from-purple-400 to-violet-500",
    ];
    const newPet = {
      id: Date.now(),
      name: "New Pet",
      type: "Dog",
      breed: "Unknown",
      age: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setPets([...pets, newPet]);
  };

  const handleRemovePet = (id) => {
    setPets(pets.filter((p) => p.id !== id));
  };

  const handleEditToggle = () => {
    if (editMode) setTempUser(user);
    setEditMode(!editMode);
  };

  const handleSaveProfile = () => {
    setUser(tempUser);
    setEditMode(false);
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const tabs = [
    { id: "profile", label: "Profile", emoji: "👤" },
    { id: "pets", label: "My Pets", emoji: "🐾" },
    { id: "orders", label: "Orders", emoji: "🛍️" },
    { id: "wishlist", label: "Wishlist", emoji: "❤️" },
    { id: "settings", label: "Settings", emoji: "⚙️" },
  ];

  const getStatusColor = (status) => {
    const colors = {
      Delivered: "bg-green-100 text-green-700 border-green-200",
      Shipped: "bg-blue-100 text-blue-700 border-blue-200",
      Processing: "bg-amber-100 text-amber-700 border-amber-200",
      Pending: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[status] || colors.Pending;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center justify-between col-span-full mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pet Profile</h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              {sidebarOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* Sidebar */}
          <aside
            className={`lg:col-span-3 ${
              sidebarOpen ? "block" : "hidden"
            } lg:block fixed lg:static inset-0 lg:inset-auto z-40 lg:z-0`}
          >
            <div
              className="lg:hidden fixed inset-0 bg-black/20 z-30"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24 relative z-40">
              <div className="bg-gradient-to-br from-pink-500 to-blue-500 p-4 sm:p-6 text-white">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="h-16 sm:h-20 w-16 sm:w-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-2xl sm:text-3xl font-bold">
                      {user.username[0].toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-5 sm:h-6 w-5 sm:w-6 bg-green-400 rounded-full border-4 border-white"></div>
                  </div>
                  <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold">{user.username}</h3>
                  <p className="text-xs sm:text-sm text-white/80 mt-1 break-all">{user.email}</p>
                </div>
              </div>

              <nav className="p-3 sm:p-4">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all mb-2 ${
                        isActive
                          ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span>{tab.emoji}</span>
                        <span>{tab.label}</span>
                      </div>
                      {isActive && "→"}
                    </button>
                  );
                })}
              </nav>

              <div className="p-3 sm:p-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Profile</h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your personal information</p>
                    </div>
                    {editMode ? (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={handleSaveProfile}
                          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:opacity-90 transition-all shadow-sm"
                        >
                          ✓ Save
                        </button>
                        <button
                          onClick={handleEditToggle}
                          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleEditToggle}
                        className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-pink-600 hover:bg-pink-50 transition-all"
                      >
                        ✏️ Edit Profile
                      </button>
                    )}
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Full Name</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={tempUser.username}
                            onChange={(e) => setTempUser({ ...tempUser, username: e.target.value })}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-sm"
                          />
                        ) : (
                          <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">{user.username}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Email Address</label>
                        {editMode ? (
                          <input
                            type="email"
                            value={tempUser.email}
                            onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-sm"
                          />
                        ) : (
                          <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl break-all">{user.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Phone Number</label>
                        {editMode ? (
                          <input
                            type="tel"
                            value={tempUser.phone}
                            onChange={(e) => setTempUser({ ...tempUser, phone: e.target.value })}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-sm"
                          />
                        ) : (
                          <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">{user.phone}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Member Since</label>
                        <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">{user.joinedDate}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-700">Address</label>
                      {editMode ? (
                        <textarea
                          value={tempUser.address}
                          onChange={(e) => setTempUser({ ...tempUser, address: e.target.value })}
                          rows={3}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all resize-none text-sm"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">{user.address}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Pets Tab */}
              {activeTab === "pets" && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Pets</h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your beloved companions</p>
                    </div>
                    <button
                      onClick={handleAddPet}
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:opacity-90 transition-all shadow-sm"
                    >
                      ➕ Add Pet
                    </button>
                  </div>

                  {pets.length === 0 ? (
                    <div className="text-center py-12 sm:py-16">
                      <div className="text-4xl mb-3">🐾</div>
                      <p className="text-sm sm:text-base text-gray-500">No pets added yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {pets.map((pet) => (
                        <div
                          key={pet.id}
                          className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-all"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className={`h-10 sm:h-12 w-10 sm:w-12 rounded-xl bg-gradient-to-br ${pet.color} flex items-center justify-center text-lg sm:text-xl flex-shrink-0`}>
                              {pet.type === "Dog" ? "🐕" : "🐱"}
                            </div>
                            <button
                              onClick={() => handleRemovePet(pet.id)}
                              className="opacity-0 group-hover:opacity-100 text-red-500 text-lg hover:bg-red-50 p-1 rounded transition-all flex-shrink-0"
                            >
                              🗑️
                            </button>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{pet.name}</h3>
                          <div className="space-y-1 text-xs sm:text-sm text-gray-500">
                            <p>{pet.breed} • {pet.type}</p>
                            <p>{pet.age} {pet.age === 1 ? 'year' : 'years'} old</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div>
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Order History</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Track and manage your orders</p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-12 sm:py-16">
                      <div className="text-4xl mb-3">📦</div>
                      <p className="text-sm sm:text-base text-gray-500">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                            <div className="flex items-start gap-3 sm:gap-4">
                              <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0 text-lg">
                                📦
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Order #{order.id}</h3>
                                <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
                                  <span>{order.date}</span>
                                  <span>{order.items} {order.items === 1 ? 'item' : 'items'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                              <span className="text-base sm:text-lg font-bold text-gray-900">{order.total}</span>
                              <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === "wishlist" && (
                <div>
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Wishlist</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Items you love and want to buy</p>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="text-center py-12 sm:py-16">
                      <div className="text-4xl mb-3">❤️</div>
                      <p className="text-sm sm:text-base text-gray-500">Your wishlist is empty</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {wishlist.map((item) => (
                        <div
                          key={item.id}
                          className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-all"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="h-14 sm:h-16 w-14 sm:w-16 rounded-xl bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
                              {item.image}
                            </div>
                            <button
                              onClick={() => handleRemoveFromWishlist(item.id)}
                              className="opacity-0 group-hover:opacity-100 text-red-500 text-lg hover:bg-red-50 p-1 rounded transition-all flex-shrink-0"
                            >
                              🗑️
                            </button>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{item.name}</h3>
                          <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
                            {item.price}
                          </p>
                          <button className="w-full py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:opacity-90 transition-all shadow-sm">
                            Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div>
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Account Settings</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your account preferences</p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-4 sm:p-6">
                      <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">🔒 Password & Security</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Update your password and security settings</p>
                      <button className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:opacity-90 transition-all shadow-sm">
                        Change Password
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-4 sm:p-6">
                      <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">🔔 Notifications</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Manage your notification preferences</p>
                      <button className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">
                        Notification Settings
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-4 sm:p-6">
                      <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">👁️ Privacy</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Control your privacy and data settings</p>
                      <button className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">
                        Privacy Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
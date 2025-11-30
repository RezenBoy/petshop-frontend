import React, { useEffect, useState } from "react";
import { buildHeaders } from "../../components/auth/auth";
import {
  User,
  PawPrint,
  ShoppingBag,
  MapPin,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";

const UserProfile = () => {
  // ---------- existing component-level state ----------
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [tempUser, setTempUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pets, setPets] = useState([
    { id: 1, name: "Buddy", type: "Dog", breed: "Labrador", age: 2, color: "from-amber-400 to-orange-500" },
    { id: 2, name: "Mittens", type: "Cat", breed: "Persian", age: 3, color: "from-gray-400 to-slate-500" },
  ]);
  const [wishlist, setWishlist] = useState([
    { id: 1, name: "Premium Dog Food", price: "₹1,999", image: "🦴" },
    { id: 2, name: "Cat Scratching Post", price: "₹3,299", image: "🐱" },
    { id: 3, name: "Pet Carrier Bag", price: "₹2,499", image: "👜" },
  ]);
  const [orders] = useState([
    { id: "ORD123", date: "2025-10-14", items: 3, total: "₹4,999", status: "Delivered" },
    { id: "ORD124", date: "2025-10-15", items: 1, total: "₹1,999", status: "Shipped" },
    { id: "ORD125", date: "2025-10-18", items: 2, total: "₹3,499", status: "Processing" },
  ]);

  const [editMode, setEditMode] = useState(false);

  // ---------- address-related hooks ----------
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressEditMode, setAddressEditMode] = useState(false);
  const [tempAddress, setTempAddress] = useState({
    id: null,
    label: "",
    landMark: "",
    city: "",
    pincode: "",
    districtName: "",
    phone: "",
    isDefault: false,
  });

  const API = process.env.REACT_APP_API_URL;

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={20} /> },
    { id: "pets", label: "My Pets", icon: <PawPrint size={20} /> },
    { id: "address", label: "Address", icon: <MapPin size={20} /> },
    { id: "orders", label: "Orders", icon: <ShoppingBag size={20} /> },
    { id: "wishlist", label: "Wishlist", icon: <Heart size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  // Load addresses when user is available
  useEffect(() => {
    if (!user) return;

    const loadAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const url = `${API}/api/addresses`;
        const res = await fetch(url, { headers: buildHeaders() });
        if (!res.ok) throw new Error(`Failed to fetch addresses (${res.status})`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.items ?? [];
        setAddresses(list);
        if (list.length > 0) {
          setSelectedAddressId(list[0].id);
          setSelectedAddress(list[0]);
        }
      } catch (e) {
        console.error("Failed to load addresses", e);
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [user, API]);

  async function loadUser() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No auth token found. Please login first.");
      }

      const url = `${API}/api/users/me`;
      const res = await fetch(url, {
        method: "GET",
        headers: buildHeaders(),
      });

      if (!res.ok) {
        let body = "";
        try { body = await res.text(); } catch (e) { }
        throw new Error(`Failed to load user (${res.status}). Body: ${body}`);
      }

      const data = await res.json();
      const mapped = {
        id: data.id,
        fullName: data.fullName || "",
        email: data.address?.email || "",
        phone: data.address?.mobileNo || "",
        addressObj: {
          landMark: data.address?.landMark || "",
          city: data.address?.city || "",
          pincode: data.address?.pincode || "",
          districtId: data.address?.districtId ?? null,
          country: data.address?.country || "",
        },
        joinedDate: data.joinedDate || "Member",
        raw: data,
      };

      setUser(mapped);
      setTempUser(JSON.parse(JSON.stringify(mapped)));
    } catch (err) {
      console.error("[loadUser] error:", err);
      alert("Could not load profile. See console for details.");
    } finally {
      setLoading(false);
    }
  }

  /* ===== Address Helpers ===== */
  function selectAddress(id) {
    setSelectedAddressId(id);
    const a = addresses.find((x) => x.id === id) ?? null;
    setSelectedAddress(a);
    setTempAddress(
      a
        ? { ...a }
        : { id: null, label: "", landMark: "", city: "", pincode: "", districtName: "", phone: "", isDefault: false }
    );
    setAddressEditMode(false);
    setAddressError("");
  }

  function openAddAddress() {
    setSelectedAddressId(null);
    setSelectedAddress(null);
    setTempAddress({ id: null, label: "", landMark: "", city: "", pincode: "", districtName: "", phone: "", isDefault: false });
    setAddressEditMode(true);
    setAddressError("");
  }

  function startEditSelectedAddress() {
    if (!selectedAddress) return;
    setTempAddress({ ...selectedAddress });
    setAddressEditMode(true);
    setAddressError("");
  }

  function handleCancelAddress() {
    setTempAddress(
      selectedAddress
        ? { ...selectedAddress }
        : { id: null, label: "", landMark: "", city: "", pincode: "", districtName: "", phone: "", isDefault: false }
    );
    setAddressEditMode(false);
    setAddressError("");
  }

  function validateAddress(a) {
    if (!a.label?.trim()) return "Enter a label (Home / Work).";
    if (!a.landMark?.trim()) return "Enter address / landmark.";
    if (!a.city?.trim()) return "Enter city.";
    if (!a.pincode?.trim()) return "Enter pincode.";
    if (a.pincode && !/^\d{4,6}$/.test(a.pincode)) return "Pincode seems invalid.";
    if (a.phone && !/^\+?\d{7,15}$/.test(a.phone)) return "Phone seems invalid.";
    return "";
  }

  async function handleSaveAddress() {
    setAddressError("");
    const v = validateAddress(tempAddress);
    if (v) {
      setAddressError(v);
      return;
    }

    setSavingAddress(true);
    try {
      if (tempAddress.id) {
        // UPDATE
        const url = `${API}/api/addresses/${encodeURIComponent(tempAddress.id)}`;
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            ...buildHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tempAddress),
        });
        if (!res.ok) throw new Error(`Update failed (${res.status})`);
        const updated = await res.json();
        setAddresses((prev) => prev.map((p) => (p.id === updated.id ? { ...updated } : p)));
        setSelectedAddress({ ...updated });
        setSelectedAddressId(updated.id);
      } else {
        // CREATE
        const url = `${API}/api/addresses`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            ...buildHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tempAddress),
        });
        if (!res.ok) throw new Error(`Create failed (${res.status})`);
        const created = await res.json();
        const createdAddr = created.id ? created : { ...tempAddress, id: Date.now().toString() };
        setAddresses((prev) => [createdAddr, ...prev]);
        setSelectedAddress(createdAddr);
        setSelectedAddressId(createdAddr.id);
      }

      if (tempAddress.isDefault) {
        setAddresses((prev) => prev.map((p) => ({ ...p, isDefault: p.id === tempAddress.id })));
      }

      setAddressEditMode(false);
    } catch (e) {
      console.error("save address failed", e);
      setAddressError("Failed to save address. See console for details.");
    } finally {
      setSavingAddress(false);
    }
  }

  async function deleteAddress(id) {
    if (!id) return;
    if (!window.confirm("Delete this address? This action cannot be undone.")) return;
    try {
      const url = `${API}/api/addresses/${encodeURIComponent(id)}`;
      const res = await fetch(url, { method: "DELETE", headers: buildHeaders() });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);

      setAddresses((prev) => {
        const next = prev.filter((p) => p.id !== id);
        const nextSelected = next.length > 0 ? next[0] : null;
        setSelectedAddress(nextSelected);
        setSelectedAddressId(nextSelected?.id ?? null);
        return next;
      });
    } catch (e) {
      console.error("delete failed", e);
      setAddresses((prev) => {
        const next = prev.filter((p) => p.id !== id);
        const nextSelected = next.length > 0 ? next[0] : null;
        setSelectedAddress(nextSelected);
        setSelectedAddressId(nextSelected?.id ?? null);
        return next;
      });
    }
  }

  const handleEditToggle = () => {
    if (editMode) {
      setTempUser(user ? JSON.parse(JSON.stringify(user)) : null);
    }
    setEditMode(!editMode);
  };

  const handleSaveProfile = async () => {
    if (!tempUser || !user) return;
    setSaving(true);
    try {
      const body = {
        fullName: tempUser.fullName,
        address: {
          email: tempUser.email,
          mobileNo: tempUser.phone,
          landMark: tempUser.addressObj.landMark,
          city: tempUser.addressObj.city,
          pincode: tempUser.addressObj.pincode,
          districtId: tempUser.addressObj.districtId,
        },
      };
      const res = await fetch(`${API}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          ...buildHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(`Save failed (${res.status})`);
      }
      const updatedDto = await res.json();
      const mapped = {
        id: updatedDto.id,
        fullName: updatedDto.fullName || "",
        email: updatedDto.address?.email || "",
        phone: updatedDto.address?.mobileNo || "",
        addressObj: {
          landMark: updatedDto.address?.landMark || "",
          city: updatedDto.address?.city || "",
          pincode: updatedDto.address?.pincode || "",
          districtId: updatedDto.address?.districtId || null,
        },
        joinedDate: user.joinedDate,
        raw: updatedDto,
      };
      setUser(mapped);
      setTempUser(JSON.parse(JSON.stringify(mapped)));
      setEditMode(false);
      alert("Profile saved.");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile. See console.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    alert("Logging out...");
    // window.location.href = "/login";
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
    setPets((p) => [...p, newPet]);
  };

  const handleRemovePet = (id) => {
    setPets((p) => p.filter((x) => x.id !== id));
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlist((w) => w.filter((item) => item.id !== id));
  };

  const getStatusColor = (status) => {
    const colors = {
      Delivered: "bg-green-100 text-green-700 border-green-200",
      Shipped: "bg-blue-100 text-blue-700 border-blue-200",
      Processing: "bg-amber-100 text-amber-700 border-amber-200",
      Pending: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[status] || colors.Pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading profile…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">No user found.</div>
      </div>
    );
  }

  const updateTemp = (path, value) => {
    setTempUser((t) => {
      const copy = { ...t };
      if (path.startsWith("addressObj.")) {
        copy.addressObj = { ...(copy.addressObj || {}) };
        copy.addressObj[path.replace("addressObj.", "")] = value;
      } else {
        copy[path] = value;
      }
      return copy;
    });
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
            className={`lg:col-span-3 ${sidebarOpen ? "block" : "hidden"} lg:block fixed lg:static inset-0 lg:inset-auto z-40 lg:z-0`}
          >
            <div className="lg:hidden fixed inset-0 bg-black/20 z-30" onClick={() => setSidebarOpen(false)}></div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24 relative z-40">
              <div className="bg-gradient-to-br from-pink-500 to-blue-500 p-4 sm:p-6 text-white">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="h-16 sm:h-20 w-16 sm:w-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-2xl sm:text-3xl font-bold">
                      {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-5 sm:h-6 w-5 sm:w-6 bg-green-400 rounded-full border-4 border-white"></div>
                  </div>
                  <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold">{user.fullName}</h3>
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
                      className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all mb-2 ${isActive
                        ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span>{tab.icon}</span>
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
                  <LogOut size={20} /> Logout
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
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">My Profile</h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your personal information</p>
                    </div>

                    {editMode ? (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          aria-disabled={saving}
                          className={
                            "flex-none px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:opacity-90 transition-all shadow-sm " +
                            (saving ? "opacity-70 cursor-not-allowed" : "")
                          }
                          style={{ minWidth: 110 }}
                        >
                          {saving ? "Saving…" : "✓ Save"}
                        </button>

                        <button
                          onClick={handleEditToggle}
                          type="button"
                          className="flex-none px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                          style={{ minWidth: 110 }}
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleEditToggle}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm sm:text-sm font-medium text-pink-600 hover:bg-pink-50 transition-all"
                        aria-label="Edit profile"
                      >
                        ✏️ Edit Profile
                      </button>
                    )}
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2 min-w-0">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Full Name</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={tempUser.fullName}
                            onChange={(e) => updateTemp("fullName", e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-sm"
                            aria-label="Full name"
                          />
                        ) : (
                          <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl truncate">
                            {user.fullName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 min-w-0">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Email Address</label>
                        {editMode ? (
                          <input
                            type="email"
                            value={tempUser.email}
                            onChange={(e) => updateTemp("email", e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-sm"
                            aria-label="Email address"
                          />
                        ) : (
                          <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl break-words">
                            {user.email}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 min-w-0">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Phone Number</label>
                        {editMode ? (
                          <input
                            type="tel"
                            value={tempUser.phone}
                            onChange={(e) => updateTemp("phone", e.target.value)}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-sm"
                            aria-label="Phone number"
                          />
                        ) : (
                          <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">
                            {user.phone}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 min-w-0">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Member Since</label>
                        <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">
                          {user.joinedDate}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-700">Address</label>
                      {editMode ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Address / Landmark"
                            value={tempUser.addressObj.landMark}
                            onChange={(e) => updateTemp("addressObj.landMark", e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 text-sm outline-none"
                            aria-label="Address or landmark"
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="City"
                              value={tempUser.addressObj.city}
                              onChange={(e) => updateTemp("addressObj.city", e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 text-sm outline-none w-full"
                              aria-label="City"
                            />
                            <input
                              type="text"
                              placeholder="Pincode"
                              value={tempUser.addressObj.pincode}
                              onChange={(e) => updateTemp("addressObj.pincode", e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 text-sm outline-none w-full"
                              aria-label="Pincode"
                            />
                            <input
                              type="text"
                              placeholder="District / State (optional)"
                              value={tempUser.addressObj.districtName ?? tempUser.addressObj.districtId ?? ""}
                              onChange={(e) => updateTemp("addressObj.districtName", e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 text-sm outline-none w-full"
                              aria-label="District or state"
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">
                          {[
                            user.addressObj?.landMark,
                            user.addressObj?.city,
                            user.addressObj?.pincode,
                          ].filter(Boolean).join(", ")}
                        </p>
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

              {/* Address Tab */}
              {activeTab === "address" && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <MapPin size={20} className="text-pink-600" />
                        <div className="min-w-0">
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Addresses</h2>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your saved addresses</p>
                        </div>
                      </div>
                    </div>

                    {/* actions: add/edit/save/cancel */}
                    <div className="flex gap-2 w-full sm:w-auto">
                      {!addressEditMode ? (
                        <button
                          onClick={() => openAddAddress()}
                          className="flex-none px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:opacity-90 transition-all"
                          aria-label="Add address"
                          type="button"
                        >
                          ➕ Add Address
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={handleSaveAddress}
                            disabled={savingAddress}
                            aria-disabled={savingAddress}
                            className={
                              "flex-none px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:opacity-90 transition-all " +
                              (savingAddress ? "opacity-70 cursor-not-allowed" : "")
                            }
                            style={{ minWidth: 110 }}
                          >
                            {savingAddress ? "Saving…" : "✓ Save"}
                          </button>
                          <button
                            onClick={handleCancelAddress}
                            type="button"
                            className="flex-none px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                            style={{ minWidth: 110 }}
                          >
                            ✕ Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left column: address list */}
                      <div className="lg:col-span-1 space-y-3">
                        {addresses.length === 0 ? (
                          <div className="p-4 rounded-xl bg-gray-50 text-sm text-gray-600">No addresses yet — click Add Address to create one.</div>
                        ) : (
                          addresses.map((a) => (
                            <button
                              key={a.id}
                              onClick={() => selectAddress(a.id)}
                              className={`w-full text-left p-3 rounded-xl border ${selectedAddressId === a.id ? "border-pink-300 bg-pink-50" : "border-gray-100 bg-white"
                                }`}
                              type="button"
                            >
                              <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">{a.label || (a.landMark ? a.landMark : "Address")}</div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {[a.landMark, a.city, a.pincode].filter(Boolean).join(", ")}
                                  </div>
                                </div>
                                {a.isDefault && <span className="text-xs text-pink-600 font-medium ml-3">Default</span>}
                              </div>
                            </button>
                          ))
                        )}
                      </div>

                      {/* Right column: selected / edit form */}
                      <div className="lg:col-span-2">
                        <div className="space-y-4 sm:space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2 min-w-0">
                              <label className="text-xs sm:text-sm font-medium text-gray-700">Label</label>
                              {!addressEditMode ? (
                                <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">
                                  {selectedAddress?.label ?? "—"}
                                </p>
                              ) : (
                                <input
                                  type="text"
                                  value={tempAddress.label}
                                  onChange={(e) => setTempAddress((t) => ({ ...t, label: e.target.value }))}
                                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-sm"
                                  placeholder="e.g. Home, Work"
                                />
                              )}
                            </div>

                            <div className="space-y-2 min-w-0">
                              <label className="text-xs sm:text-sm font-medium text-gray-700">Phone</label>
                              {!addressEditMode ? (
                                <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">
                                  {selectedAddress?.phone ?? "—"}
                                </p>
                              ) : (
                                <input
                                  type="tel"
                                  value={tempAddress.phone}
                                  onChange={(e) => setTempAddress((t) => ({ ...t, phone: e.target.value }))}
                                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-sm"
                                  placeholder="+91 98765 43210"
                                />
                              )}
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs sm:text-sm font-medium text-gray-700">Address / Landmark</label>
                              {!addressEditMode ? (
                                <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">
                                  {selectedAddress?.landMark ?? "—"}
                                </p>
                              ) : (
                                <input
                                  type="text"
                                  value={tempAddress.landMark}
                                  onChange={(e) => setTempAddress((t) => ({ ...t, landMark: e.target.value }))}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 text-sm outline-none"
                                  placeholder="Street, house no., landmark"
                                />
                              )}
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs sm:text-sm font-medium text-gray-700">City</label>
                              {!addressEditMode ? (
                                <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">
                                  {selectedAddress?.city ?? "—"}
                                </p>
                              ) : (
                                <input
                                  type="text"
                                  value={tempAddress.city}
                                  onChange={(e) => setTempAddress((t) => ({ ...t, city: e.target.value }))}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 text-sm outline-none"
                                  placeholder="City"
                                />
                              )}
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs sm:text-sm font-medium text-gray-700">Pincode</label>
                              {!addressEditMode ? (
                                <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">
                                  {selectedAddress?.pincode ?? "—"}
                                </p>
                              ) : (
                                <input
                                  type="text"
                                  value={tempAddress.pincode}
                                  onChange={(e) => setTempAddress((t) => ({ ...t, pincode: e.target.value }))}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 text-sm outline-none"
                                  placeholder="400001"
                                />
                              )}
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs sm:text-sm font-medium text-gray-700">District / State (optional)</label>
                              {!addressEditMode ? (
                                <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">
                                  {selectedAddress?.districtName ?? selectedAddress?.districtId ?? "—"}
                                </p>
                              ) : (
                                <input
                                  type="text"
                                  value={tempAddress.districtName ?? tempAddress.districtId ?? ""}
                                  onChange={(e) => setTempAddress((t) => ({ ...t, districtName: e.target.value }))}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 text-sm outline-none"
                                  placeholder="District or State"
                                />
                              )}
                            </div>
                          </div>

                          {/* default checkbox + actions row (when not editing show edit/delete/manage) */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {!addressEditMode ? (
                                <button
                                  onClick={() => startEditSelectedAddress()}
                                  className="px-3 py-2 rounded-xl text-sm font-medium text-pink-600 hover:bg-pink-50 transition-all"
                                  type="button"
                                >
                                  ✏️ Edit
                                </button>
                              ) : (
                                <label className="inline-flex items-center gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={tempAddress.isDefault || false}
                                    onChange={(e) => setTempAddress((t) => ({ ...t, isDefault: e.target.checked }))}
                                    className="rounded accent-pink-500"
                                  />
                                  <span className="text-sm text-gray-700">Set as default</span>
                                </label>
                              )}
                            </div>

                            {!addressEditMode ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => deleteAddress(selectedAddressId)}
                                  className="px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                                  type="button"
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            ) : (
                              <div className="text-sm text-red-500">{addressError}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

{/* Address Tab */}
{activeTab === "address" && (
  <div>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <MapPin size={20} className="text-pink-600" />
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Addresses</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your saved addresses</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        {!addressEditMode ? (
          <button
            onClick={openAddAddress}
            className="flex-none px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:opacity-90 transition-all"
            aria-label="Add address"
            type="button"
          >
            ➕ Add Address
          </button>
        ) : (
          <>
            <button
              onClick={handleSaveAddress}
              disabled={savingAddress}
              aria-disabled={savingAddress}
              className={
                "flex-none px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:opacity-90 transition-all " +
                (savingAddress ? "opacity-70 cursor-not-allowed" : "")
              }
              style={{ minWidth: 110 }}
              type="button"
            >
              {savingAddress ? "Saving…" : "✓ Save"}
            </button>
            <button
              onClick={handleCancelAddress}
              type="button"
              className="flex-none px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
              style={{ minWidth: 110 }}
            >
              ✕ Cancel
            </button>
          </>
        )}
      </div>
    </div>

    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: address list */}
        <div className="lg:col-span-1 space-y-3">
          {loadingAddresses ? (
            <div className="p-4 rounded-xl bg-gray-50 text-sm text-gray-600">Loading addresses…</div>
          ) : addresses.length === 0 ? (
            <div className="p-4 rounded-xl bg-gray-50 text-sm text-gray-600">No addresses yet — click Add Address to create one.</div>
          ) : (
            addresses.map((a) => (
              <button
                key={a.id}
                onClick={() => selectAddress(a.id)}
                className={`w-full text-left p-3 rounded-xl border ${selectedAddressId === a.id ? "border-pink-300 bg-pink-50" : "border-gray-100 bg-white"}`}
                type="button"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{a.label || (a.landmark ? a.landmark : "Address")}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {[a.landmark, a.city, a.pincode].filter(Boolean).join(", ")}
                    </div>
                  </div>
                  {a.isDefault && <span className="text-xs text-pink-600 font-medium ml-3">Default</span>}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Right column: selected / edit form */}
        <div className="lg:col-span-2">
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 min-w-0">
                <label className="text-xs sm:text-sm font-medium text-gray-700">Label</label>
                {!addressEditMode ? (
                  <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">{selectedAddress?.label ?? "—"}</p>
                ) : (
                  <input
                    type="text"
                    value={tempAddress.label}
                    onChange={(e) => setTempAddress((t) => ({ ...t, label: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="e.g. Home, Work"
                  />
                )}
              </div>

              <div className="space-y-2 min-w-0">
                <label className="text-xs sm:text-sm font-medium text-gray-700">Phone</label>
                {!addressEditMode ? (
                  <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">{selectedAddress?.phone ?? "—"}</p>
                ) : (
                  <input
                    type="tel"
                    value={tempAddress.phone}
                    onChange={(e) => setTempAddress((t) => ({ ...t, phone: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="+91 98765 43210"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">Address / Landmark</label>
                {!addressEditMode ? (
                  <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">{selectedAddress?.landmark ?? "—"}</p>
                ) : (
                  <input
                    type="text"
                    value={tempAddress.landmark}
                    onChange={(e) => setTempAddress((t) => ({ ...t, landmark: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 text-sm outline-none"
                    placeholder="Street, house no., landmark"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">City</label>
                {!addressEditMode ? (
                  <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">{selectedAddress?.city ?? "—"}</p>
                ) : (
                  <input
                    type="text"
                    value={tempAddress.city}
                    onChange={(e) => setTempAddress((t) => ({ ...t, city: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 text-sm outline-none"
                    placeholder="City"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">Pincode</label>
                {!addressEditMode ? (
                  <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">{selectedAddress?.pincode ?? "—"}</p>
                ) : (
                  <input
                    type="text"
                    value={tempAddress.pincode}
                    onChange={(e) => setTempAddress((t) => ({ ...t, pincode: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 text-sm outline-none"
                    placeholder="400001"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">District / State (optional)</label>
                {!addressEditMode ? (
                  <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">{selectedAddress?.districtName ?? selectedAddress?.districtId ?? "—"}</p>
                ) : (
                  <input
                    type="text"
                    value={tempAddress.districtName ?? tempAddress.districtId ?? ""}
                    onChange={(e) => setTempAddress((t) => ({ ...t, districtName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 text-sm outline-none"
                    placeholder="District or State"
                  />
                )}
              </div>
            </div>

            {/* default checkbox + actions row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {!addressEditMode ? (
                  <button
                    onClick={startEditSelectedAddress}
                    className="px-3 py-2 rounded-xl text-sm font-medium text-pink-600 hover:bg-pink-50 transition-all"
                    type="button"
                  >
                    ✏️ Edit
                  </button>
                ) : (
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={tempAddress.isDefault || false}
                      onChange={(e) => setTempAddress((t) => ({ ...t, isDefault: e.target.checked }))}
                      className="rounded accent-pink-500"
                    />
                    <span className="text-sm text-gray-700">Set as default</span>
                  </label>
                )}
              </div>

              {!addressEditMode ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteAddress(selectedAddressId)}
                    className="px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                    type="button"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ) : (
                <div className="text-sm text-red-500">{addressError}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
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

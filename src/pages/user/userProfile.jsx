import React, { useEffect, useState, useCallback } from "react";
import { buildHeaders } from "../../components/auth/auth";
import {
  User, PawPrint, ShoppingBag, MapPin, Heart, Settings, Lock, Bell, ShoppingCart, Shield, Menu,
  LogOut, Plus, Trash2, Edit2, Check, X, ChevronRight,
  Package, AlertCircle, Loader2, Phone, Home,
  Building2, MapPinned, Star
} from "lucide-react";

const API = process.env.REACT_APP_API_URL;

// ─── Constants ─────────────────────────────────────────────
const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "pets", label: "My Pets", icon: PawPrint },
  { id: "address", label: "Address", icon: MapPin },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];

const PET_TYPES = [
  { value: "Dog", label: "Dog", icon: "dog" },
  { value: "Cat", label: "Cat", icon: "cat" },
  { value: "Bird", label: "Bird", icon: "bird" },
  { value: "Fish", label: "Fish", icon: "fish" },
  { value: "Rabbit", label: "Rabbit", icon: "rabbit" },
  { value: "Other", label: "Other", icon: "paw" },
];

const ORDER_STATUS_STYLES = {
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Shipped: "bg-blue-50 text-blue-700 border-blue-200",
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Pending: "bg-gray-50 text-gray-700 border-gray-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const INITIAL_ADDRESS = {
  id: null,
  label: "",
  landMark: "",
  city: "",
  pincode: "",
  districtName: "",
  phone: "",
  isDefault: false,
};

// ─── Sub-Components ──────────────────────────────────────

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-blue-50">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
      <p className="text-sm text-gray-500">Loading profile...</p>
    </div>
  </div>
);

const ErrorScreen = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-blue-50">
    <div className="text-center">
      <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
      <p className="text-red-600 font-medium">{message}</p>
    </div>
  </div>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {action && <div className="w-full sm:w-auto">{action}</div>}
  </div>
);

const GradientButton = ({ children, onClick, disabled, type = "button", className = "" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:opacity-90 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const SecondaryButton = ({ children, onClick, disabled, type = "button", className = "" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all disabled:opacity-60 ${className}`}
  >
    {children}
  </button>
);

const DangerButton = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all ${className}`}
  >
    {children}
  </button>
);

const InputField = ({ label, value, onChange, type = "text", placeholder, disabled, required, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {label && <label className="text-xs sm:text-sm font-medium text-gray-700">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-sm disabled:bg-gray-50"
    />
  </div>
);

const DisplayField = ({ label, value }) => (
  <div className="space-y-2">
    {label && <label className="text-xs sm:text-sm font-medium text-gray-700">{label}</label>}
    <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">
      {value || "—"}
    </p>
  </div>
);

const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="text-center py-12 sm:py-16">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className="h-8 w-8 text-gray-400" />
    </div>
    <p className="text-sm sm:text-base font-medium text-gray-900 mb-1">{title}</p>
    <p className="text-xs sm:text-sm text-gray-500">{message}</p>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap ${ORDER_STATUS_STYLES[status] || ORDER_STATUS_STYLES.Pending}`}>
    {status}
  </span>
);

const PetTypeIcon = ({ type }) => {
  const colors = {
    Dog: "from-amber-100 to-orange-100 text-amber-600",
    Cat: "from-pink-100 to-rose-100 text-pink-600",
    Bird: "from-sky-100 to-blue-100 text-sky-600",
    Fish: "from-cyan-100 to-teal-100 text-cyan-600",
    Rabbit: "from-emerald-100 to-green-100 text-emerald-600",
    Other: "from-gray-100 to-slate-100 text-gray-600",
  };
  return (
    <div className={`h-10 sm:h-12 w-10 sm:w-12 rounded-xl bg-gradient-to-br ${colors[type] || colors.Other} flex items-center justify-center flex-shrink-0`}>
      <PawPrint className="h-5 w-5 sm:h-6 sm:w-6" />
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────
const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [tempUser, setTempUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [pets, setPets] = useState([]);
  const [showPetForm, setShowPetForm] = useState(false);
  const [newPet, setNewPet] = useState({ name: "", type: "Dog", breed: "", age: "" });
  const [savingPet, setSavingPet] = useState(false);

  const [wishlist, setWishlist] = useState([
    { id: 1, name: "Premium Dog Food", price: 1999, image: "food" },
    { id: 2, name: "Cat Scratching Post", price: 3299, image: "toy" },
    { id: 3, name: "Pet Carrier Bag", price: 2499, image: "bag" },
  ]);

  const [orders] = useState([
    { id: "ORD123", date: "2025-10-14", items: 3, total: 4999, status: "Delivered" },
    { id: "ORD124", date: "2025-10-15", items: 1, total: 1999, status: "Shipped" },
    { id: "ORD125", date: "2025-10-18", items: 2, total: 3499, status: "Processing" },
  ]);

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressEditMode, setAddressEditMode] = useState(false);
  const [tempAddress, setTempAddress] = useState({ ...INITIAL_ADDRESS });
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // ─── Data Loading ──────────────────────────────────────
  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please login first");

        const res = await fetch(`${API}/api/users/me`, {
          headers: buildHeaders(),
        });

        if (!res.ok) throw new Error(`Failed to load user (${res.status})`);

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
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Load addresses and pets when user is available
  useEffect(() => {
    if (!user) return;

    const loadAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const res = await fetch(`${API}/api/addresses`, { headers: buildHeaders() });
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.items ?? [];
        setAddresses(list);
        if (list.length > 0) {
          setSelectedAddressId(list[0].id);
          setSelectedAddress(list[0]);
          setTempAddress({ ...list[0] });
        }
      } catch (e) {
        console.error("Failed to load addresses", e);
      } finally {
        setLoadingAddresses(false);
      }
    };

    const loadPets = async () => {
      try {
        const res = await fetch(`${API}/api/pets`, { headers: buildHeaders() });
        if (res.ok) setPets(await res.json());
      } catch (error) {
        console.error("Failed to load pets", error);
      }
    };

    loadAddresses();
    loadPets();
  }, [user]);

  // ─── Profile Handlers ──────────────────────────────────
  const handleEditToggle = useCallback(() => {
    if (editMode) {
      setTempUser(user ? JSON.parse(JSON.stringify(user)) : null);
    }
    setEditMode(!editMode);
  }, [editMode, user]);

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
        headers: { ...buildHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);

      const updated = await res.json();
      const mapped = {
        id: updated.id,
        fullName: updated.fullName || "",
        email: updated.address?.email || "",
        phone: updated.address?.mobileNo || "",
        addressObj: {
          landMark: updated.address?.landMark || "",
          city: updated.address?.city || "",
          pincode: updated.address?.pincode || "",
          districtId: updated.address?.districtId || null,
        },
        joinedDate: user.joinedDate,
        raw: updated,
      };
      setUser(mapped);
      setTempUser(JSON.parse(JSON.stringify(mapped)));
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const updateTemp = useCallback((path, value) => {
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
  }, []);

  // ─── Pet Handlers ────────────────────────────────────────
  const handleAddPet = async (e) => {
    e.preventDefault();
    setSavingPet(true);
    try {
      const res = await fetch(`${API}/api/pets`, {
        method: "POST",
        headers: { ...buildHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPet.name,
          type: newPet.type,
          breed: newPet.breed,
          age: Number(newPet.age) || 1,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setPets((prev) => [...prev, saved]);
        setShowPetForm(false);
        setNewPet({ name: "", type: "Dog", breed: "", age: "" });
      } else {
        alert("Failed to save pet");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPet(false);
    }
  };

  const handleRemovePet = async (id) => {
    if (!window.confirm("Remove this pet?")) return;
    try {
      const res = await fetch(`${API}/api/pets/${id}`, {
        method: "DELETE",
        headers: buildHeaders(),
      });
      if (res.ok) setPets((p) => p.filter((x) => x.id !== id));
      else alert("Failed to delete pet");
    } catch (e) {
      console.error(e);
    }
  };

  // ─── Address Handlers ────────────────────────────────────

  const openAddAddress = useCallback(() => {
    setSelectedAddressId(null);
    setSelectedAddress(null);
    setTempAddress({ ...INITIAL_ADDRESS });
    setAddressEditMode(true);
    setAddressError("");
  }, []);

  const startEditAddress = useCallback(() => {
    if (!selectedAddress) return;
    setTempAddress({ ...selectedAddress });
    setAddressEditMode(true);
    setAddressError("");
  }, [selectedAddress]);

  const cancelAddressEdit = useCallback(() => {
    setTempAddress(selectedAddress ? { ...selectedAddress } : { ...INITIAL_ADDRESS });
    setAddressEditMode(false);
    setAddressError("");
  }, [selectedAddress]);

  const validateAddress = (a) => {
    if (!a.label?.trim()) return "Enter a label (Home / Work)";
    if (!a.landMark?.trim()) return "Enter address / landmark";
    if (!a.city?.trim()) return "Enter city";
    if (!a.pincode?.trim()) return "Enter pincode";
    if (!/^\d{4,6}$/.test(a.pincode)) return "Invalid pincode";
    if (a.phone && !/^\+?\d{7,15}$/.test(a.phone)) return "Invalid phone number";
    return "";
  };

  const handleSaveAddress = async () => {
    setAddressError("");
    const error = validateAddress(tempAddress);
    if (error) {
      setAddressError(error);
      return;
    }

    setSavingAddress(true);
    try {
      const isUpdate = !!tempAddress.id;
      const url = isUpdate
        ? `${API}/api/addresses/${encodeURIComponent(tempAddress.id)}`
        : `${API}/api/addresses`;

      const res = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { ...buildHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(tempAddress),
      });

      if (!res.ok) throw new Error(`${isUpdate ? "Update" : "Create"} failed (${res.status})`);

      const result = await res.json();
      const saved = result.id ? result : { ...tempAddress, id: Date.now().toString() };

      if (isUpdate) {
        setAddresses((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      } else {
        setAddresses((prev) => [saved, ...prev]);
      }

      if (tempAddress.isDefault) {
        setAddresses((prev) => prev.map((p) => ({ ...p, isDefault: p.id === saved.id })));
      }

      setSelectedAddress(saved);
      setSelectedAddressId(saved.id);
      setAddressEditMode(false);
    } catch (e) {
      console.error("Save address failed", e);
      setAddressError("Failed to save address. Please try again.");
    } finally {
      setSavingAddress(false);
    }
  };

  const deleteAddress = async (id) => {
    if (!id || !window.confirm("Delete this address?")) return;
    try {
      const res = await fetch(`${API}/api/addresses/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: buildHeaders(),
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);

      setAddresses((prev) => {
        const next = prev.filter((p) => p.id !== id);
        const nextSelected = next[0] || null;
        setSelectedAddress(nextSelected);
        setSelectedAddressId(nextSelected?.id || null);
        return next;
      });
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  // ─── Wishlist Handler ──────────────────────────────────
  const handleRemoveFromWishlist = useCallback((id) => {
    setWishlist((w) => w.filter((item) => item.id !== id));
  }, []);

  // ─── Logout Handler ────────────────────────────────────
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    window.location.href = "/login";
  }, []);

  // ─── Render Helpers ────────────────────────────────────
  const renderSidebar = () => (
    <aside className="lg:col-span-3">
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:static lg:w-auto lg:h-auto lg:bg-transparent lg:shadow-none lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="bg-white lg:rounded-2xl lg:shadow-sm lg:border border-gray-100 overflow-y-auto h-full lg:h-auto lg:overflow-hidden lg:sticky lg:top-24 flex flex-col">
          {/* Profile Card */}
          <div className="bg-gradient-to-br from-pink-500 to-blue-500 p-4 sm:p-6 text-white flex-shrink-0">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="h-16 sm:h-20 w-16 sm:w-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-2xl sm:text-3xl font-bold">
                  {user?.fullName ? user.fullName[0].toUpperCase() : "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 sm:h-6 w-5 sm:w-6 bg-emerald-400 rounded-full border-4 border-white" />
              </div>
              <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold">{user?.fullName}</h3>
              <p className="text-xs sm:text-sm text-white/80 mt-1 break-all">{user?.email}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3 sm:p-4">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
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
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{tab.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 sm:p-4 border-t border-gray-100 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );

  const renderProfileTab = () => (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">My Profile</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your personal information</p>
        </div>

        {editMode ? (
          <div className="flex gap-2 w-full sm:w-auto">
            <GradientButton onClick={handleSaveProfile} disabled={saving}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Save
                </span>
              )}
            </GradientButton>
            <SecondaryButton onClick={handleEditToggle}>
              <span className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </span>
            </SecondaryButton>
          </div>
        ) : (
          <SecondaryButton onClick={handleEditToggle} className="text-pink-600 hover:bg-pink-50">
            <span className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </span>
          </SecondaryButton>
        )}
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {editMode ? (
            <>
              <InputField
                label="Full Name"
                value={tempUser?.fullName || ""}
                onChange={(e) => updateTemp("fullName", e.target.value)}
              />
              <InputField
                label="Email Address"
                type="email"
                value={tempUser?.email || ""}
                onChange={(e) => updateTemp("email", e.target.value)}
              />
              <InputField
                label="Phone Number"
                type="tel"
                value={tempUser?.phone || ""}
                onChange={(e) => updateTemp("phone", e.target.value)}
              />
              <DisplayField label="Member Since" value={user?.joinedDate} />
            </>
          ) : (
            <>
              <DisplayField label="Full Name" value={user?.fullName} />
              <DisplayField label="Email Address" value={user?.email} />
              <DisplayField label="Phone Number" value={user?.phone} />
              <DisplayField label="Member Since" value={user?.joinedDate} />
            </>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700">Address</label>
          {editMode ? (
            <div className="space-y-3">
              <InputField
                placeholder="Address / Landmark"
                value={tempUser?.addressObj?.landMark || ""}
                onChange={(e) => updateTemp("addressObj.landMark", e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <InputField
                  placeholder="City"
                  value={tempUser?.addressObj?.city || ""}
                  onChange={(e) => updateTemp("addressObj.city", e.target.value)}
                />
                <InputField
                  placeholder="Pincode"
                  value={tempUser?.addressObj?.pincode || ""}
                  onChange={(e) => updateTemp("addressObj.pincode", e.target.value)}
                />
                <InputField
                  placeholder="District / State"
                  value={tempUser?.addressObj?.districtName || tempUser?.addressObj?.districtId || ""}
                  onChange={(e) => updateTemp("addressObj.districtName", e.target.value)}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">
              {[user?.addressObj?.landMark, user?.addressObj?.city, user?.addressObj?.pincode]
                .filter(Boolean)
                .join(", ") || "—"}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderPetsTab = () => (
    <div>
      <SectionHeader
        title="My Pets"
        subtitle="Manage your beloved companions"
        action={
          <GradientButton onClick={() => setShowPetForm(true)}>
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Pet
            </span>
          </GradientButton>
        }
      />

      {showPetForm && (
        <form onSubmit={handleAddPet} className="bg-pink-50 p-4 sm:p-6 rounded-2xl border border-pink-100 mb-6 space-y-4">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Register a New Pet</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              placeholder="Pet Name"
              value={newPet.name}
              onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
              required
            />
            <select
              value={newPet.type}
              onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm"
            >
              {PET_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <InputField
              placeholder="Breed"
              value={newPet.breed}
              onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
              required
            />
            <InputField
              type="number"
              placeholder="Age (Years)"
              value={newPet.age}
              onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
              required
              min="0"
              max="50"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <SecondaryButton onClick={() => setShowPetForm(false)} type="button">
              Cancel
            </SecondaryButton>
            <GradientButton type="submit" disabled={savingPet}>
              {savingPet ? "Saving..." : "Save Pet"}
            </GradientButton>
          </div>
        </form>
      )}

      {pets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No pets added yet"
          message="Add your first pet to keep track of their needs"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="group relative bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <PetTypeIcon type={pet.type} />
                <button
                  onClick={() => handleRemovePet(pet.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{pet.name}</h3>
              <div className="space-y-1 text-xs sm:text-sm text-gray-500">
                <p>{pet.breed} • {pet.type}</p>
                <p>{pet.age} {pet.age === 1 ? "year" : "years"} old</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAddressTab = () => (
    <div>
      <SectionHeader
        title="Addresses"
        subtitle="Manage your saved addresses"
        action={
          !addressEditMode ? (
            <GradientButton onClick={openAddAddress}>
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Address
              </span>
            </GradientButton>
          ) : (
            <div className="flex gap-2">
              <GradientButton onClick={handleSaveAddress} disabled={savingAddress}>
                {savingAddress ? "Saving..." : <span className="flex items-center gap-2"><Check className="h-4 w-4" />Save</span>}
              </GradientButton>
              <SecondaryButton onClick={cancelAddressEdit}>
                <span className="flex items-center gap-2"><X className="h-4 w-4" />Cancel</span>
              </SecondaryButton>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Address List */}
        <div className="lg:col-span-1 space-y-3">
          {loadingAddresses ? (
            <div className="p-4 rounded-xl bg-gray-50 text-sm text-gray-600 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading addresses...
            </div>
          ) : addresses.length === 0 ? (
            <div className="p-4 rounded-xl bg-gray-50 text-sm text-gray-600">
              No addresses yet. Click Add Address to create one.
            </div>
          ) : (
            addresses.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setSelectedAddressId(a.id);
                  setSelectedAddress(a);
                  setTempAddress({ ...a });
                  setAddressEditMode(false);
                  setAddressError("");
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all ${selectedAddressId === a.id
                  ? "border-pink-300 bg-pink-50"
                  : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate flex items-center gap-2">
                      <Home className="h-3 w-3 text-gray-400" />
                      {a.label || a.landMark || "Address"}
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-1">
                      {[a.landMark, a.city, a.pincode].filter(Boolean).join(", ")}
                    </div>
                  </div>
                  {a.isDefault && (
                    <span className="text-xs text-pink-600 font-medium ml-2 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-pink-600" />
                      Default
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Address Detail / Form */}
        <div className="lg:col-span-2">
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 min-w-0">
                <label className="text-xs sm:text-sm font-medium text-gray-700">Label</label>
                {!addressEditMode ? (
                  <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl flex items-center gap-2">
                    <Home className="h-4 w-4 text-gray-400" />
                    {selectedAddress?.label || "—"}
                  </p>
                ) : (
                  <InputField
                    value={tempAddress.label}
                    onChange={(e) => setTempAddress((t) => ({ ...t, label: e.target.value }))}
                    placeholder="e.g. Home, Work"
                  />
                )}
              </div>

              <div className="space-y-2 min-w-0">
                <label className="text-xs sm:text-sm font-medium text-gray-700">Phone</label>
                {!addressEditMode ? (
                  <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {selectedAddress?.phone || "—"}
                  </p>
                ) : (
                  <InputField
                    type="tel"
                    value={tempAddress.phone}
                    onChange={(e) => setTempAddress((t) => ({ ...t, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">Address / Landmark</label>
                {!addressEditMode ? (
                  <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl flex items-center gap-2">
                    <MapPinned className="h-4 w-4 text-gray-400" />
                    {selectedAddress?.landMark || "—"}
                  </p>
                ) : (
                  <InputField
                    value={tempAddress.landMark}
                    onChange={(e) => setTempAddress((t) => ({ ...t, landMark: e.target.value }))}
                    placeholder="Street, house no., landmark"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">City</label>
                {!addressEditMode ? (
                  <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    {selectedAddress?.city || "—"}
                  </p>
                ) : (
                  <InputField
                    value={tempAddress.city}
                    onChange={(e) => setTempAddress((t) => ({ ...t, city: e.target.value }))}
                    placeholder="City"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">Pincode</label>
                {!addressEditMode ? (
                  <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {selectedAddress?.pincode || "—"}
                  </p>
                ) : (
                  <InputField
                    value={tempAddress.pincode}
                    onChange={(e) => setTempAddress((t) => ({ ...t, pincode: e.target.value }))}
                    placeholder="400001"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">District / State</label>
                {!addressEditMode ? (
                  <p className="text-sm sm:text-base text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl">
                    {selectedAddress?.districtName || selectedAddress?.districtId || "—"}
                  </p>
                ) : (
                  <InputField
                    value={tempAddress.districtName || ""}
                    onChange={(e) => setTempAddress((t) => ({ ...t, districtName: e.target.value }))}
                    placeholder="District or State"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                {!addressEditMode ? (
                  <SecondaryButton onClick={startEditAddress} className="text-pink-600 hover:bg-pink-50">
                    <span className="flex items-center gap-2">
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </span>
                  </SecondaryButton>
                ) : (
                  <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempAddress.isDefault || false}
                      onChange={(e) => setTempAddress((t) => ({ ...t, isDefault: e.target.checked }))}
                      className="rounded accent-pink-500 h-4 w-4"
                    />
                    <span className="text-gray-700">Set as default address</span>
                  </label>
                )}
              </div>

              {!addressEditMode ? (
                <DangerButton onClick={() => deleteAddress(selectedAddressId)}>
                  <span className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </span>
                </DangerButton>
              ) : (
                <div className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {addressError}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div>
      <SectionHeader title="Order History" subtitle="Track and manage your orders" />
      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          message="Your order history will appear here"
        />
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Order #{order.id}</h3>
                    <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
                      <span>{order.date}</span>
                      <span>{order.items} {order.items === 1 ? "item" : "items"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-base sm:text-lg font-bold text-gray-900">₹{order.total}</span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWishlistTab = () => (
    <div>
      <SectionHeader title="My Wishlist" subtitle="Items you love and want to buy" />
      {wishlist.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          message="Save items you love to purchase later"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="h-14 sm:h-16 w-14 sm:w-16 rounded-xl bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-pink-400" />
                </div>
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{item.name}</h3>
              <p className="text-base sm:text-lg font-bold text-pink-600 mb-4">₹{item.price}</p>
              <GradientButton className="w-full">
                <span className="flex items-center justify-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </span>
              </GradientButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div>
      <SectionHeader title="Account Settings" subtitle="Manage your account preferences" />
      <div className="space-y-3 sm:space-y-4">
        {[
          { title: "Password & Security", desc: "Update your password and security settings", action: "Change Password", icon: Lock },
          { title: "Notifications", desc: "Manage your notification preferences", action: "Notification Settings", icon: Bell },
          { title: "Privacy", desc: "Control your privacy and data settings", action: "Privacy Settings", icon: Shield },
        ].map((setting) => (
          <div key={setting.title} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                <setting.icon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{setting.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{setting.desc}</p>
                <SecondaryButton>{setting.action}</SecondaryButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── Main Render ───────────────────────────────────────
  if (loading) return <LoadingScreen />;
  if (!user) return <ErrorScreen message="Please login to view your profile" />;

  const tabContent = {
    profile: renderProfileTab,
    pets: renderPetsTab,
    address: renderAddressTab,
    orders: renderOrdersTab,
    wishlist: renderWishlistTab,
    settings: renderSettingsTab,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between col-span-full mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pet Profile</h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {renderSidebar()}

          <main className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
              {tabContent[activeTab]()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

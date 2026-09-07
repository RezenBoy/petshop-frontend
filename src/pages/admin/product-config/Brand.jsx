import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, X, Edit2, Trash2 } from "lucide-react";

const API = process.env.REACT_APP_API_URL;

const API_BASE = `${API}/api/admin/brands`;

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editBrand, setEditBrand] = useState(null);

  const [newBrand, setNewBrand] = useState({
    brandName: "",
    description: "",
    active: true,
  });

  // ✅ Fetch brands on load
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await axios.get(API_BASE);
      setBrands(res.data);
    } catch (err) {
      console.error("Failed to fetch brands", err.response?.data || err.message);
    }
  };

  // ✅ Add Brand
  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!newBrand.brandName) return;

    try {
      await axios.post(API_BASE, newBrand, {
        headers: { "Content-Type": "application/json" },
      });
      await fetchBrands();
      setNewBrand({ brandName: "", description: "", active: true });
      setShowBrandModal(false);
    } catch (err) {
      console.error("Failed to add brand", err.response?.data || err.message);
    }
  };

  // ✅ Edit Brand
  const handleEditBrand = async (e) => {
    e.preventDefault();
    if (!editBrand?.id) return;

    try {
      await axios.put(`${API_BASE}/${editBrand.id}`, editBrand, {
        headers: { "Content-Type": "application/json" },
      });
      await fetchBrands();
      setEditBrand(null);
    } catch (err) {
      console.error("Failed to edit brand", err.response?.data || err.message);
    }
  };

  // ✅ Delete Brand
  const handleDeleteBrand = async (id) => {
    if (!window.confirm("Delete this brand?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      await fetchBrands();
    } catch (err) {
      console.error("Failed to delete brand", err.response?.data || err.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-text">Brands</h1>
        <button
          onClick={() => setShowBrandModal(true)}
          className="flex items-center bg-primary text-surface px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Brand
        </button>
      </div>

      {/* Brands Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-textMuted">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-textMuted">Brand Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-textMuted">Description</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-textMuted">Active</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-textMuted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {brands.map((brand, idx) => (
              <tr key={brand.id} className="hover:bg-background/60 transition-colors">
                <td className="px-6 py-4 text-textMuted">{idx + 1}</td>
                <td className="px-6 py-4 font-medium text-text">{brand.brandName}</td>
                <td className="px-6 py-4 text-textMuted">{brand.description}</td>
                <td className="px-6 py-4 text-text">{brand.active ? "Yes" : "No"}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => setEditBrand(brand)}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <Edit2 className="inline w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBrand(brand.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="inline w-4 h-4" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Brand Modal */}
      {showBrandModal && (
        <Modal onClose={() => setShowBrandModal(false)} title="Add Brand">
          <form onSubmit={handleAddBrand} className="space-y-4">
            <input
              type="text"
              placeholder="Brand Name"
              value={newBrand.brandName}
              onChange={(e) => setNewBrand({ ...newBrand, brandName: e.target.value })}
              className="w-full p-2 border border-border bg-surface text-text rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Description"
              value={newBrand.description}
              onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
              className="w-full p-2 border border-border bg-surface text-text rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <label className="flex items-center space-x-2 text-text">
              <input
                type="checkbox"
                checked={newBrand.active}
                onChange={(e) => setNewBrand({ ...newBrand, active: e.target.checked })}
                className="accent-primary"
              />
              <span>Active</span>
            </label>
            <button
              type="submit"
              className="w-full bg-primary text-surface px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
            >
              Save
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Brand Modal */}
      {editBrand && (
        <Modal onClose={() => setEditBrand(null)} title="Edit Brand">
          <form onSubmit={handleEditBrand} className="space-y-4">
            <input
              type="text"
              value={editBrand.brandName || ""}
              onChange={(e) => setEditBrand({ ...editBrand, brandName: e.target.value })}
              className="w-full p-2 border border-border bg-surface text-text rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              value={editBrand.description || ""}
              onChange={(e) => setEditBrand({ ...editBrand, description: e.target.value })}
              className="w-full p-2 border border-border bg-surface text-text rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <label className="flex items-center space-x-2 text-text">
              <input
                type="checkbox"
                checked={editBrand.active}
                onChange={(e) => setEditBrand({ ...editBrand, active: e.target.checked })}
                className="accent-primary"
              />
              <span>Active</span>
            </label>
            <button
              type="submit"
              className="w-full bg-primary text-surface px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
            >
              Update
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

// Reusable Modal
const Modal = ({ children, onClose, title }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-surface rounded-lg shadow-lg w-full max-w-md p-6 relative pointer-events-auto border border-border">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-textMuted hover:text-text"
      >
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-xl font-semibold mb-4 text-text">{title}</h2>
      {children}
    </div>
  </div>
);

export default Brand;

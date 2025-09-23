import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, X, Edit2, Trash2 } from "lucide-react";

const API_BASE = "http://localhost:8080/api/admin/brands";

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
        <h1 className="text-2xl font-semibold text-gray-900">Brands</h1>
        <button
          onClick={() => setShowBrandModal(true)}
          className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Brand
        </button>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Brand Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Description</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Active</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {brands.map((brand, idx) => (
              <tr key={brand.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{idx + 1}</td>
                <td className="px-6 py-4">{brand.brandName}</td>
                <td className="px-6 py-4">{brand.description}</td>
                <td className="px-6 py-4">{brand.active ? "Yes" : "No"}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => setEditBrand(brand)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <Edit2 className="inline w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBrand(brand.id)}
                    className="text-red-600 hover:text-red-800"
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
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={newBrand.description}
              onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newBrand.active}
                onChange={(e) => setNewBrand({ ...newBrand, active: e.target.checked })}
              />
              <span>Active</span>
            </label>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg"
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
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              value={editBrand.description || ""}
              onChange={(e) => setEditBrand({ ...editBrand, description: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={editBrand.active}
                onChange={(e) => setEditBrand({ ...editBrand, active: e.target.checked })}
              />
              <span>Active</span>
            </label>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg"
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
  <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative pointer-events-auto">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  </div>
);

export default Brand;

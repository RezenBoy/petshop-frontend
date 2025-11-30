import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, X, Edit2, Trash2 } from "lucide-react";

const API = process.env.REACT_APP_API_URL;
const API_BASE = `${API}/api/admin/discounts`;
const SUBCATEGORIES_API = `${API}/api/admin/categories`; // to fetch categories + subcategories

const Discount = () => {
  const [discounts, setDiscounts] = useState([]);
  const [categories, setCategories] = useState([]); // for dropdowns
  const [showModal, setShowModal] = useState(false);
  const [editDiscount, setEditDiscount] = useState(null);

  const [formData, setFormData] = useState({
    discountName: "",
    discountPercent: "",
    categoryId: "", // new
    subCategoryId: "",
  });

  // Fetch discounts + categories on load
  useEffect(() => {
    fetchDiscounts();
    fetchCategories();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const res = await axios.get(API_BASE);
      console.log("Fetched discounts:", res.data); // 👈 debug line
      setDiscounts(res.data);
    } catch (err) {
      console.error(
        "Failed to fetch discounts",
        err.response?.data || err.message
      );
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(SUBCATEGORIES_API);
      setCategories(res.data);
    } catch (err) {
      console.error(
        "Failed to fetch categories",
        err.response?.data || err.message
      );
    }
  };

  // Add or Update Discount
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editDiscount) {
        // Update
        await axios.put(`${API_BASE}/${editDiscount.id}`, {
          discountName: formData.discountName,
          discountPercent: formData.discountPercent,
          productSubCategory: { id: formData.subCategoryId },
        });
      } else {
        // Create
        await axios.post(API_BASE, {
          discountName: formData.discountName,
          discountPercent: formData.discountPercent,
          subCategoryId: formData.subCategoryId,
        });
      }
      fetchDiscounts();
      setFormData({ discountName: "", discountPercent: "", subCategoryId: "" });
      setShowModal(false);
      setEditDiscount(null);
    } catch (err) {
      console.error(
        "Failed to save discount",
        err.response?.data || err.message
      );
    }
  };

  // Delete Discount
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this discount?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchDiscounts();
    } catch (err) {
      console.error(
        "Failed to delete discount",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Discounts</h1>
        <button
          onClick={() => {
            setFormData({
              discountName: "",
              discountPercent: "",
              subCategoryId: "",
            });
            setEditDiscount(null);
            setShowModal(true);
          }}
          className="flex items-center bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Discount
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                #
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Discount Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Value
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Subcategory
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {discounts.map((d, idx) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{idx + 1}</td>
                <td className="px-6 py-4">{d.discountName}</td>
                <td className="px-6 py-4">{d.discountPercent}%</td>
                <td className="px-6 py-4">
                  {d.categoryName && d.subCategoryName
                    ? `${d.categoryName} → ${d.subCategoryName}`
                    : "—"}
                </td>

                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => {
                      setEditDiscount(d);
                      setFormData({
                        discountName: d.discountName,
                        discountPercent: d.discountPercent,
                        subCategoryId: d.productSubCategory?.id || "",
                      });
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="inline w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
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

      {/* Modal */}
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
            setEditDiscount(null);
          }}
          title={editDiscount ? "Edit Discount" : "Add Discount"}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <input
              type="text"
              placeholder="Discount Name"
              value={formData.discountName}
              onChange={(e) =>
                setFormData({ ...formData, discountName: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Discount %"
              value={formData.discountPercent}
              onChange={(e) =>
                setFormData({ ...formData, discountPercent: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />

            {/* Category Dropdown */}
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categoryId: e.target.value,
                  subCategoryId: "",
                })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>

            {/* Subcategory Dropdown (depends on category) */}
            <select
              value={formData.subCategoryId}
              onChange={(e) =>
                setFormData({ ...formData, subCategoryId: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
              disabled={!formData.categoryId}
            >
              <option value="">Select Subcategory</option>
              {categories
                .find((cat) => cat.id === parseInt(formData.categoryId))
                ?.[
                  "subCategories" in
                  (categories.find(
                    (cat) => cat.id === parseInt(formData.categoryId)
                  ) || {})
                    ? "subCategories"
                    : "subcategories"
                ]?.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.subCategoryName}
                  </option>
                ))}
            </select>

            <button
              type="submit"
              className="w-full bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
            >
              {editDiscount ? "Update" : "Save"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ children, onClose, title }) => (
  <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
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

export default Discount;

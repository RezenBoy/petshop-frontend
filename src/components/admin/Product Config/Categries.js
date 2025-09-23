// Categories.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  X,
  Edit2,
  Trash2,
} from "lucide-react";

const API_BASE = "http://localhost:8080/api/admin/categories";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState(null);

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [editSub, setEditSub] = useState(null);

  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    description: "",
  });

  const [newSubcategory, setNewSubcategory] = useState("");

  // Fetch categories on page load
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_BASE);
      setCategories(res.data);
    } catch (err) {
      console.error(
        "Failed to fetch categories",
        err.response?.data || err.message
      );
    }
  };

  // Add Category
  const handleAddCategory = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!newCategory?.categoryName) return;

    try {
      await axios.post(API_BASE, newCategory, {
        headers: { "Content-Type": "application/json" },
      });
      await fetchCategories();
      setNewCategory({ categoryName: "", description: "" });
      setShowCategoryModal(false);
    } catch (err) {
      console.error(
        "Failed to add category",
        err.response?.data || err.message
      );
    }
  };

  // Edit Category
  const handleEditCategory = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!editCategory?.id) return;

    try {
      await axios.put(`${API_BASE}/${editCategory.id}`, editCategory, {
        headers: { "Content-Type": "application/json" },
      });
      await fetchCategories();
      setEditCategory(null);
    } catch (err) {
      console.error(
        "Failed to edit category",
        err.response?.data || err.message
      );
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      await fetchCategories();
    } catch (err) {
      console.error(
        "Failed to delete category",
        err.response?.data || err.message
      );
    }
  };

  // Add Subcategory
  const handleAddSubcategory = async (e, parentId) => {
    if (e?.preventDefault) e.preventDefault();
    if (!newSubcategory) return;

    try {
      const payload = {
        subCategoryName: newSubcategory,
        productCategory: { id: parentId }, // 👈 parent reference is required
      };

      await axios.post(`${API_BASE}/${parentId}/subcategories`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      await fetchCategories();
      setNewSubcategory("");
      setShowSubModal(null);
    } catch (err) {
      console.error(
        "Failed to add subcategory",
        err.response?.data || err.message
      );
    }
  };

  // Edit Subcategory
  const handleEditSubcategory = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!editSub?.sub?.id) return;

    try {
      const payload = {
        ...editSub.sub,
        productCategory: { id: editSub.parentId }, // 👈 ensure parent is included
      };

      await axios.put(`${API_BASE}/subcategories/${editSub.sub.id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      await fetchCategories();
      setEditSub(null);
    } catch (err) {
      console.error(
        "Failed to edit subcategory",
        err.response?.data || err.message
      );
    }
  };

  // Delete Subcategory
  const handleDeleteSubcategory = async (subId) => {
    if (!window.confirm("Delete this subcategory?")) return;
    try {
      await axios.delete(`${API_BASE}/subcategories/${subId}`);
      await fetchCategories();
    } catch (err) {
      console.error(
        "Failed to delete subcategory",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div>
      {/* Header + Add Category */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
        <button
          onClick={() => setShowCategoryModal(true)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                #
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Category
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Description
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Subcategories
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat, idx) => (
              <React.Fragment key={cat.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">{idx + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {cat.categoryName}
                  </td>
                  <td className="px-6 py-4">{cat.description}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        setExpanded(expanded === cat.id ? null : cat.id)
                      }
                      className="flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                      {expanded === cat.id ? (
                        <ChevronDown className="w-4 h-4 mr-1" />
                      ) : (
                        <ChevronRight className="w-4 h-4 mr-1" />
                      )}
                      {cat.subCategories?.length || 0} Subcategories
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => setShowSubModal(cat.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      + Sub
                    </button>
                    <button
                      onClick={() => setEditCategory(cat)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="inline w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="inline w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>

                {/* Subcategories */}
                {expanded === cat.id && (
                  <tr>
                    <td colSpan="5" className="bg-gray-50 px-6 py-4">
                      <h3 className="font-semibold mb-2">Subcategories</h3>
                      <ul className="ml-4 list-disc text-gray-700">
                        {cat.subCategories?.map((sub) => (
                          <li
                            key={sub.id}
                            className="flex justify-between items-center"
                          >
                            {sub.subCategoryName}
                            <div className="space-x-2">
                              <button
                                onClick={() =>
                                  setEditSub({ parentId: cat.id, sub })
                                }
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteSubcategory(sub.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      {showCategoryModal && (
        <Modal onClose={() => setShowCategoryModal(false)} title="Add Category">
          <form onSubmit={handleAddCategory} className="space-y-4">
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.categoryName}
              onChange={(e) =>
                setNewCategory({ ...newCategory, categoryName: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Category Modal */}
      {editCategory && (
        <Modal onClose={() => setEditCategory(null)} title="Edit Category">
          <form onSubmit={handleEditCategory} className="space-y-4">
            <input
              type="text"
              value={editCategory.categoryName || ""}
              onChange={(e) =>
                setEditCategory({
                  ...editCategory,
                  categoryName: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              value={editCategory.description || ""}
              onChange={(e) =>
                setEditCategory({
                  ...editCategory,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Update
            </button>
          </form>
        </Modal>
      )}

      {/* Add Subcategory Modal */}
      {showSubModal && (
        <Modal onClose={() => setShowSubModal(null)} title="Add Subcategory">
          <form
            onSubmit={(e) => handleAddSubcategory(e, showSubModal)}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Subcategory Name"
              value={newSubcategory}
              onChange={(e) => setNewSubcategory(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Subcategory Modal */}
      {editSub && (
        <Modal onClose={() => setEditSub(null)} title="Edit Subcategory">
          <form onSubmit={handleEditSubcategory} className="space-y-4">
            <input
              type="text"
              value={editSub.sub.subCategoryName || ""}
              onChange={(e) =>
                setEditSub({
                  ...editSub,
                  sub: { ...editSub.sub, subCategoryName: e.target.value },
                })
              }
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Update
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

// Modal
const Modal = ({ children, onClose, title }) => (
  <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
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

export default Categories;

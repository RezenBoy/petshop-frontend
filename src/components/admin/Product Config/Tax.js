// Tax.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, X, Edit2, Trash2 } from "lucide-react";

const API_BASE = "http://localhost:8080/api/admin/tax";

const Tax = () => {
  const [taxes, setTaxes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTax, setEditTax] = useState(null);

  const [newTax, setNewTax] = useState({
    taxName: "",
    percentage: "",
    description: "",
  });

  // Fetch taxes
  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    try {
      const res = await axios.get(API_BASE);
      setTaxes(res.data);
    } catch (err) {
      console.error("Failed to fetch taxes", err);
    }
  };

  // Add Tax
  const handleAddTax = async (e) => {
    e.preventDefault();
    if (!newTax.taxName || !newTax.percentage) return;

    try {
      await axios.post(API_BASE, newTax, {
        headers: { "Content-Type": "application/json" },
      });
      await fetchTaxes();
      setNewTax({ taxName: "", percentage: "", description: "" });
      setShowModal(false);
    } catch (err) {
      console.error("Failed to add tax", err);
    }
  };

  // Edit Tax
  const handleEditTax = async (e) => {
    e.preventDefault();
    if (!editTax?.id) return;

    try {
      await axios.put(`${API_BASE}/${editTax.id}`, editTax, {
        headers: { "Content-Type": "application/json" },
      });
      await fetchTaxes();
      setEditTax(null);
    } catch (err) {
      console.error("Failed to update tax", err);
    }
  };

  // Delete Tax
  const handleDeleteTax = async (id) => {
    if (!window.confirm("Delete this tax?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      await fetchTaxes();
    } catch (err) {
      console.error("Failed to delete tax", err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tax</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Tax
        </button>
      </div>

      {/* Tax Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Tax Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Rate (%)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Description</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {taxes.map((tax, idx) => (
              <tr key={tax.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{idx + 1}</td>
                <td className="px-6 py-4">{tax.taxName}</td>
                <td className="px-6 py-4">{tax.percentage}%</td>
                <td className="px-6 py-4">{tax.description}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => setEditTax(tax)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="inline w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTax(tax.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="inline w-4 h-4" /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {taxes.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No tax records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Tax Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} title="Add Tax">
          <form onSubmit={handleAddTax} className="space-y-4">
            <input
              type="text"
              placeholder="Tax Name"
              value={newTax.taxName}
              onChange={(e) => setNewTax({ ...newTax, taxName: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Rate (%)"
              value={newTax.percentage}
              onChange={(e) =>
                setNewTax({ ...newTax, percentage: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Description"
              value={newTax.description}
              onChange={(e) =>
                setNewTax({ ...newTax, description: e.target.value })
              }
              className="w-full p-2 border rounded"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Tax Modal */}
      {editTax && (
        <Modal onClose={() => setEditTax(null)} title="Edit Tax">
          <form onSubmit={handleEditTax} className="space-y-4">
            <input
              type="text"
              value={editTax.taxName}
              onChange={(e) =>
                setEditTax({ ...editTax, taxName: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              value={editTax.percentage}
              onChange={(e) =>
                setEditTax({ ...editTax, percentage: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <textarea
              value={editTax.description}
              onChange={(e) =>
                setEditTax({ ...editTax, description: e.target.value })
              }
              className="w-full p-2 border rounded"
            ></textarea>
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

// Reusable Modal
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

export default Tax;

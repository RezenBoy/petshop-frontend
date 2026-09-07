import React, { useState } from "react";
import { Plus } from "lucide-react";

const CreatePurchase = () => {
  const [formData, setFormData] = useState({
    supplier: "",
    invoiceNo: "",
    date: "",
    items: [{ name: "", qty: 1, price: 0 }],
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle item change
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  // Add new item row
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", qty: 1, price: 0 }],
    });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Purchase Data:", formData);
    alert("Purchase created (check console)");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text mb-6">Create Purchase</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Supplier Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="supplier"
            placeholder="Supplier Name"
            value={formData.supplier}
            onChange={handleChange}
            className="p-2 border border-border bg-surface text-text rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            name="invoiceNo"
            placeholder="Invoice Number"
            value={formData.invoiceNo}
            onChange={handleChange}
            className="p-2 border border-border bg-surface text-text rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-2 border border-border bg-surface text-text rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Items Table */}
        <div className="bg-surface rounded-xl shadow-sm border border-border p-4">
          <h2 className="text-lg font-medium mb-3 text-text">Purchase Items</h2>
          <table className="w-full text-sm">
            <thead className="bg-background text-textMuted">
              <tr>
                <th className="px-4 py-2 text-left">Item</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index} className="border-t border-border">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, "name", e.target.value)}
                      className="p-1 border border-border bg-surface text-text rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.qty}
                      min="1"
                      onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                      className="p-1 border border-border bg-surface text-text rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.price}
                      min="0"
                      onChange={(e) => handleItemChange(index, "price", e.target.value)}
                      className="p-1 border border-border bg-surface text-text rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-2 font-medium text-text">
                    ₹{item.qty * item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={addItem}
            className="mt-3 flex items-center bg-secondary/40 text-primary px-3 py-1.5 rounded hover:bg-secondary/60 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-primary text-surface px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
        >
          Save Purchase
        </button>
      </form>
    </div>
  );
};

export default CreatePurchase;

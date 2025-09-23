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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create Purchase</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Supplier Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="supplier"
            placeholder="Supplier Name"
            value={formData.supplier}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="invoiceNo"
            placeholder="Invoice Number"
            value={formData.invoiceNo}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-medium mb-3">Purchase Items</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Item</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, "name", e.target.value)}
                      className="p-1 border rounded w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.qty}
                      min="1"
                      onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                      className="p-1 border rounded w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.price}
                      min="0"
                      onChange={(e) => handleItemChange(index, "price", e.target.value)}
                      className="p-1 border rounded w-full"
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">
                    ₹{item.qty * item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={addItem}
            className="mt-3 flex items-center bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Purchase
        </button>
      </form>
    </div>
  );
};

export default CreatePurchase;

import React, { useState } from "react";

const PurchaseReport = () => {
  const [purchases] = useState([
    { id: 1, date: "2025-09-02", supplier: "Pet Supplier Ltd", product: "Dog Food", qty: 100, total: 15000 },
    { id: 2, date: "2025-09-04", supplier: "Animal Care Co.", product: "Cat Litter", qty: 50, total: 5000 },
    { id: 3, date: "2025-09-06", supplier: "Bird World", product: "Bird Seed", qty: 200, total: 8000 },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Purchase Report</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input type="date" className="p-2 border rounded" />
        <input type="date" className="p-2 border rounded" />
        <input type="text" placeholder="Search Product" className="p-2 border rounded" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Supplier</th>
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-left">Qty</th>
              <th className="px-6 py-3 text-left">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {purchases.map((purchase, index) => (
              <tr key={purchase.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{purchase.date}</td>
                <td className="px-6 py-4">{purchase.supplier}</td>
                <td className="px-6 py-4">{purchase.product}</td>
                <td className="px-6 py-4">{purchase.qty}</td>
                <td className="px-6 py-4">₹{purchase.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseReport;

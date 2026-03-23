import React, { useState } from "react";

const SalesReport = () => {
  const [sales] = useState([
    { id: 1, date: "2025-09-01", customer: "Sarah Johnson", product: "Dog Food", qty: 2, total: 3000 },
    { id: 2, date: "2025-09-03", customer: "Mike Chen", product: "Cat Toy", qty: 1, total: 800 },
    { id: 3, date: "2025-09-05", customer: "Emma Davis", product: "Bird Cage", qty: 1, total: 5000 },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Sales Report</h1>

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
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-left">Qty</th>
              <th className="px-6 py-3 text-left">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sales.map((sale, index) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{sale.date}</td>
                <td className="px-6 py-4">{sale.customer}</td>
                <td className="px-6 py-4">{sale.product}</td>
                <td className="px-6 py-4">{sale.qty}</td>
                <td className="px-6 py-4">₹{sale.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;

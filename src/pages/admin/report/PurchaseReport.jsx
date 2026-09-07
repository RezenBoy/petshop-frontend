import React, { useState } from "react";

const PurchaseReport = () => {
  const [purchases] = useState([
    { id: 1, date: "2025-09-02", supplier: "Pet Supplier Ltd", product: "Dog Food", qty: 100, total: 15000 },
    { id: 2, date: "2025-09-04", supplier: "Animal Care Co.", product: "Cat Litter", qty: 50, total: 5000 },
    { id: 3, date: "2025-09-06", supplier: "Bird World", product: "Bird Seed", qty: 200, total: 8000 },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text mb-6">Purchase Report</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input type="date" className="p-2 border border-border bg-surface text-text rounded focus:outline-none focus:ring-2 focus:ring-primary" />
        <input type="date" className="p-2 border border-border bg-surface text-text rounded focus:outline-none focus:ring-2 focus:ring-primary" />
        <input type="text" placeholder="Search Product" className="p-2 border border-border bg-surface text-text rounded focus:outline-none focus:ring-2 focus:ring-primary" />
        <button className="bg-primary text-surface px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium">
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-background text-textMuted">
            <tr>
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Supplier</th>
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-left">Qty</th>
              <th className="px-6 py-3 text-left">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {purchases.map((purchase, index) => (
              <tr key={purchase.id} className="hover:bg-background/60 transition-colors">
                <td className="px-6 py-4 text-textMuted">{index + 1}</td>
                <td className="px-6 py-4 text-textMuted">{purchase.date}</td>
                <td className="px-6 py-4 text-textMuted">{purchase.supplier}</td>
                <td className="px-6 py-4 font-medium text-text">{purchase.product}</td>
                <td className="px-6 py-4 text-textMuted">{purchase.qty}</td>
                <td className="px-6 py-4 font-medium text-text">₹{purchase.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseReport;

import React, { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

const ManagePurchase = () => {
  const [purchases] = useState([
    {
      id: 1,
      supplier: "Pet Food Supplier",
      invoiceNo: "INV-1001",
      date: "2025-09-10",
      total: 12500,
    },
    {
      id: 2,
      supplier: "Animal Accessories Ltd.",
      invoiceNo: "INV-1002",
      date: "2025-09-15",
      total: 8900,
    },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text mb-6">Manage Purchases</h1>

      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-background">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-textMuted">#</th>
              <th className="px-6 py-3 text-left font-medium text-textMuted">Supplier</th>
              <th className="px-6 py-3 text-left font-medium text-textMuted">Invoice No</th>
              <th className="px-6 py-3 text-left font-medium text-textMuted">Date</th>
              <th className="px-6 py-3 text-left font-medium text-textMuted">Total</th>
              <th className="px-6 py-3 text-right font-medium text-textMuted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {purchases.map((purchase, index) => (
              <tr key={purchase.id} className="hover:bg-background/60 transition-colors">
                <td className="px-6 py-4 text-textMuted">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-text">{purchase.supplier}</td>
                <td className="px-6 py-4 text-textMuted">{purchase.invoiceNo}</td>
                <td className="px-6 py-4 text-textMuted">{purchase.date}</td>
                <td className="px-6 py-4 font-medium text-text">₹{purchase.total}</td>
                <td className="px-6 py-4 text-right flex gap-2 justify-end">
                  <button className="text-primary hover:text-primary/80 transition-colors" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-accent hover:text-accent/80 transition-colors" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-500 hover:text-red-700 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePurchase;

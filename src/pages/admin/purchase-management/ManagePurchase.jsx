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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Manage Purchases</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">#</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Supplier</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Invoice No</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Date</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Total</th>
              <th className="px-6 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {purchases.map((purchase, index) => (
              <tr key={purchase.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{purchase.supplier}</td>
                <td className="px-6 py-4">{purchase.invoiceNo}</td>
                <td className="px-6 py-4">{purchase.date}</td>
                <td className="px-6 py-4">₹{purchase.total}</td>
                <td className="px-6 py-4 text-right flex gap-2 justify-end">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
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

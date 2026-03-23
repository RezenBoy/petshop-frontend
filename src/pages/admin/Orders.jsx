// src/components/admin/Orders.js
import React from "react";
import { PlusCircle, Edit, Trash2, Truck, RotateCcw } from "lucide-react";

const Orders = () => {
  // Dummy data for now
  const orders = [
    { id: "ORD001", customer: "John Doe", date: "2025-09-18", status: "Shipped", total: "$120" },
    { id: "ORD002", customer: "Jane Smith", date: "2025-09-17", status: "Processing", total: "$80" },
    { id: "ORD003", customer: "Michael Brown", date: "2025-09-15", status: "Delivered", total: "$200" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button className="flex items-center bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition">
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Order
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4">{order.id}</td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-600"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">{order.total}</td>
                <td className="px-6 py-4 flex items-center justify-center space-x-3">
                  <button className="text-blue-500 hover:text-blue-700" title="Edit">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="text-red-500 hover:text-red-700" title="Delete">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button className="text-purple-500 hover:text-purple-700" title="Track Order">
                    <Truck className="w-5 h-5" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800" title="Return/Refund">
                    <RotateCcw className="w-5 h-5" />
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

export default Orders;

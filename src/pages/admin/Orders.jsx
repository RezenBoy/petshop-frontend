// src/components/admin/Orders.js
import React from "react";
import { 
  // PlusCircle,
   Edit, Trash2, Truck, RotateCcw } from "lucide-react";

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
      {/* <div className="flex items-center justify-between mb-6">
        <button className="flex items-center bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition">
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Order
        </button>
      </div> */}  

      {/* Orders Table */}
      <div className="overflow-x-auto bg-surface rounded-lg shadow-sm border border-border">
        <table className="min-w-full text-sm text-text">
          <thead className="bg-background text-textMuted uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order, index) => (
              <tr
                key={index}
                className="hover:bg-background/60 transition-colors"
              >
                <td className="px-6 py-4 font-medium">{order.id}</td>
                <td className="px-6 py-4 text-textMuted">{order.customer}</td>
                <td className="px-6 py-4 text-textMuted">{order.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : order.status === "Shipped"
                        ? "bg-secondary/40 text-primary"
                        : "bg-accent/20 text-catBrown"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">{order.total}</td>
                <td className="px-6 py-4 flex items-center justify-center space-x-3">
                  <button className="text-primary hover:text-primary/80 transition-colors" title="Edit">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="text-red-500 hover:text-red-700 transition-colors" title="Delete">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button className="text-accent hover:text-accent/80 transition-colors" title="Track Order">
                    <Truck className="w-5 h-5" />
                  </button>
                  <button className="text-textMuted hover:text-text transition-colors" title="Return/Refund">
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

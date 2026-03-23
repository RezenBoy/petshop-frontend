// src/components/admin/Customers.js
import React from "react";
import { PlusCircle, Edit, Trash2, Eye } from "lucide-react";

const Customers = () => {
  // Dummy customer data
  const customers = [
    { id: "CUST001", name: "John Doe", email: "john@example.com", phone: "+91 9876543210", joined: "2025-07-10" },
    { id: "CUST002", name: "Jane Smith", email: "jane@example.com", phone: "+91 9123456789", joined: "2025-08-01" },
    { id: "CUST003", name: "Michael Brown", email: "mike@example.com", phone: "+91 9988776655", joined: "2025-09-05" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Customer ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Joined</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4">{customer.id}</td>
                <td className="px-6 py-4">{customer.name}</td>
                <td className="px-6 py-4">{customer.email}</td>
                <td className="px-6 py-4">{customer.phone}</td>
                <td className="px-6 py-4">{customer.joined}</td>
                <td className="px-6 py-4 flex items-center justify-center space-x-3">
                  <button className="text-green-500 hover:text-green-700" title="View Profile">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="text-blue-500 hover:text-blue-700" title="Edit">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="text-red-500 hover:text-red-700" title="Delete">
                    <Trash2 className="w-5 h-5" />
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

export default Customers;

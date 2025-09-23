import React, { useState } from "react";
import { Eye, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const ManageProduct = () => {
  const [products] = useState([
    {
      id: 1,
      name: "Premium Dog Food",
      category: "Food",
      price: 1500,
      stock: 120,
      status: "Active",
    },
    {
      id: 2,
      name: "Cat Scratching Post",
      category: "Accessories",
      price: 2200,
      stock: 45,
      status: "Inactive",
    },
    {
      id: 3,
      name: "Bird Cage Large",
      category: "Cages",
      price: 5000,
      stock: 10,
      status: "Active",
    },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Manage Products
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">#</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Product</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Category</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Price</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Stock</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-6 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product, index) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">₹{product.price}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
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
                  <button className="text-gray-600 hover:text-gray-800">
                    {product.status === "Active" ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
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

export default ManageProduct;

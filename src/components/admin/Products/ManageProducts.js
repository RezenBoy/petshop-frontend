import React from "react";

const ManageProducts = () => {
  // Sample product data
  const products = [
    { id: 1, name: "Premium Dog Food (15kg)", category: "Dog Food", price: "₹83,580", stock: 120 },
    { id: 2, name: "Cat Litter (10kg)", category: "Cat Supplies", price: "₹44,700", stock: 75 },
    { id: 3, name: "Dog Chew Toys Set", category: "Pet Toys", price: "₹27,600", stock: 200 },
    { id: 4, name: "Bird Food Mix", category: "Bird Food", price: "₹35,100", stock: 50 },
    { id: 5, name: "Pet Grooming Kit", category: "Grooming", price: "₹56,700", stock: 90 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Products</h1>

      <div className="mb-4 flex justify-between items-center">
        <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">
          + Add New Product
        </button>
        <input
          type="text"
          placeholder="Search products..."
          className="px-4 py-2 border rounded focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button className="text-blue-500 hover:underline">Edit</button>
                  <button className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;

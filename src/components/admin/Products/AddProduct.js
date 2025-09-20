// src/components/admin/AddProduct.js
import React from "react";

const AddProduct = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Add New Product</h1>
      
      <form className="space-y-4">
        <input type="text" placeholder="Product Name" className="w-full p-2 border rounded" />
        <input type="number" placeholder="Price" className="w-full p-2 border rounded" />
        <textarea placeholder="Description" className="w-full p-2 border rounded"></textarea>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Save Product</button>
      </form>
    </div>
  );
};

export default AddProduct;

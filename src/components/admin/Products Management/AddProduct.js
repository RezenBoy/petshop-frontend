// src/components/admin/AddProduct.js
import React from "react";

const AddProduct = () => {
  return (
    <div>

      <form className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-6">
        {/* Grid container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter product name"
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>

          {/* HSN Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              HSN Code
            </label>
            <input
              type="text"
              placeholder="Enter HSN code"
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          {/* Barcode */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bar Code
            </label>
            <input
              type="text"
              placeholder="Enter barcode"
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          {/* Model No */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Model No
            </label>
            <input
              type="text"
              placeholder="Enter model number"
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          {/* Serial No */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Serial No
            </label>
            <input
              type="text"
              placeholder="Enter serial number"
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brand
            </label>
            <select className="w-full p-2 border rounded mt-1">
              <option>Select Brand</option>
              <option>Brand A</option>
              <option>Brand B</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              placeholder="Enter quantity"
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          {/* Minimum Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Stock
            </label>
            <input
              type="number"
              placeholder="Enter minimum stock"
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          {/* Cost Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cost Price
            </label>
            <input
              type="number"
              placeholder="Enter cost price"
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          {/* MRP */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              MRP
            </label>
            <input
              type="number"
              placeholder="Enter MRP"
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          {/* Tax */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tax Percentage
            </label>
            <select className="w-full p-2 border rounded mt-1">
              <option>Select Tax</option>
              <option>5%</option>
              <option>12%</option>
              <option>18%</option>
            </select>
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Subcategory
            </label>
            <select className="w-full p-2 border rounded mt-1">
              <option>Select Subcategory</option>
              <option>Food</option>
              <option>Accessories</option>
              <option>Healthcare</option>
            </select>
          </div>
        </div>

        {/* Description (full width) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            placeholder="Enter product description"
            className="w-full p-2 border rounded mt-1"
            rows={4}
          ></textarea>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

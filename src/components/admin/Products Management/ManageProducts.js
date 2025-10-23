import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/products");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("❌ Failed to fetch products:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        alert("✅ Product deleted");
      } else {
        alert("❌ Failed to delete product");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">#</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Product</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Category</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Price</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Stock</th>
              <th className="px-6 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product, index) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>

                {/* ✅ productName fixed */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.productName}
                </td>

                {/* ✅ fixed productCategory path */}
                <td className="px-6 py-4">
                  {product.productSubCategory?.productCategory?.categoryName}{" "}
                  → {product.productSubCategory?.subCategoryName}
                </td>

                <td className="px-6 py-4">₹{product.mrp}</td>
                <td className="px-6 py-4">{product.quantity}</td>

                <td className="px-6 py-4 text-right flex gap-2 justify-end">
                  {/* View */}
                  <button
                    onClick={() => handleView(product)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {selectedProduct.productName}
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Category:</strong>{" "}
                {selectedProduct.productSubCategory?.productCategory?.categoryName} →{" "}
                {selectedProduct.productSubCategory?.subCategoryName}
              </p>
              <p>
                <strong>HSN Code:</strong> {selectedProduct.hsnCode || "—"}
              </p>
              <p>
                <strong>Barcode:</strong> {selectedProduct.barCode || "—"}
              </p>
              <p>
                <strong>Price:</strong> ₹{selectedProduct.mrp}
              </p>
              <p>
                <strong>Quantity:</strong> {selectedProduct.quantity}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedProduct.description || "No description"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProduct;

import React, { useState, useEffect } from "react";
import api from "../../../libs/api";
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
      const res = await api.get(`/admin/products`);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("❌ Failed to fetch products:", error);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await api.delete(`/admin/products/${id}`);
      if (res.status === 200 || res.status === 204) {
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
      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-background">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-textMuted">#</th>
              <th className="px-6 py-3 text-left font-medium text-textMuted">Product</th>
              <th className="px-6 py-3 text-left font-medium text-textMuted">Category</th>
              <th className="px-6 py-3 text-left font-medium text-textMuted">Price</th>
              <th className="px-6 py-3 text-left font-medium text-textMuted">Stock</th>
              <th className="px-6 py-3 text-right font-medium text-textMuted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product, index) => (
              <tr key={product.id} className="hover:bg-background/60 transition-colors">
                <td className="px-6 py-4 text-textMuted">{index + 1}</td>

                {/* ✅ productName fixed */}
                <td className="px-6 py-4 font-medium text-text">
                  {product.productName}
                </td>

                {/* ✅ fixed productCategory path */}
                <td className="px-6 py-4 text-textMuted">
                  {product.productSubCategory?.productCategory?.categoryName}{" "}
                  → {product.productSubCategory?.subCategoryName}
                </td>

                <td className="px-6 py-4 font-medium text-text">₹{product.mrp}</td>
                <td className="px-6 py-4 text-textMuted">{product.quantity}</td>

                <td className="px-6 py-4 text-right flex gap-2 justify-end">
                  {/* View */}
                  <button
                    onClick={() => handleView(product)}
                    className="text-primary hover:text-primary/80 transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="text-accent hover:text-accent/80 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface p-6 rounded-lg shadow-lg w-full max-w-lg relative border border-border">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-2 right-2 text-textMuted hover:text-text"
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-4 text-text">
              {selectedProduct.productName}
            </h2>

            <div className="space-y-2 text-sm text-textMuted">
              <p>
                <strong className="text-text">Category:</strong>{" "}
                {selectedProduct.productSubCategory?.productCategory?.categoryName} →{" "}
                {selectedProduct.productSubCategory?.subCategoryName}
              </p>
              <p>
                <strong className="text-text">HSN Code:</strong> {selectedProduct.hsnCode || "—"}
              </p>
              <p>
                <strong className="text-text">Barcode:</strong> {selectedProduct.barCode || "—"}
              </p>
              <p>
                <strong className="text-text">Price:</strong> ₹{selectedProduct.mrp}
              </p>
              <p>
                <strong className="text-text">Quantity:</strong> {selectedProduct.quantity}
              </p>
              <p>
                <strong className="text-text">Description:</strong>{" "}
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

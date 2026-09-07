// src/components/admin/AddProduct.js
import React, { useState, useEffect } from "react";
import api from "../../../libs/api";

const initialFormData = {
  productname: "",
  hsnCode: "",
  barCode: "",
  modelNo: "",
  serialNo: "",
  description: "",
  quantity: "",
  minimumStock: "",
  costPrice: "",
  mrp: "",
  brandId: "",
  taxId: "",
  categoryId: "",
  productSubCategoryId: "",
  sizes: [""],
  measurementUnit: "cm",
  colors: [{ name: "", code: "" }],
};

const AddProduct = () => {
  const [brands, setBrands] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    fetchBrands();
    fetchTaxes();
    fetchCategories();
  }, []);
  const fetchBrands = async () => {
    try {
      const res = await api.get(`/admin/brands`);
      setBrands(res.data);
    } catch (error) {
      console.error("Failed to fetch brands", error);
    }
  };

  const fetchTaxes = async () => {
    try {
      const res = await api.get(`/admin/tax`);
      setTaxes(res.data);
    } catch (error) {
      console.error("Failed to fetch taxes", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get(`/admin/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Sizes & Colors handlers
  const addSizeField = () =>
    setFormData({ ...formData, sizes: [...formData.sizes, ""] });

  const updateSizeField = (index, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = value;
    setFormData({ ...formData, sizes: newSizes });
  };

  // const addColorField = () =>
  //   setFormData({ ...formData, colors: [...formData.colors, ""] });

  // const updateColorField = (index, value) => {
  //   const newColors = [...formData.colors];
  //   newColors[index] = value;
  //   setFormData({ ...formData, colors: newColors });
  // };

  // Image Upload Handlers
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...selectedFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  // Submit Handler using FormData
  const handleSubmit = async (e) => {
    e.preventDefault();

    const productPayload = {
      productname: formData.productname,
      hsnCode: formData.hsnCode,
      barCode: formData.barCode,
      modelNo: formData.modelNo,
      serialNo: formData.serialNo,
      description: formData.description,
      quantity: Number(formData.quantity),
      minimumStock: Number(formData.minimumStock),
      costPrice: Number(formData.costPrice),
      mrp: Number(formData.mrp),
      brandId: Number(formData.brandId),
      taxId: Number(formData.taxId),
      categoryId: Number(formData.categoryId),
      productSubCategoryId: Number(formData.productSubCategoryId),
      sizes: formData.sizes.filter((s) => s.trim() !== ""),
      measurementUnit: formData.measurementUnit,
      colors: formData.colors.filter(
        (c) => c.name.trim() !== "" || c.code.trim() !== ""
      ),
    };

    const formDataToSend = new FormData();
    formDataToSend.append(
      "productData",
      new Blob([JSON.stringify(productPayload)], { type: "application/json" })
    );

    images.forEach((file) => {
      formDataToSend.append("images", file);
    });
    try {
      const res = await api.post(`/admin/products`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200 || res.status === 201) {
        alert("Product saved successfully!");
        setFormData(initialFormData);
        setImages([]);
        setImagePreviews([]);
      }
    } catch (error) {
      alert("Failed to save product");
      console.error(error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-surface p-6 rounded-lg shadow-sm border border-border space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-text">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="productname"
              value={formData.productname}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full p-2 border border-border bg-surface text-text rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* HSN Code */}
          <div>
            <label className="block text-sm font-medium text-text">
              HSN Code<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="hsnCode"
              value={formData.hsnCode}
              onChange={handleChange}
              placeholder="Enter HSN code"
              className="w-full p-2 border border-border bg-surface text-text rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Bar Code */}
          <div>
            <label className="block text-sm font-medium text-text">
              Bar Code<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="barCode"
              value={formData.barCode}
              onChange={handleChange}
              placeholder="Enter barcode"
              className="w-full p-2 border border-border bg-surface text-text rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Model No */}
          <div>
            <label className="block text-sm font-medium text-text">
              Model No<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="modelNo"
              value={formData.modelNo}
              onChange={handleChange}
              placeholder="Enter model number"
              className="w-full p-2 border border-border bg-surface text-text rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Serial No */}
          <div>
            <label className="block text-sm font-medium text-text">
              Serial No
            </label>
            <input
              type="text"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleChange}
              placeholder="Enter serial number"
              className="w-full p-2 border border-border bg-surface text-text rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-text">
              Brand<span className="text-red-500">*</span>
            </label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
              className="w-full p-2 border border-border bg-surface text-text rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-text">
              Category<span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId || ""}
              onChange={(e) => {
                const selectedId = e.target.value;
                setFormData({
                  ...formData,
                  categoryId: selectedId,
                  productSubCategoryId: "",
                });

                const selectedCat = categories.find(
                  (cat) => cat.id === Number(selectedId)
                );
                setSubCategories(selectedCat?.subCategories || []);
              }}
              className="w-full p-2 border border-border bg-surface text-text rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-sm font-medium text-text">
              Subcategory<span className="text-red-500">*</span>
            </label>
            <select
              name="productSubCategoryId"
              value={formData.productSubCategoryId}
              onChange={handleChange}
              className="w-full p-2 border border-border bg-surface text-text rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={!formData.categoryId}
            >
              <option value="">Select Subcategory</option>
              {subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.subCategoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-text">
              Quantity<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              className="w-full p-2 border border-border bg-surface text-text rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Minimum Stock */}
          <div>
            <label className="block text-sm font-medium text-text">
              Minimum Stock<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="minimumStock"
              value={formData.minimumStock}
              onChange={handleChange}
              placeholder="Enter minimum stock"
              className="w-full p-2 border border-border bg-surface text-text rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Cost Price */}
          <div>
            <label className="block text-sm font-medium text-text">
              Cost Price<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleChange}
              placeholder="Enter cost price"
              className="w-full p-2 border border-border bg-surface text-text rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* MRP */}
          <div>
            <label className="block text-sm font-medium text-text">
              MRP<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              placeholder="Enter MRP"
              className="w-full p-2 border border-border bg-surface text-text rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Tax */}
          <div>
            <label className="block text-sm font-medium text-text">
              Tax Percentage
            </label>
            <select
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              className="w-full p-2 border border-border bg-surface text-text rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Tax</option>
              {taxes.map((tax) => (
                <option key={tax.id} value={tax.id}>
                  {tax.percentage}%
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sizes + Measurement Unit in one row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-text">
              Sizes
            </label>
            {formData.sizes.map((size, index) => (
              <input
                key={index}
                type="text"
                value={size}
                onChange={(e) => updateSizeField(index, e.target.value)}
                className="w-full p-2 border border-border bg-surface text-text rounded mt-1 mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter size (e.g. Small, Medium, 18)"
              />
            ))}
            <button
              type="button"
              onClick={addSizeField}
              className="bg-secondary/40 text-primary hover:bg-secondary/60 px-3 py-1 rounded transition-colors text-sm font-medium"
            >
              + Add Size
            </button>
          </div>

          {/* Measurement Unit */}
          <div>
            <label className="block text-sm font-medium text-text">
              Measurement Unit
            </label>
            <select
              name="measurementUnit"
              value={formData.measurementUnit}
              onChange={handleChange}
              className="w-full p-2 border border-border bg-surface text-text rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="cm">Centimeter (cm)</option>
              <option value="inch">Inch (inch)</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Colors (Name + Code) */}
        <div>
          <label className="block text-sm font-medium text-text">
            Colors
          </label>

          {formData.colors.map((color, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2"
            >
              {/* Color Name */}
              <input
                type="text"
                value={color.name}
                onChange={(e) => {
                  const updatedColors = [...formData.colors];
                  updatedColors[index].name = e.target.value;
                  setFormData({ ...formData, colors: updatedColors });
                }}
                className="w-full p-2 border border-border bg-surface text-text rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Color name (e.g. Red)"
              />

              {/* Color Code */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={color.code}
                  onChange={(e) => {
                    const updatedColors = [...formData.colors];
                    updatedColors[index].code = e.target.value;
                    setFormData({ ...formData, colors: updatedColors });
                  }}
                  className="w-full p-2 border border-border bg-surface text-text rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="#FF0000"
                />
                {/* Optional: Color preview */}
                {color.code && (
                  <div
                    className="w-8 h-8 rounded border border-border"
                    style={{ backgroundColor: color.code }}
                  ></div>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                colors: [...formData.colors, { name: "", code: "" }],
              })
            }
            className="bg-secondary/40 text-primary hover:bg-secondary/60 px-3 py-1 rounded transition-colors text-sm font-medium"
          >
            + Add Color
          </button>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-text">
            Product Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-border bg-surface text-text rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover rounded border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text">
            Description<span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            className="w-full p-2 border border-border bg-surface text-text rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
            required
          ></textarea>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="bg-primary text-surface px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

import React from "react";
import { PlusCircle, List, BarChart2, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const Products = () => {
  const cardItems = [
    {
      title: "Add Product",
      description: "Create new product and add to catalog",
      icon: PlusCircle,
      link: "/admin/products/add", // Correct full link
      bgColor: "bg-pink-500",
    },
    {
      title: "Manage Products",
      description: "View, edit, or delete existing products",
      icon: List,
      link: "/admin/products/manageProducts",
      bgColor: "bg-blue-500",
    },
    {
      title: "Product Analytics",
      description: "View sales & performance analytics",
      icon: BarChart2,
      link: "/products/analytics",
      bgColor: "bg-green-500",
    },
    {
      title: "Manage Categories",
      description: "Add or remove product categories",
      icon: Layers,
      link: "/products/categories",
      bgColor: "bg-purple-500",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Products Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardItems.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center"
          >
            <div className={`${item.bgColor} p-4 rounded-full text-white mb-4`}>
              <item.icon className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {item.title}
            </h2>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Products;

// src/components/common/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Heart,
  Settings,
  X,
} from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: Users, label: "Customers", path: "/admin/customers" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
    { icon: Heart, label: "Pet Care", path: "/admin/petcare" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
        <div className="flex items-center">
          {/* <Heart className="w-8 h-8 text-pink-500" /> */}
          <span className="ml-2 text-white text-xl font-bold">Bowlfull Buddies</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="mt-8">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              location.pathname === item.path
                ? "bg-gray-800 text-white border-r-2 border-pink-500"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

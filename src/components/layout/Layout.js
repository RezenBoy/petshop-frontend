// src/components/admin/Layout.js
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../common/admin/Sidebar";
import Navbar from "../common/admin/Navbar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Map routes to titles
  const routeTitles = {
    "/admin": "Dashboard",
    "/admin/orders": "Orders",
    "/admin/products": "Products",
    "/admin/customers": "Customers",
    "/admin/analytics": "Analytics",
    "/admin/petcare": "Pet Care",
    "/admin/settings": "Settings",
    "/admin/products/add": "Add Product", // ✅ nested route
    "/admin/products/manage": "Manage Products",
  };

  const currentTitle = routeTitles[location.pathname] || "Admin Panel";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar setSidebarOpen={setSidebarOpen} title={currentTitle} />

        {/* Outlet renders the current page */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;

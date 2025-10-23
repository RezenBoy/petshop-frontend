// src/components/common/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Settings,
  Package,
  Percent,
  Layers,
  ShoppingCart,
  ClipboardList,
  FileText,
  Users,
  LogOut,
  BarChart3,
  X,
  BadgeCheck,
  TicketPercent,
  PlusSquare,
  ListChecks,
  PlusCircle,
  Boxes,
} from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null); // only one menu open at a time

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: Settings, label: "Master Setup", path: "/admin/master" },

    {
      icon: Package,
      label: "Product Configuration",
      children: [
        { icon: Percent, label: "Tax", path: "/admin/config/tax" },
        { icon: BadgeCheck, label: "Brand", path: "/admin/config/brand" },
        { icon: TicketPercent, label: "Discount", path: "/admin/config/discount" },
      ],
    },

    {
      icon: ShoppingCart,
      label: "Purchase Management",
      children: [
        { icon: PlusSquare, label: "Create Purchase", path: "/admin/purchase/create" },
        { icon: ListChecks, label: "Manage Purchase", path: "/admin/purchase/manage" },
      ],
    },

    {
      icon: ClipboardList,
      label: "Product Management",
      children: [
        { icon: PlusCircle, label: "Create Product", path: "/admin/products/create" },
        { icon: Boxes, label: "Manage Product", path: "/admin/products/manage" },
      ],
    },

    {
      icon: FileText,
      label: "Reports",
      children: [
        { icon: BarChart3, label: "Sales Report", path: "/admin/reports/sales" },
        { icon: FileText, label: "Purchase Report", path: "/admin/reports/purchase" },
      ],
    },

    { icon: BarChart3, label: "Order Management", path: "/admin/orders" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: LogOut, label: "Logout", path: "/logout" },
  ];

  // Auto-open parent if child is active
  useEffect(() => {
    const opened = menuItems.find((parent) =>
      parent.children?.some((c) => c.path === location.pathname)
    );
    if (opened) {
      setOpenMenu(opened.label);
    } else {
      setOpenMenu(null);
    }
  }, [location.pathname]);

  // Toggle menu (accordion behavior)
  const toggleMenu = (label) => {
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  const isParentActive = (item) => {
    if (item.path && location.pathname === item.path) return true;
    if (item.children && item.children.some((c) => c.path === location.pathname)) return true;
    return false;
  };

  const linkBaseClass =
    "flex items-center w-full text-sm font-medium rounded-r-md transition-colors";

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 box-border bg-gray-900 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-0`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
        <span className="text-white text-lg font-semibold">Bowlfull Buddies</span>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar content */}
      <div className="h-[calc(100vh-4rem)] overflow-y-auto pr-3">
        <nav className="mt-4 space-y-1 px-1">
          {menuItems.map((item, idx) => {
            const parentActive = isParentActive(item);
            return (
              <div key={idx}>
                {/* Parent */}
                {item.children ? (
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`${linkBaseClass} justify-between px-4 py-2 ${
                      parentActive
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center truncate">
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-gray-400">
                      {openMenu === item.label ? "−" : "+"}
                    </span>
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`${linkBaseClass} px-4 py-2 ${
                      parentActive
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                )}

                {/* Children */}
                {item.children && openMenu === item.label && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((sub, sidx) => {
                      const childActive = location.pathname === sub.path;
                      return (
                        <Link
                          key={sidx}
                          to={sub.path}
                          className={`flex items-center px-4 py-2 text-sm font-medium truncate ${
                            childActive
                              ? "bg-gray-700 text-white rounded-r-md"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          }`}
                        >
                          <sub.icon className="w-4 h-4 mr-2" />
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

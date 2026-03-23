import React from "react";
import { Menu, Bell, User } from "lucide-react";

const Navbar = ({ setSidebarOpen, title }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 h-16">
        {/* Left: Page Title */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="ml-4 lg:ml-0 text-2xl font-bold text-gray-900">
            {title}
          </h1>
        </div>

        {/* Right: Search + Profile */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React from "react";
import { Menu, Bell, User } from "lucide-react";

const Navbar = ({ setSidebarOpen, title }) => {
  return (
    <header className="bg-surface shadow-sm border-b border-border">
      <div className="flex items-center justify-between px-6 py-4 h-16">
        {/* Left: Page Title */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-textMuted"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="ml-4 lg:ml-0 text-2xl font-bold text-text">
            {title}
          </h1>
        </div>

        {/* Right: Search + Profile */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-textMuted hover:text-text">
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-surface" />
            </div>
            <span className="text-sm font-medium text-text">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../common/user/NavBar"; // ✅ Adjust path if needed

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Fixed Navbar on top */}
      <Navbar />

      {/* ✅ Nested Routes render here */}
      <main className="flex-1 mt-16"> 
        {/* mt-16 to push content below fixed navbar */}
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;

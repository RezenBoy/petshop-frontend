import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../common/user/NavBar"; // ✅ Adjust path if needed

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (token && role === "ADMIN" && location.pathname === "/") {
      navigate("/admin", { replace: true });
    }
  }, [navigate, location]);

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

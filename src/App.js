import "./App.css";
import RegisterForm from "./components/RegisterForm";
// import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/admin/Dashboard";
import HomePage from "./components/HomePage";
import Layout from "./components/layout/Layout";
import Products from "./components/admin/Products";
import Orders from "./components/admin/Orders";
import Customers from "./components/admin/Customers";
import Analytics from "./components/admin/Analytics";
import PetCare from "./components/admin/PetCare";
import Settings from "./components/admin/Settings";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddProduct from "./components/admin/Products/AddProduct";
import ManageProducts from "./components/admin/Products/ManageProducts";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Admin Pages with shared Sidebar + Navbar */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/manageProducts" element={<ManageProducts />} />
          <Route path="customers" element={<Customers />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="petcare" element={<PetCare />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import "./App.css";
import RegisterForm from "./components/RegisterForm";
// import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/admin/Dashboard";
import HomePage from "./components/HomePage";
import Layout from "./components/layout/Layout";
import Orders from "./components/admin/Orders";
import Customers from "./components/admin/Users";
import Settings from "./components/admin/Settings";
import MasterSetup from "./components/admin/MasterSetup";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddProduct from "./components/admin/Products Management/AddProduct";
import ManageProducts from "./components/admin/Products Management/ManageProducts";
import Categories from "./components/admin/Product Config/Categries";
import Discount from "./components/admin/Product Config/Discount";
import Tax from "./components/admin/Product Config/Tax";
import Brand from "./components/admin/Product Config/Brand";
import CreatePurchase from "./components/admin/Purchase Management/CreatePurchase";
import ManagePurchase from "./components/admin/Purchase Management/ManagePurchase";
import SalesReport from "./components/admin/Report/SalesReport";
import PurchaseReport from "./components/admin/Report/PurchaseReport";

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
          <Route path="products/create" element={<AddProduct />} />
          <Route path="products/manage" element={<ManageProducts />} />
          <Route path="config/categories" element={<Categories />} />
          <Route path="config/discount" element={<Discount />} />
          <Route path="config/tax" element={<Tax />} />
          <Route path="config/brand" element={<Brand />} />
          <Route path="users" element={<Customers />} />
          <Route path="purchase/create" element={<CreatePurchase />} />
          <Route path="purchase/manage" element={<ManagePurchase />} />
          <Route path="reports/sales" element={<SalesReport />} />
          <Route path="reports/purchase" element={<PurchaseReport />} />
          <Route path="settings" element={<Settings />} />
          <Route path="master" element={<MasterSetup />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

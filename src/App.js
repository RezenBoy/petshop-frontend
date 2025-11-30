import "./App.css";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/admin/Dashboard";
import HomePage from "./components/HomePage";
import Layout from "./components/layout/Layout";
import UserProfile from "./pages/user/userProfile";
import Orders from "./components/admin/Orders";
import Customers from "./components/admin/Users";
import Settings from "./components/admin/Settings";
import MasterSetup from "./components/admin/MasterSetup";
import ProductView from "./components/ProductView";
import CartPage from "./pages/user/CartPage";
import ContactPage from "./pages/user/ContactPage.js";
import AboutPage from "./components/AboutPage.js";
import OrdersPage from "./pages/user/OrdersPage.js";
import ShopPage from "./pages/ShopPage.js";
import ScrollToTop from "./components/common/ScrollToTop";

import ProtectedRoute from "./components/common/ProductionRoute";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddProduct from "./components/admin/Products Management/AddProduct";
import ManageProducts from "./components/admin/Products Management/ManageProducts";
import Discount from "./components/admin/Product Config/Discount";
import Tax from "./components/admin/Product Config/Tax";
import Brand from "./components/admin/Product Config/Brand";
import CreatePurchase from "./components/admin/Purchase Management/CreatePurchase";
import ManagePurchase from "./components/admin/Purchase Management/ManagePurchase";
import SalesReport from "./components/admin/Report/SalesReport";
import PurchaseReport from "./components/admin/Report/PurchaseReport";
import UserLayout from "./components/layout/UserLayout";
import axios from "axios";

function setAuthHeaderFromStorage() {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}
setAuthHeaderFromStorage();
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/*Public Pages */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/*User Pages with fixed Navbar using UserLayout */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="user/profile" element={<UserProfile />} />
          <Route path="product/:id" element={<ProductView />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="user/orders" element={<OrdersPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>

        {/*Admin Pages with Admin Layout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products/create" element={<AddProduct />} />
          <Route path="products/manage" element={<ManageProducts />} />
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

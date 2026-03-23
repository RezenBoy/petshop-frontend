import "./App.css";
import RegisterForm from "./pages/auth/RegisterForm";
import LoginForm from "./pages/auth/LoginForm";
import Dashboard from "./pages/admin/Dashboard";
import HomePage from "./pages/HomePage";
import Layout from "./components/layout/Layout";
import UserProfile from "./pages/user/userProfile";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import MasterSetup from "./pages/admin/MasterSetup";
import ProductView from "./pages/ProductView";
import CartPage from "./pages/user/CartPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import OrdersPage from "./pages/user/OrdersPage";
import ShopPage from "./pages/ShopPage";
import ScrollToTop from "./components/common/ScrollToTop";

import ProtectedRoute from "./components/common/ProductionRoute";
import Logout from "./components/common/Logout";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddProduct from "./pages/admin/products-management/AddProduct";
import ManageProducts from "./pages/admin/products-management/ManageProducts";
import Discount from "./pages/admin/product-config/Discount";
import Tax from "./pages/admin/product-config/Tax";
import Brand from "./pages/admin/product-config/Brand";
import CreatePurchase from "./pages/admin/purchase-management/CreatePurchase";
import ManagePurchase from "./pages/admin/purchase-management/ManagePurchase";
import SalesReport from "./pages/admin/report/SalesReport";
import PurchaseReport from "./pages/admin/report/PurchaseReport";
import UserLayout from "./components/layout/UserLayout";
import axios from "axios";

import EditProduct from "./pages/admin/products-management/EditProduct";

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
        <Route path="/logout" element={<Logout />} />

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
          <Route path="products/edit/:id" element={<EditProduct />} />
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

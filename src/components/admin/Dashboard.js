import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  Heart,
  TrendingUp,
  TrendingDown,
  Menu,
  X,
  Home,
  User,
  Settings,
  Bell,
  Search,
} from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");

  // Sample data
  const stats = [
    {
      title: "Total Orders",
      value: "1,847",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Revenue",
      value: "₹2,84,950",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Products Sold",
      value: "3,264",
      change: "-2.1%",
      trend: "down",
      icon: Package,
      color: "bg-purple-500",
    },
    {
      title: "Active Customers",
      value: "892",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "bg-orange-500",
    },
  ];

  const recentOrders = [
    {
      id: "#3492",
      customer: "Sarah Johnson",
      product: "Premium Dog Food",
      amount: "₹2,450",
      status: "Delivered",
    },
    {
      id: "#3491",
      customer: "Mike Chen",
      product: "Cat Litter Box",
      amount: "₹1,280",
      status: "Processing",
    },
    {
      id: "#3490",
      customer: "Emma Davis",
      product: "Bird Cage Large",
      amount: "₹5,200",
      status: "Shipped",
    },
    {
      id: "#3489",
      customer: "John Smith",
      product: "Dog Leash Set",
      amount: "₹890",
      status: "Delivered",
    },
    {
      id: "#3488",
      customer: "Lisa Wang",
      product: "Cat Scratching Post",
      amount: "₹1,650",
      status: "Processing",
    },
  ];

  const topProducts = [
    { name: "Premium Dog Food (15kg)", sales: 342, revenue: "₹83,580" },
    { name: "Cat Litter (10kg)", sales: 298, revenue: "₹44,700" },
    { name: "Dog Chew Toys Set", sales: 276, revenue: "₹27,600" },
    { name: "Bird Food Mix", sales: 234, revenue: "₹35,100" },
    { name: "Pet Grooming Kit", sales: 189, revenue: "₹56,700" },
  ];

  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: ShoppingCart, label: "Orders" },
    { icon: Package, label: "Products" },
    { icon: Users, label: "Customers" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Heart, label: "Pet Care" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-pink-500" />
            <span className="ml-2 text-white text-xl font-bold">
              Bowlfull Buddies
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-8">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={`/${item.label.toLowerCase()}`}
              className={`flex items-center px-6 py-3 text-sm font-medium ${
                item.active
                  ? "bg-gray-800 text-white border-r-2 border-pink-500"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="ml-4 lg:ml-0 text-2xl font-bold text-gray-900">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
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

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Period selector */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
              <p className="text-gray-600">Track your pet shop performance</p>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-gray-600 text-sm ml-2">
                    vs last month
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.product}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Top Products
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {product.sales} sold
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {product.revenue}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sales Chart Placeholder */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Sales Overview
              </h3>
            </div>
            <div className="p-6">
              <div className="h-64 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Sales chart would be rendered here
                  </p>
                  <p className="text-sm text-gray-500">
                    Integration with chart library like Recharts recommended
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;

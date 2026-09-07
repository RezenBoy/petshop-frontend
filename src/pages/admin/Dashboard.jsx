import React, { useState } from "react";
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");

  // Sample data
  const stats = [
    {
      title: "Total Orders",
      value: "1,847",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
      color: "bg-primary text-surface",
    },
    {
      title: "Revenue",
      value: "₹2,84,950",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      color: "bg-accent text-text",
    },
    {
      title: "Products Sold",
      value: "3,264",
      change: "-2.1%",
      trend: "down",
      icon: Package,
      color: "bg-secondary text-primary",
    },
    {
      title: "Active Customers",
      value: "892",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "bg-secondary text-text",
    },
  ];

  const recentOrders = [
    { id: "#3492", customer: "Sarah Johnson", product: "Premium Dog Food", amount: "₹2,450", status: "Delivered" },
    { id: "#3491", customer: "Mike Chen", product: "Cat Litter Box", amount: "₹1,280", status: "Processing" },
    { id: "#3490", customer: "Emma Davis", product: "Bird Cage Large", amount: "₹5,200", status: "Shipped" },
    { id: "#3489", customer: "John Smith", product: "Dog Leash Set", amount: "₹890", status: "Delivered" },
    { id: "#3488", customer: "Lisa Wang", product: "Cat Scratching Post", amount: "₹1,650", status: "Processing" },
  ];

  const topProducts = [
    { name: "Premium Dog Food (15kg)", sales: 342, revenue: "₹83,580" },
    { name: "Cat Litter (10kg)", sales: 298, revenue: "₹44,700" },
    { name: "Dog Chew Toys Set", sales: 276, revenue: "₹27,600" },
    { name: "Bird Food Mix", sales: 234, revenue: "₹35,100" },
    { name: "Pet Grooming Kit", sales: 189, revenue: "₹56,700" },
  ];

  return (
    <main className="flex-1 overflow-auto p-6 bg-background">
      {/* Period selector */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-text">Overview</h2>
          <p className="text-textMuted">Track your pet shop performance</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-border bg-surface text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="bg-surface rounded-xl shadow-sm p-6 border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-textMuted text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-text mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-textMuted text-sm ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-surface rounded-xl shadow-sm border border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-text">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-border">
                {recentOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-background/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textMuted">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textMuted">{order.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">{order.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : order.status === "Processing"
                            ? "bg-accent/20 text-text"
                            : "bg-secondary/40 text-primary"
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
        <div className="bg-surface rounded-xl shadow-sm border border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-text">Top Products</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/50"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text truncate">{product.name}</p>
                    <p className="text-xs text-textMuted">{product.sales} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sales Chart Placeholder */}
      <div className="mt-8 bg-surface rounded-xl shadow-sm border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-text">Sales Overview</h3>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gradient-to-r from-secondary/30 via-surface to-accent/20 rounded-lg flex items-center justify-center border border-border/40">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-text font-medium">Sales chart would be rendered here</p>
              <p className="text-sm text-textMuted">Integration with chart library like Recharts recommended</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;

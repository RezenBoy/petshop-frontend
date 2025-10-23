import React, { useState } from "react";

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: "ORD123456",
      date: "2025-10-18",
      status: "Delivered",
      total: "₹4,999",
      items: [
        { name: "Premium Dog Food - 5kg", quantity: 2, price: "₹1,999", image: "🦴" },
        { name: "Pet Shampoo", quantity: 1, price: "₹599", image: "🧴" },
        { name: "Chew Toys Set", quantity: 1, price: "₹899", image: "🎾" },
      ],
      shippingAddress: "123 Pet Street, Animal City, Punjab 147001",
      deliveryDate: "2025-10-20",
      trackingNumber: "TRK987654321",
    },
    {
      id: "ORD123457",
      date: "2025-10-16",
      status: "Shipped",
      total: "₹3,499",
      items: [
        { name: "Cat Scratching Post", quantity: 1, price: "₹2,999", image: "🐱" },
        { name: "Cat Treats", quantity: 1, price: "₹499", image: "🍖" },
      ],
      shippingAddress: "123 Pet Street, Animal City, Punjab 147001",
      estimatedDelivery: "2025-10-22",
      trackingNumber: "TRK987654322",
    },
    {
      id: "ORD123458",
      date: "2025-10-15",
      status: "Processing",
      total: "₹2,799",
      items: [
        { name: "Pet Carrier Bag", quantity: 1, price: "₹2,499", image: "👜" },
        { name: "Travel Water Bowl", quantity: 1, price: "₹299", image: "🥣" },
      ],
      shippingAddress: "123 Pet Street, Animal City, Punjab 147001",
      estimatedDelivery: "2025-10-24",
    },
    {
      id: "ORD123459",
      date: "2025-10-12",
      status: "Cancelled",
      total: "₹1,999",
      items: [
        { name: "Pet Bed - Large", quantity: 1, price: "₹1,999", image: "🛏️" },
      ],
      shippingAddress: "123 Pet Street, Animal City, Punjab 147001",
      cancelReason: "Requested by customer",
    },
    {
      id: "ORD123460",
      date: "2025-10-10",
      status: "Delivered",
      total: "₹5,499",
      items: [
        { name: "Automatic Pet Feeder", quantity: 1, price: "₹3,999", image: "🍽️" },
        { name: "Pet Food Storage", quantity: 1, price: "₹1,499", image: "📦" },
      ],
      shippingAddress: "123 Pet Street, Animal City, Punjab 147001",
      deliveryDate: "2025-10-14",
      trackingNumber: "TRK987654323",
    },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      Delivered: {
        color: "bg-green-100 text-green-700 border-green-200",
        dotColor: "bg-green-500",
        icon: "✓",
      },
      Shipped: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        dotColor: "bg-blue-500",
        icon: "📦",
      },
      Processing: {
        color: "bg-amber-100 text-amber-700 border-amber-200",
        dotColor: "bg-amber-500",
        icon: "⏱️",
      },
      Cancelled: {
        color: "bg-red-100 text-red-700 border-red-200",
        dotColor: "bg-red-500",
        icon: "✕",
      },
      Pending: {
        color: "bg-gray-100 text-gray-700 border-gray-200",
        dotColor: "bg-gray-500",
        icon: "!",
      },
    };
    return configs[status] || configs.Pending;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesFilter =
      filterStatus === "all" || order.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">My Orders</h1>
          <p className="text-sm sm:text-base text-gray-500">Track and manage all your pet supply orders</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search by order ID or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-sm sm:text-base"
              />
            </div>
            <div className="relative min-w-[140px] sm:min-w-[180px]">
              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">⚙️</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer text-sm sm:text-base"
              >
                <option value="all">All Orders</option>
                <option value="delivered">Delivered</option>
                <option value="shipped">Shipped</option>
                <option value="processing">Processing</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <span className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-16 text-center shadow-sm">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-sm sm:text-base text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const isExpanded = selectedOrder === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  {/* Order Header */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4 mb-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="h-12 sm:h-14 w-12 sm:w-14 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0 text-lg sm:text-2xl">
                          📦
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 break-all">
                            Order #{order.id}
                          </h3>
                          <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
                            <span>📅 {order.date}</span>
                            <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-lg sm:text-xl font-bold text-gray-900">{order.total}</span>
                        <span className={`inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold border w-fit ${statusConfig.color}`}>
                          <span>{statusConfig.icon}</span>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 overflow-x-auto pb-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 sm:px-3 py-2 flex-shrink-0 text-xs sm:text-sm"
                        >
                          <span className="text-lg sm:text-2xl">{item.image}</span>
                          <div className="hidden sm:block">
                            <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                            <p className="text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          setSelectedOrder(isExpanded ? null : order.id)
                        }
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:opacity-90 transition-all shadow-sm flex-1 sm:flex-none"
                      >
                        👁️ {isExpanded ? "Hide" : "View"} Details
                      </button>

                      {order.trackingNumber && (
                        <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all flex-1 sm:flex-none">
                          🚚 Track
                        </button>
                      )}

                      <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all flex-1 sm:flex-none">
                        📥 Invoice
                      </button>

                      {order.status === "Delivered" && (
                        <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all flex-1 sm:flex-none">
                          🔄 Reorder
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* Order Items Details */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                            📦 Order Items
                          </h4>
                          <div className="space-y-2 sm:space-y-3">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2.5 sm:p-3 bg-white rounded-xl border border-gray-100 gap-2"
                              >
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                  <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-lg bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center text-lg sm:text-2xl flex-shrink-0">
                                    {item.image}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <p className="font-semibold text-gray-900 text-sm sm:text-base flex-shrink-0">{item.price}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery Information */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                            📍 Delivery Information
                          </h4>
                          <div className="space-y-2 sm:space-y-4">
                            <div className="p-3 sm:p-4 bg-white rounded-xl border border-gray-100">
                              <p className="text-xs sm:text-sm text-gray-500 mb-1">
                                Shipping Address
                              </p>
                              <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                                {order.shippingAddress}
                              </p>
                            </div>

                            {order.trackingNumber && (
                              <div className="p-3 sm:p-4 bg-white rounded-xl border border-gray-100">
                                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                                  Tracking Number
                                </p>
                                <p className="text-xs sm:text-sm font-medium text-gray-900 font-mono break-all">
                                  {order.trackingNumber}
                                </p>
                              </div>
                            )}

                            {order.deliveryDate && (
                              <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                <p className="text-xs sm:text-sm text-green-700 mb-1 flex items-center gap-2">
                                  ✓ Delivered On
                                </p>
                                <p className="text-xs sm:text-sm font-semibold text-green-900">
                                  {order.deliveryDate}
                                </p>
                              </div>
                            )}

                            {order.estimatedDelivery && (
                              <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                <p className="text-xs sm:text-sm text-blue-700 mb-1 flex items-center gap-2">
                                  ⏱️ Estimated Delivery
                                </p>
                                <p className="text-xs sm:text-sm font-semibold text-blue-900">
                                  {order.estimatedDelivery}
                                </p>
                              </div>
                            )}

                            {order.cancelReason && (
                              <div className="p-3 sm:p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-200">
                                <p className="text-xs sm:text-sm text-red-700 mb-1 flex items-center gap-2">
                                  ✕ Cancellation Reason
                                </p>
                                <p className="text-xs sm:text-sm font-semibold text-red-900">
                                  {order.cancelReason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-br from-pink-500 to-blue-500 rounded-2xl p-6 sm:p-8 text-white text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Need Help with Your Order?</h3>
          <p className="text-sm sm:text-base text-white/90 mb-4 sm:mb-6">
            Our customer support team is here to assist you
          </p>
          <button className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium bg-white text-pink-600 hover:bg-gray-50 transition-all shadow-sm inline-flex items-center gap-2">
            Contact Support
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
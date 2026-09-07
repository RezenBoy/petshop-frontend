import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Search, Settings, ChevronDown, Package, Eye, EyeOff,
  Truck, Download, RotateCcw, MapPin, Box, CheckCircle2,
  Clock, XCircle, AlertCircle, Loader2, Calendar, Hash,
  Headphones, ArrowRight
} from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL;

// ─── Constants ─────────────────────────────────────────────
const STATUS_CONFIG = {
  Delivered: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    icon: CheckCircle2,
    label: "Delivered",
  },
  Shipped: {
    color: "bg-secondary/30 text-primary border-border",
    dotColor: "bg-primary",
    icon: Truck,
    label: "Shipped",
  },
  Processing: {
    color: "bg-secondaryAccent/30 text-accent border-secondaryAccent",
    dotColor: "bg-accent",
    icon: Clock,
    label: "Processing",
  },
  Cancelled: {
    color: "bg-red-50 text-red-700 border-red-200",
    dotColor: "bg-red-500",
    icon: XCircle,
    label: "Cancelled",
  },
  Pending: {
    color: "bg-secondary/20 text-textMuted border-border",
    dotColor: "bg-textMuted",
    icon: AlertCircle,
    label: "Pending",
  },
};

const FILTER_OPTIONS = [
  { value: "all", label: "All Orders" },
  { value: "delivered", label: "Delivered" },
  { value: "shipped", label: "Shipped" },
  { value: "processing", label: "Processing" },
  { value: "cancelled", label: "Cancelled" },
];

// ─── Sub-Components ──────────────────────────────────────

const LoadingState = () => (
  <div className="bg-surface rounded-2xl border border-border p-8 sm:p-16 text-center shadow-sm">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <p className="text-textMuted">Loading your orders...</p>
    </div>
  </div>
);

const EmptyState = ({ searchQuery, filterStatus }) => (
  <div className="bg-surface rounded-2xl border border-border p-8 sm:p-16 text-center shadow-sm">
    <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
      <Package className="h-8 w-8 text-primary" />
    </div>
    <h3 className="text-base sm:text-lg font-semibold text-text mb-2">
      No orders found
    </h3>
    <p className="text-sm sm:text-base text-textMuted">
      {searchQuery || filterStatus !== "all"
        ? "Try adjusting your search or filters"
        : "Your order history will appear here"}
    </p>
  </div>
);

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold border ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};

const OrderItemPreview = ({ item }) => (
  <div className="flex items-center gap-2 bg-secondary/15 rounded-lg border border-border/50 px-2.5 sm:px-3 py-2 flex-shrink-0 text-xs sm:text-sm">
    <div className="h-8 w-8 rounded-md bg-secondary/30 flex items-center justify-center flex-shrink-0">
      <Box className="h-4 w-4 text-primary" />
    </div>
    <div className="hidden sm:block min-w-0">
      <p className="font-medium text-text line-clamp-1">{item.name}</p>
      <p className="text-textMuted">Qty: {item.quantity}</p>
    </div>
  </div>
);

const OrderItemDetail = ({ item }) => (
  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-surface rounded-xl border border-border gap-2">
    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
      <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-lg bg-secondary/30 flex items-center justify-center flex-shrink-0">
        <Box className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="font-medium text-text text-xs sm:text-sm line-clamp-2">
          {item.name}
        </p>
        <p className="text-xs text-textMuted">Qty: {item.quantity}</p>
      </div>
    </div>
    <p className="font-semibold text-text text-sm sm:text-base flex-shrink-0">
      {item.price}
    </p>
  </div>
);

const InfoCard = ({ icon: Icon, label, value, variant = "default" }) => {
  const variants = {
    default: "bg-surface border-border",
    success: "bg-emerald-50/50 border-emerald-200",
    info: "bg-secondary/20 border-border",
    danger: "bg-red-50/50 border-red-200",
  };
  const textColors = {
    default: "text-text",
    success: "text-emerald-900",
    info: "text-text",
    danger: "text-red-900",
  };
  const labelColors = {
    default: "text-textMuted",
    success: "text-emerald-700",
    info: "text-primary",
    danger: "text-red-700",
  };

  return (
    <div className={`p-3 sm:p-4 rounded-xl border ${variants[variant]}`}>
      <p className={`text-xs sm:text-sm mb-1 flex items-center gap-2 ${labelColors[variant]}`}>
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className={`text-xs sm:text-sm font-medium break-words ${textColors[variant]}`}>
        {value}
      </p>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────
const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/user/orders`);
      const formattedOrders = res.data.map((o) => ({
        id: o.id.toString(),
        date: new Date(o.orderDateTime).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: o.orderStatus
          ? o.orderStatus.charAt(0).toUpperCase() +
            o.orderStatus.slice(1).toLowerCase()
          : "Pending",
        total: o.totalPrice,
        items: o.items
          ? o.items.map((i) => ({
              name: i.productName,
              quantity: i.quantity,
              price: i.price,
            }))
          : [],
        shippingAddress: o.shippingAddress,
        trackingNumber: o.trackingNumber,
        deliveryDate: o.deliveryDate,
        estimatedDelivery: o.estimatedDelivery,
        cancelReason: o.cancelReason,
      }));
      setOrders(formattedOrders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesFilter =
        filterStatus === "all" ||
        order.status.toLowerCase() === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [orders, searchQuery, filterStatus]);

  const toggleOrderDetails = useCallback((orderId) => {
    setSelectedOrder((prev) => (prev === orderId ? null : orderId));
  }, []);

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-1 sm:mb-2">
            My Orders
          </h1>
          <p className="text-sm sm:text-base text-textMuted">
            Track and manage all your pet supply orders
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-surface rounded-2xl border border-border p-4 sm:p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-textMuted" />
              <input
                type="text"
                placeholder="Search by order ID or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl border border-border bg-surface text-text focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
              />
            </div>
            <div className="relative min-w-[140px] sm:min-w-[180px]">
              <Settings className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-textMuted pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 rounded-xl border border-border bg-surface text-text focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-sm sm:text-base"
              >
                {FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none h-4 w-4 text-textMuted" />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3 sm:space-y-4">
          {loading ? (
            <LoadingState />
          ) : filteredOrders.length === 0 ? (
            <EmptyState searchQuery={searchQuery} filterStatus={filterStatus} />
          ) : (
            filteredOrders.map((order) => {
              const isExpanded = selectedOrder === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  {/* Order Header */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4 mb-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="h-12 sm:h-14 w-12 sm:w-14 rounded-xl bg-primary flex items-center justify-center text-surface flex-shrink-0">
                          <Package className="h-6 w-6 sm:h-7 sm:w-7" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-text mb-1 break-all">
                            Order #{order.id}
                          </h3>
                          <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1 text-xs sm:text-sm text-textMuted">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {order.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              {order.items.length} {order.items.length === 1 ? "item" : "items"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-lg sm:text-xl font-bold text-text">
                          ₹{order.total}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 overflow-x-auto pb-2">
                      {order.items.map((item, idx) => (
                        <OrderItemPreview key={idx} item={item} />
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => toggleOrderDetails(order.id)}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-primary hover:bg-primary/90 text-surface transition-all shadow-sm flex-1 sm:flex-none"
                      >
                        {isExpanded ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5" />
                            View Details
                          </>
                        )}
                      </button>

                      {order.trackingNumber && (
                        <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-border text-text hover:bg-secondary/20 transition-all flex-1 sm:flex-none">
                          <Truck className="h-3.5 w-3.5" />
                          Track
                        </button>
                      )}

                      <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-border text-text hover:bg-secondary/20 transition-all flex-1 sm:flex-none">
                        <Download className="h-3.5 w-3.5" />
                        Invoice
                      </button>

                      {order.status === "Delivered" && (
                        <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-border text-text hover:bg-secondary/20 transition-all flex-1 sm:flex-none">
                          <RotateCcw className="h-3.5 w-3.5" />
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-border bg-secondary/10 p-4 sm:p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* Order Items Details */}
                        <div>
                          <h4 className="font-semibold text-text mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                            <Package className="h-4 w-4 text-primary" />
                            Order Items
                          </h4>
                          <div className="space-y-2 sm:space-y-3">
                            {order.items.map((item, idx) => (
                              <OrderItemDetail key={idx} item={item} />
                            ))}
                          </div>
                        </div>

                        {/* Delivery Information */}
                        <div>
                          <h4 className="font-semibold text-text mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                            <MapPin className="h-4 w-4 text-primary" />
                            Delivery Information
                          </h4>
                          <div className="space-y-2 sm:space-y-4">
                            <InfoCard
                              icon={MapPin}
                              label="Shipping Address"
                              value={order.shippingAddress}
                            />

                            {order.trackingNumber && (
                              <InfoCard
                                icon={Hash}
                                label="Tracking Number"
                                value={order.trackingNumber}
                              />
                            )}

                            {order.deliveryDate && (
                              <InfoCard
                                icon={CheckCircle2}
                                label="Delivered On"
                                value={order.deliveryDate}
                                variant="success"
                              />
                            )}

                            {order.estimatedDelivery && (
                              <InfoCard
                                icon={Clock}
                                label="Estimated Delivery"
                                value={order.estimatedDelivery}
                                variant="info"
                              />
                            )}

                            {order.cancelReason && (
                              <InfoCard
                                icon={XCircle}
                                label="Cancellation Reason"
                                value={order.cancelReason}
                                variant="danger"
                              />
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
        <div className="mt-8 bg-gradient-to-br from-primary to-text rounded-2xl p-6 sm:p-8 text-surface text-center">
          <div className="w-12 h-12 bg-surface/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Headphones className="h-6 w-6 text-surface" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mb-2">
            Need Help with Your Order?
          </h3>
          <p className="text-sm sm:text-base text-surface/90 mb-4 sm:mb-6">
            Our customer support team is here to assist you
          </p>
          <button className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium bg-surface text-primary hover:bg-secondary/20 hover:text-text transition-all shadow-sm inline-flex items-center gap-2">
            Contact Support
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
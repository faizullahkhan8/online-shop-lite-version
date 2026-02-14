import { useEffect, useState } from "react";
import {
    useGetOrderById,
    useGetOrderByTrackingToken,
} from "../api/hooks/orders.api";
import { readGuestOrders } from "../utils/guestOrders";
import {
    Loader2,
    Receipt,
    ChevronRight,
    Search,
    CheckCircle2,
    Package,
    MapPin,
    CreditCard,
    Calendar,
    User,
    Phone,
    Truck,
} from "lucide-react";

const TrackOrderPage = () => {
    const [orderId, setOrderId] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");
    const [savedOrders, setSavedOrders] = useState([]);

    const { getOrderById, loading: loadingById } = useGetOrderById();
    const { getOrderByTrackingToken, loading: loadingByToken } =
        useGetOrderByTrackingToken();

    const loading = loadingById || loadingByToken;

    /* ---------------- Load localStorage once ---------------- */
    useEffect(() => {
        const ids = readGuestOrders();
        setSavedOrders(ids || []);
    }, []);

    /* ---------------- Fetch when selectedOrderId changes ---------------- */
    useEffect(() => {
        if (!selectedOrderId) return;

        const fetchOrder = async () => {
            setError("");
            setOrder(null);

            let resp = await getOrderById(selectedOrderId).catch(() => null);

            if (!resp) {
                resp = await getOrderByTrackingToken(selectedOrderId).catch(
                    () => null,
                );
            }

            const resolvedOrder = resp?.order || resp;

            if (resolvedOrder && (resolvedOrder._id || resolvedOrder.id)) {
                setOrder(resolvedOrder);
            } else {
                setError("ORDER NOT FOUND.");
            }
        };

        fetchOrder();
    }, [selectedOrderId]);

    /* ---------------- Manual search ---------------- */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;
        setSelectedOrderId(orderId.trim());
    };

    /* ---------------- Click saved order ---------------- */
    const handleSavedOrderClick = (id) => {
        setSelectedOrderId(id);
        setOrderId(id); // Also update the search input
    };

    /* ---------------- Format date ---------------- */
    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    /* ---------------- Status badge color ---------------- */
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return "bg-green-100 text-green-800";
            case "shipped":
                return "bg-blue-100 text-blue-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 lg:px-12 py-16 max-w-7xl">
                {/* HEADER */}
                <div className="mb-12">
                    <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">
                        Track Your Order
                    </h1>
                    <p className="text-gray-600">
                        Enter your order ID or select from recent orders
                    </p>
                </div>

                {/* SEARCH */}
                <div className="mb-12">
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                                size={20}
                            />
                            <input
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="ENTER YOUR ORDER ID..."
                                className="w-full border border-gray-300  px-12 py-4 uppercase tracking-widest outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white px-8 py-4  uppercase tracking-widest disabled:opacity-50 hover:bg-gray-800 transition-colors"
                        >
                            {loading ? (
                                <Loader2
                                    className="animate-spin mx-auto"
                                    size={20}
                                />
                            ) : (
                                "Track"
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 ">
                            <p className="text-sm text-red-600 uppercase tracking-widest">
                                {error}
                            </p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT: ORDER DETAILS */}
                    <div className="lg:col-span-8">
                        {loading && (
                            <div className="bg-white border border-gray-200  p-16 flex items-center justify-center">
                                <Loader2
                                    className="animate-spin text-gray-400"
                                    size={40}
                                />
                            </div>
                        )}

                        {!loading && order && (
                            <div className="space-y-6">
                                {/* Order Summary Card */}
                                <div className="bg-white border border-gray-200  p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold uppercase tracking-wider mb-1">
                                                Order #{order._id || order.id}
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                Placed on{" "}
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${getStatusColor(
                                                order.status,
                                            )}`}
                                        >
                                            {order.status || "Processing"}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                                        <div className="flex items-start gap-3">
                                            <CreditCard
                                                className="text-gray-400 mt-1"
                                                size={20}
                                            />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase mb-1">
                                                    Grand Total
                                                </p>
                                                <p className="text-2xl font-bold">
                                                    RS{" "}
                                                    {Number(
                                                        order.grandTotal || 0,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Truck
                                                className="text-gray-400 mt-1"
                                                size={20}
                                            />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase mb-1">
                                                    Shipping Method
                                                </p>
                                                <p className="text-sm font-semibold capitalize">
                                                    {order.shippingMethod ||
                                                        "Standard"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    RS{" "}
                                                    {Number(
                                                        order.shippingFee || 0,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Calendar
                                                className="text-gray-400 mt-1"
                                                size={20}
                                            />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase mb-1">
                                                    Payment Method
                                                </p>
                                                <p className="text-sm font-semibold uppercase">
                                                    {order.payment?.method ||
                                                        "N/A"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {order.payment?.ispaid
                                                        ? "Paid"
                                                        : "Unpaid"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Information */}
                                <div className="bg-white border border-gray-200  p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin size={20} />
                                        <h3 className="text-lg font-bold uppercase tracking-wider">
                                            Delivery Information
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3">
                                            <User
                                                className="text-gray-400 mt-1"
                                                size={18}
                                            />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase mb-1">
                                                    Recipient
                                                </p>
                                                <p className="font-semibold">
                                                    {order.recipient?.name ||
                                                        "Guest User"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Phone
                                                className="text-gray-400 mt-1"
                                                size={18}
                                            />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase mb-1">
                                                    Phone
                                                </p>
                                                <p className="font-semibold">
                                                    {order.recipient?.phone ||
                                                        "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 flex items-start gap-3">
                                            <MapPin
                                                className="text-gray-400 mt-1"
                                                size={18}
                                            />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase mb-1">
                                                    Delivery Address
                                                </p>
                                                <p className="font-semibold">
                                                    {order.recipient?.street}
                                                    {order.recipient
                                                        ?.addressLine2 &&
                                                        `, ${order.recipient.addressLine2}`}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {[
                                                        order.recipient?.city,
                                                        order.recipient?.state,
                                                        order.recipient
                                                            ?.postalCode,
                                                        order.recipient
                                                            ?.country,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="bg-white border border-gray-200  p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Package size={20} />
                                        <h3 className="text-lg font-bold uppercase tracking-wider">
                                            Order Items
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        {order.items?.map((item, index) => {
                                            // Handle both populated and non-populated product
                                            const productName =
                                                typeof item.product === "object"
                                                    ? item.product?.name
                                                    : null;
                                            const productId =
                                                typeof item.product === "object"
                                                    ? item.product?._id ||
                                                      item.product?.id
                                                    : item.product;

                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-start justify-between p-4 bg-gray-50 "
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                {productName ? (
                                                                    <>
                                                                        <p className="font-semibold text-lg">
                                                                            {
                                                                                productName
                                                                            }
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            ID:{" "}
                                                                            {
                                                                                productId
                                                                            }
                                                                        </p>
                                                                    </>
                                                                ) : (
                                                                    <p className="font-semibold">
                                                                        Product
                                                                        ID:{" "}
                                                                        {
                                                                            productId
                                                                        }
                                                                    </p>
                                                                )}
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    Quantity:{" "}
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </p>
                                                            </div>
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                                    item.status ===
                                                                    "cancelled"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : "bg-green-100 text-green-800"
                                                                }`}
                                                            >
                                                                {item.status ||
                                                                    "Active"}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                            <div>
                                                                <p className="text-gray-500">
                                                                    Price
                                                                </p>
                                                                <p className="font-semibold">
                                                                    RS{" "}
                                                                    {Number(
                                                                        item.price ||
                                                                            0,
                                                                    ).toLocaleString()}
                                                                </p>
                                                            </div>

                                                            {item.discount >
                                                                0 && (
                                                                <div>
                                                                    <p className="text-gray-500">
                                                                        Discount
                                                                    </p>
                                                                    <p className="font-semibold text-green-600">
                                                                        -Rs:
                                                                        {
                                                                            item.discount
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {item.promotion
                                                                ?.title && (
                                                                <div className="md:col-span-2">
                                                                    <p className="text-gray-500">
                                                                        Promotion
                                                                    </p>
                                                                    <p className="font-semibold text-blue-600">
                                                                        {
                                                                            item
                                                                                .promotion
                                                                                .title
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}

                                                            <div>
                                                                <p className="text-gray-500">
                                                                    Total
                                                                </p>
                                                                <p className="font-bold text-lg">
                                                                    RS{" "}
                                                                    {Number(
                                                                        item.totalAmount ||
                                                                            0,
                                                                    ).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {item.cancellationReason && (
                                                            <p className="mt-2 text-sm text-red-600">
                                                                Cancellation
                                                                reason:{" "}
                                                                {
                                                                    item.cancellationReason
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Order Totals */}
                                    <div className="mt-6 pt-6 border-t space-y-2">
                                        {order.taxAmount > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">
                                                    Tax Amount
                                                </span>
                                                <span className="font-semibold">
                                                    RS{" "}
                                                    {Number(
                                                        order.taxAmount || 0,
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                Shipping Fee
                                            </span>
                                            <span className="font-semibold">
                                                RS{" "}
                                                {Number(
                                                    order.shippingFee || 0,
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                            <span>Grand Total</span>
                                            <span>
                                                RS{" "}
                                                {Number(
                                                    order.grandTotal || 0,
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cancellation Info */}
                                {order.status === "cancelled" &&
                                    order.cancellationReason && (
                                        <div className="bg-red-50 border border-red-200  p-6">
                                            <h3 className="text-lg font-bold text-red-800 mb-2">
                                                Order Cancelled
                                            </h3>
                                            <p className="text-red-700">
                                                Reason:{" "}
                                                {order.cancellationReason}
                                            </p>
                                        </div>
                                    )}
                            </div>
                        )}

                        {!loading && !order && !error && (
                            <div className="bg-white border border-gray-200  p-16 text-center">
                                <Package
                                    className="mx-auto text-gray-300 mb-4"
                                    size={64}
                                />
                                <p className="text-gray-500 text-lg">
                                    Enter an order ID to track your order
                                </p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: SAVED ORDERS */}
                    <div className="lg:col-span-4">
                        <div className="bg-white border border-gray-200  p-6 sticky top-4">
                            <div className="flex items-center gap-3 mb-6">
                                <Receipt size={20} />
                                <h2 className="text-sm font-bold uppercase tracking-widest">
                                    Recent Orders
                                </h2>
                            </div>

                            {savedOrders.length === 0 ? (
                                <div className="text-center py-8">
                                    <Receipt
                                        className="mx-auto text-gray-300 mb-3"
                                        size={40}
                                    />
                                    <p className="text-sm text-gray-500">
                                        No recent orders found
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {savedOrders.map((id) => (
                                        <button
                                            key={id}
                                            onClick={() =>
                                                handleSavedOrderClick(id)
                                            }
                                            className={`w-full flex items-center justify-between p-3  border transition-all ${
                                                selectedOrderId === id
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white hover:bg-gray-50 border-gray-200"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 size={16} />
                                                <span className="text-sm font-bold">
                                                    #{id.slice(-8)}
                                                </span>
                                            </div>
                                            <ChevronRight size={16} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrderPage;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetUserOrders } from "../api/hooks/orders.api";
import {
    Package,
    Calendar,
    Tag,
    ChevronRight,
    ShoppingBag,
    Loader2,
} from "lucide-react";
import CancellationModal from "../Components/CancellationModal.jsx";
import { useCancelOrder } from "../api/hooks/orders.api.js";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const { getUserOrders, loading } = useGetUserOrders();

    useEffect(() => {
        (async () => {
            const resp = await getUserOrders();
            if (resp?.orders) setOrders(resp.orders);
        })();
    }, []);

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return "bg-green-50 text-green-700 border-green-200";
            case "pending":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "shipped":
                return "bg-blue-50 text-blue-700 border-blue-200";
            default:
                return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    const [cancelModal, setCancelModal] = useState({
        isOpen: false,
        orderId: null,
    });

    const { cancelOrder, loading: cancelLoading } = useCancelOrder();

    const handleOpenCancelModal = (orderId) => {
        setCancelModal({ isOpen: true, orderId });
    };

    const handleCloseCancelModal = () => {
        setCancelModal({ isOpen: false, orderId: null });
    };

    const handleConfirmCancel = async (reason) => {
        if (!cancelModal.orderId) return;

        const res = await cancelOrder({ orderId: cancelModal.orderId, reason });
        if (res?.success) {
            // Update local state
            setOrders(orders.map(order =>
                order.id === cancelModal.orderId
                    ? { ...order, status: 'cancelled' }
                    : order
            ));
            handleCloseCancelModal();
        }
    };

    return (
        <div className="container mx-auto px-4 lg:px-8 py-8 min-h-[70vh]">
            <CancellationModal
                isOpen={cancelModal.isOpen}
                onClose={handleCloseCancelModal}
                onConfirm={handleConfirmCancel}
                loading={cancelLoading}
                title="Cancel Order"
                description="Are you sure you want to cancel this order? This action cannot be undone and we will stop processing your shipment."
            />

            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 pb-4 border-b border-gray-200">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="text-blue-600" size={20} />
                        <span className="text-sm text-gray-500 font-medium">
                            Order History
                        </span>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
                        My Orders
                    </h1>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 rounded-lg">
                    <Loader2
                        className="animate-spin text-blue-600 mb-3"
                        size={32}
                    />
                    <p className="text-gray-500 text-sm">
                        Loading your orders...
                    </p>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg py-16 px-6 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <ShoppingBag size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No orders found
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-xs text-center">
                        You haven't placed any orders yet. Once you do, they'll
                        appear here.
                    </p>
                    <Link
                        to="/products"
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Start Shopping
                        <ChevronRight size={16} />
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white border border-gray-200 rounded-lg p-5 lg:p-6 hover:border-blue-500 hover:shadow-md transition-all"
                        >
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                                <div className="flex flex-wrap gap-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Tag size={14} /> Order ID
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            #{order._id}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Calendar size={14} /> Date
                                        </div>
                                        <div className="text-sm font-medium text-gray-700">
                                            {new Date(
                                                order.date,
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-3">
                                    <div className="flex items-center gap-3">
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => handleOpenCancelModal(order._id)}
                                                className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                        <span
                                            className={`px-3 py-1 rounded text-xs font-medium border ${getStatusStyles(order.status)}`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-lg font-semibold text-gray-900">
                                        Rs {order.totalAmount?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 },
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {order.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-all"
                                    >
                                        <div className="w-14 h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                                            <img
                                                src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${item.product?.image}`}
                                                className="w-full h-full object-contain p-1.5"
                                                alt="product"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 text-sm truncate">
                                                {item.title ||
                                                    item.product?.name}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500">
                                                    Qty: {item.quantity}
                                                </span>
                                                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                                <span className={`text-xs font-medium ${item.status === 'cancelled' ? 'text-red-600' : 'text-green-600'}`}>
                                                    {item.status === 'cancelled' ? 'Cancelled' : 'Fulfilled'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useGetOrderById } from "../api/hooks/orders.api";
import {
    CheckCircle2,
    Truck,
    PackageCheck,
    ArrowRight,
    Loader2,
    MapPin,
    CreditCard,
    Receipt,
} from "lucide-react";

const OrderSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { getOrderById, loading } = useGetOrderById();
    const orderId = location.state?.orderId;
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (!orderId) {
            navigate("/orders");
            return;
        }
        (async () => {
            const resp = await getOrderById(orderId);
            if (resp?.order) setOrder(resp.order);
        })();
    }, [orderId, navigate]);

    if (loading || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-sm font-medium text-gray-500">
                    Verifying transaction...
                </p>
            </div>
        );
    }

    const itemsSubtotal = order.items?.reduce(
        (sum, item) =>
            sum + (item.totalAmount || item.quantity * item.price),
        0,
    );
    const taxAmount = Number(order.taxAmount) || 0;
    const shippingFee = Number(order.shippingFee) || 0;
    const grandTotal = Number(order.grandTotal) || 0;

    return (
        <div className="bg-gray-50 min-h-screen py-8 lg:py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <CheckCircle2
                                className="text-green-600"
                                size={32}
                            />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            Order Confirmed
                        </h1>
                        <p className="text-gray-600">
                            Your order has been successfully placed and is being processed
                        </p>
                    </div>

                    {/* Order Summary Card */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        {/* Quick Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-200">
                            <InfoTile
                                label="Order ID"
                                value={`#${(order.id || order._id).slice(-8).toUpperCase()}`}
                                icon={<PackageCheck size={16} />}
                            />
                            <InfoTile
                                label="Total Amount"
                                value={`Rs ${grandTotal.toLocaleString()}`}
                                icon={<CreditCard size={16} />}
                            />
                            <InfoTile
                                label="Status"
                                value={order.status}
                                icon={<Truck size={16} />}
                                highlight
                            />
                        </div>

                        {/* Details Section */}
                        <div className="p-6 lg:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Shipping Address */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <MapPin size={16} className="text-blue-600" />
                                        Shipping Address
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                        <p className="font-semibold text-gray-900 mb-1">
                                            {order.recipient?.name}
                                        </p>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                            {order.recipient?.street}
                                            {order.recipient?.addressLine2
                                                ? `, ${order.recipient.addressLine2}`
                                                : ""}
                                            <br />
                                            {order.recipient?.city}
                                            {order.recipient?.state
                                                ? `, ${order.recipient.state}`
                                                : ""}
                                            {order.recipient?.postalCode
                                                ? ` ${order.recipient.postalCode}`
                                                : ""}
                                            {order.recipient?.country
                                                ? `, ${order.recipient.country}`
                                                : ""}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Phone: {order.recipient?.phone}
                                        </p>

                                        {/* Order Details Badges */}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-gray-300 text-gray-700">
                                                {order.shippingMethod || "Standard"}
                                            </span>
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-gray-300 text-gray-700">
                                                {order.payment?.method || "COD"}
                                            </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${order.payment?.ispaid
                                                    ? "bg-green-50 text-green-700 border border-green-200"
                                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                                    }`}
                                            >
                                                {order.payment?.ispaid ? "Paid" : "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Receipt size={16} className="text-blue-600" />
                                        Order Summary
                                    </h3>
                                    <div className="space-y-3">
                                        {order.items?.map((item) => (
                                            <div
                                                key={item.product?._id || item.product}
                                                className="flex justify-between items-center group"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {item.product?.name || "Product Item"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    Rs{" "}
                                                    {(
                                                        item.totalAmount ||
                                                        item.quantity * item.price
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}

                                        {/* Price Breakdown */}
                                        <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                                            <div className="flex justify-between items-center text-sm text-gray-600">
                                                <span>Subtotal</span>
                                                <span>Rs {itemsSubtotal.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-gray-600">
                                                <span>Tax</span>
                                                <span>Rs {taxAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-gray-600">
                                                <span>Shipping</span>
                                                <span>Rs {shippingFee.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                                <span className="text-base font-semibold text-gray-900">
                                                    Total
                                                </span>
                                                <span className="text-xl font-bold text-blue-600">
                                                    Rs {grandTotal.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                <Link
                                    to="/orders"
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    View Order History
                                    <ArrowRight size={16} />
                                </Link>
                                <Link
                                    to="/products"
                                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoTile = ({ label, value, icon, highlight = false }) => (
    <div className="p-5 flex flex-col items-center justify-center text-center border-r last:border-r-0 border-gray-200">
        <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-400">{icon}</span>
            <span className="text-xs font-medium text-gray-500">
                {label}
            </span>
        </div>
        <span
            className={`text-sm font-semibold ${highlight ? "text-green-600" : "text-gray-900"
                }`}
        >
            {value}
        </span>
    </div>
);

export default OrderSuccessPage;
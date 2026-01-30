import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetUserOrders } from "../api/hooks/orders.api";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const { getUserOrders, loading } = useGetUserOrders();

    useEffect(() => {
        (async () => {
            const resp = await getUserOrders();
            if (resp?.orders) setOrders(resp.orders);
        })();
    }, []);

    return (
        <div className="container py-6">
            <h1 className="text-2xl font-bold my-6">My Orders</h1>
            {loading ? (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-lg">
                    <p className="text-gray-500 mb-4">Loading your orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-lg">
                    <p className="text-gray-500 mb-4">
                        You have no orders yet.
                    </p>
                    <Link
                        to="/products"
                        className="text-primary hover:underline"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white border border-gray-200 rounded-lg p-6"
                        >
                            <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                                <div>
                                    <div className="text-sm text-gray-500">
                                        Order ID: #{order.id}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {new Date(
                                            order.date
                                        ).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                        {order.status}
                                    </span>
                                    <div className="font-bold text-lg mt-1">
                                        Rs: {order.totalAmount?.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-4 items-center"
                                    >
                                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                            <img
                                                src={`${
                                                    import.meta.env
                                                        .VITE_BACKEND_URL
                                                }/${item.product?.image}`}
                                                className="max-w-full max-h-full"
                                                alt="thumb"
                                            />
                                        </div>
                                        <div className="flex-1 text-sm">
                                            <div className="font-medium text-gray-900 line-clamp-1">
                                                {item.title ||
                                                    (item.product &&
                                                        item.product.name) ||
                                                    ""}
                                            </div>
                                            <div className="text-gray-500">
                                                Qty: {item.quantity}
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

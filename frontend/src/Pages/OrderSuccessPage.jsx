import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useGetOrderById } from "../api/hooks/orders.api";
import { useState } from "react";

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
    }, [orderId]);

    if (loading || !order) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-xl font-bold mb-4">
                    Loading order details...
                </h2>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                    Order Placed Successfully!
                </h2>
                <p className="mb-6">
                    Thank you for your purchase. Your order has been placed and
                    is being processed.
                </p>
                <h3 className="font-semibold text-lg mb-2">Order Details</h3>
                <div className="mb-4">
                    <div>
                        <span className="font-medium">Order ID:</span>{" "}
                        {order.id || order._id}
                    </div>
                    <div>
                        <span className="font-medium">Total:</span> Rs:{" "}
                        {order.totalAmount || order.grandTotal}
                    </div>
                    <div>
                        <span className="font-medium">Status:</span>{" "}
                        {order.status}
                    </div>
                </div>
                <h4 className="font-semibold mb-2">Shipping To</h4>
                <div className="mb-4">
                    <div>{order.recipient?.name}</div>
                    <div>
                        {order.recipient?.street}, {order.recipient?.city}
                    </div>
                    <div>{order.recipient?.phone}</div>
                </div>
                <h4 className="font-semibold mb-2">Items</h4>
                <ul className="mb-6">
                    {order.items?.map((item) => (
                        <li
                            key={item.product?._id || item.product}
                            className="flex justify-between border-b py-1"
                        >
                            <span>
                                {item.product?.name || "Product"} (x
                                {item.quantity})
                            </span>
                            <span>Rs: {item.totalAmount}</span>
                        </li>
                    ))}
                </ul>
                <Link
                    to="/orders"
                    className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold"
                >
                    View My Orders
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccessPage;

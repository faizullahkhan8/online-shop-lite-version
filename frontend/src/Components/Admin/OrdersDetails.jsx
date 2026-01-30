import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    useGetOrderById,
    useUpdateOrderStatus,
    useDeleteOrder,
} from "../../api/hooks/orders.api.js";
import { ArrowLeft, Package, User, MapPin } from "lucide-react";

const OrderDetails = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("id");
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const { getOrderById, loading } = useGetOrderById();
    const { updateOrderStatus } = useUpdateOrderStatus();
    const { deleteOrder } = useDeleteOrder();

    console.log(order);

    useEffect(() => {
        if (orderId) {
            getOrderById(orderId).then((res) => {
                if (res?.success) setOrder(res.order);
            });
        }
    }, [orderId]);

    const handleStatusUpdate = async (newStatus) => {
        if (!orderId) return;
        const res = await updateOrderStatus({ orderId, status: newStatus });
        if (res?.order) setOrder(res.order);
    };

    const handleDelete = async () => {
        if (!orderId) return;
        const res = await deleteOrder(orderId);
        if (res?.success) navigate(-1);
    };

    if (!order || loading)
        return <div className="p-10 text-center">Loading order details...</div>;

    return (
        <div className="m-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        Order #{order._id.slice(-8).toUpperCase()}
                    </h2>
                    <p className="text-sm text-gray-500">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Order Items Table */}
                <div className="md:col-span-2 bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="text-sm font-bold flex items-center gap-2">
                            <Package size={16} /> Order Items
                        </h3>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-center text-[10px] font-bold text-gray-400 uppercase">
                                    Qty
                                </th>
                                <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-400 uppercase">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-400 uppercase">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {order.items.map((item, index) => (
                                <tr key={index} className="text-sm">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`${
                                                    import.meta.env
                                                        .VITE_BACKEND_URL
                                                }/${item.product.image}`}
                                                className="w-10 h-10 object-cover rounded border"
                                                alt={item.product.name}
                                            />
                                            <span className="font-medium text-gray-800">
                                                {item.product.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-600">
                                        x{item.quantity}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-600">
                                        Rs: {item.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-800">
                                        Rs:{" "}
                                        {(item.quantity * item.price).toFixed(
                                            2
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Summary Row */}
                    <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col items-end gap-2">
                        <div className="flex justify-between w-48 text-sm">
                            <span className="text-gray-500">Subtotal:</span>
                            <span className="font-medium">
                                Rs {order.grandTotal?.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between w-48 text-sm">
                            <span className="text-gray-500">Shipping:</span>
                            <span className="font-medium">Rs: 0.00</span>
                        </div>
                        <div className="flex justify-between w-48 text-lg font-bold border-t pt-2 mt-2">
                            <span>Total:</span>
                            <span className="text-blue-600">
                                Rs: {order.grandTotal?.toFixed(2)}
                            </span>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <label className="text-sm text-gray-600">
                                Status:
                            </label>
                            <select
                                value={order.status}
                                onChange={(e) =>
                                    handleStatusUpdate(e.target.value)
                                }
                                className="border rounded px-2 py-1 text-sm"
                            >
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                                onClick={handleDelete}
                                className="ml-4 text-sm text-red-600"
                            >
                                Delete Order
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Customer Info Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                            <User size={16} /> Customer
                        </h3>
                        <p className="text-sm font-medium text-gray-900">
                            Name: {order.recipient?.name || "Guest"}
                        </p>
                        <p className="text-sm text-gray-500">
                            Phone: {order.recipient?.phone}
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                            <MapPin size={16} /> Shipping Address
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed italic">
                            {order.recipient.street +
                                " " +
                                order.recipient.city || "No address provided"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;

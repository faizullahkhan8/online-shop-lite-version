import { useState, useEffect } from "react";
import { useGetAllOrder } from "../../api/hooks/orders.api.js";
import { MoreVertical, Eye, Package } from "lucide-react";
import { Link } from "react-router-dom";

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const { getAllOrder, loading } = useGetAllOrder();
    const [activeMenuId, setActiveMenuId] = useState(null);

    useEffect(() => {
        (async () => {
            const response = await getAllOrder();
            if (response?.orders) {
                setOrders(response.orders);
            }
        })();
    }, []);

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return "bg-green-100 text-green-700";
            case "shipped":
                return "bg-blue-100 text-blue-700"; // Updated to match your model
            case "cancelled":
                return "bg-red-100 text-red-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 max-w-4xl mx-auto flex flex-col h-[calc(100vh-150px)]">
            {/* Header - Stays Fixed */}
            <div className="p-6 border-b border-gray-100 flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-800">
                    Recent Orders
                </h2>
                <p className="text-sm text-gray-500">
                    Track and manage customer transactions.
                </p>
            </div>

            {/* Table Container - This handles both X and Y scrolling */}
            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200 relative">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                Order ID
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                Customer
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                Total
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                Address
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                Is Paid
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-6 py-10 text-center text-gray-400"
                                >
                                    Loading orders...
                                </td>
                            </tr>
                        ) : orders?.length > 0 ? (
                            orders.map((order) => (
                                <tr
                                    key={order._id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-400">
                                        #{order._id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {order.recipient?.name || "Guest User"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                                        Rs {order.grandTotal?.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {order.recipient?.city},{" "}
                                        {order.recipient?.street}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        {order.payment?.ispaid ? (
                                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                                                Unpaid
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${getStatusStyles(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                                        <button
                                            onClick={() =>
                                                setActiveMenuId(
                                                    activeMenuId === order._id
                                                        ? null
                                                        : order._id
                                                )
                                            }
                                            className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                        {activeMenuId === order._id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-20"
                                                    onClick={() =>
                                                        setActiveMenuId(null)
                                                    }
                                                ></div>
                                                <div className="absolute right-10 top-2 w-36 bg-white rounded-md shadow-xl border border-gray-100 py-1 z-30">
                                                    <Link
                                                        to={`/admin-dashboard?tab=orders-details&id=${order._id}`}
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                    >
                                                        <Eye
                                                            size={14}
                                                            className="text-blue-500"
                                                        />{" "}
                                                        View Details
                                                    </Link>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-6 py-12 text-center text-gray-400"
                                >
                                    <Package
                                        size={40}
                                        className="mx-auto mb-2 opacity-20"
                                    />
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersList;

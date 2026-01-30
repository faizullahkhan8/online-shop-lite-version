import { useState, useEffect } from "react";
import { useGetAllOrder } from "../../api/hooks/orders.api.js";
import {
    MoreVertical,
    Eye,
    Package,
    Calendar,
    MapPin,
    Receipt,
    Loader2,
} from "lucide-react";
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
                return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "shipped":
                return "bg-blue-50 text-blue-600 border-blue-100";
            case "cancelled":
                return "bg-rose-50 text-rose-600 border-rose-100";
            case "pending":
                return "bg-amber-50 text-amber-600 border-amber-100";
            default:
                return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col h-[calc(100vh-180px)]">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-20">
                <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">
                        Transaction Ledger
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Direct management of customer fulfillments
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Total: {orders.length}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-10">
                        <tr>
                            <TableTh
                                label="Reference"
                                icon={<Receipt size={12} />}
                            />
                            <TableTh label="Customer" />
                            <TableTh label="Amount" />
                            <TableTh
                                label="Logistics"
                                icon={<MapPin size={12} />}
                            />
                            <TableTh label="Payment" />
                            <TableTh label="Status" />
                            <th className="px-8 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <TableLoadingState />
                        ) : orders?.length > 0 ? (
                            orders.map((order) => (
                                <tr
                                    key={order._id}
                                    className="hover:bg-slate-50/50 transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] font-black font-mono text-slate-400 group-hover:text-primary transition-colors uppercase tracking-widest">
                                            #{order._id.slice(-8)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
                                            {order.recipient?.name ||
                                                "Anonymous"}
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                                            {order.recipient?.phone}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-black text-slate-900">
                                            Rs{" "}
                                            {order.grandTotal?.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide truncate max-w-[150px]">
                                            {order.recipient?.city},{" "}
                                            {order.recipient?.street}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
                                                order.payment?.ispaid
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    : "bg-rose-50 text-rose-600 border-rose-100"
                                            }`}
                                        >
                                            <div
                                                className={`w-1 h-1 rounded-full ${order.payment?.ispaid ? "bg-emerald-500" : "bg-rose-500"}`}
                                            />
                                            {order.payment?.ispaid
                                                ? "Cleared"
                                                : "Unpaid"}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span
                                            className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] rounded-lg border ${getStatusStyles(order.status)}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right relative">
                                        <button
                                            onClick={() =>
                                                setActiveMenuId(
                                                    activeMenuId === order._id
                                                        ? null
                                                        : order._id,
                                                )
                                            }
                                            className="p-2 hover:bg-white hover:shadow-md rounded-xl text-slate-300 hover:text-slate-900 transition-all"
                                        >
                                            <MoreVertical size={16} />
                                        </button>

                                        {activeMenuId === order._id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-20"
                                                    onClick={() =>
                                                        setActiveMenuId(null)
                                                    }
                                                />
                                                <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 bg-slate-900 rounded-2xl shadow-2xl py-2 z-30 border border-white/10 animate-in fade-in zoom-in-95 duration-200">
                                                    <Link
                                                        to={`/admin-dashboard?tab=orders-details&id=${order._id}`}
                                                        className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                                                    >
                                                        <Eye
                                                            size={14}
                                                            className="text-primary"
                                                        />{" "}
                                                        Inspect Order
                                                    </Link>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <TableEmptyState />
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TableTh = ({ label, icon }) => (
    <th className="px-8 py-5">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {icon} {label}
        </div>
    </th>
);

const TableLoadingState = () => (
    <tr>
        <td colSpan="7" className="px-8 py-20 text-center">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-primary" size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Synchronizing Ledger...
                </span>
            </div>
        </td>
    </tr>
);

const TableEmptyState = () => (
    <tr>
        <td colSpan="7" className="px-8 py-24 text-center">
            <div className="flex flex-col items-center gap-4 opacity-20">
                <Package size={48} className="text-slate-400" />
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                    No Transaction Data Available
                </p>
            </div>
        </td>
    </tr>
);

export default OrdersList;

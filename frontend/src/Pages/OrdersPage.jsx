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
                return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "pending":
                return "bg-amber-50 text-amber-600 border-amber-100";
            case "shipped":
                return "bg-blue-50 text-blue-600 border-blue-100";
            default:
                return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    return (
        <div className="container mx-auto px-4 lg:px-8 py-12 min-h-[70vh]">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="text-primary" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Order History
                        </span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                        My <span className="text-primary">Orders</span>
                    </h1>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/50">
                    <Loader2
                        className="animate-spin text-primary mb-4"
                        size={40}
                    />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                        Syncing your orders...
                    </p>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-[3rem] py-20 px-6 flex flex-col items-center justify-center shadow-2xl shadow-slate-200/50">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                        <ShoppingBag size={40} className="text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">
                        No orders found
                    </h3>
                    <p className="text-slate-400 text-sm mb-8 max-w-xs text-center font-medium">
                        You haven't placed any orders yet. Once you do, they'll
                        appear here.
                    </p>
                    <Link
                        to="/products"
                        className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-primary transition-all active:scale-95 shadow-lg shadow-slate-900/20"
                    >
                        Start Shopping
                        <ChevronRight size={16} />
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white border border-slate-100 rounded-[2.5rem] p-6 lg:p-8 shadow-xl shadow-slate-200/40 hover:border-primary/20 transition-all group"
                        >
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-50 pb-6 mb-6">
                                <div className="flex flex-wrap gap-4 lg:gap-8">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <Tag size={12} /> Order Reference
                                        </div>
                                        <div className="text-sm font-black text-slate-900">
                                            #{order.id}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <Calendar size={12} /> Date Placed
                                        </div>
                                        <div className="text-sm font-bold text-slate-600">
                                            {new Date(
                                                order.date,
                                            ).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-2">
                                    <span
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(order.status)}`}
                                    >
                                        {order.status}
                                    </span>
                                    <div className="text-xl font-black text-primary">
                                        Rs:{" "}
                                        {order.totalAmount?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 },
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {order.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-4 items-center bg-slate-50/50 p-4 rounded-2xl border border-transparent hover:border-slate-100 transition-all"
                                    >
                                        <div className="w-16 h-16 bg-white border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                                            <img
                                                src={`${import.meta.env.VITE_BACKEND_URL}/${item.product?.image}`}
                                                className="w-full h-full object-contain p-2"
                                                alt="product"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-black text-slate-900 text-sm truncate uppercase tracking-tight">
                                                {item.title ||
                                                    item.product?.name}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase">
                                                    Qty: {item.quantity}
                                                </span>
                                                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                                <span className="text-[10px] font-black text-primary uppercase">
                                                    Fulfilled
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

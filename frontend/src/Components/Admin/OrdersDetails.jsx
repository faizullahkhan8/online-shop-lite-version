import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    useGetOrderById,
    useUpdateOrderStatus,
    useDeleteOrder,
} from "../../api/hooks/orders.api.js";
import {
    ArrowLeft,
    Package,
    User,
    MapPin,
    Calendar,
    Trash2,
    ShieldCheck,
    Truck,
    Clock,
    CheckCircle2,
} from "lucide-react";

const OrderDetails = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("id");
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const { getOrderById, loading } = useGetOrderById();
    const { updateOrderStatus } = useUpdateOrderStatus();
    const { deleteOrder } = useDeleteOrder();

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
        if (!window.confirm("Permanent deletion cannot be undone. Proceed?"))
            return;
        const res = await deleteOrder(orderId);
        if (res?.success) navigate(-1);
    };

    if (!order || loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
                <Clock className="animate-spin mb-4" size={32} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Retrieving Manifest...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-300">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary hover:shadow-lg transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                Order{" "}
                                <span className="text-primary">
                                    #{order._id.slice(-8).toUpperCase()}
                                </span>
                            </h2>
                            <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
                                {order.status}
                            </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                            <Calendar size={12} /> Transaction Log:{" "}
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all group"
                    >
                        <Trash2
                            size={14}
                            className="group-hover:scale-110 transition-transform"
                        />
                        Delete Order
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/40 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <Package size={16} className="text-primary" />{" "}
                                Shipment Manifest
                            </h3>
                            <span className="text-[10px] font-black text-slate-900">
                                {order.items.length} Unique Items
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                            Line Item
                                        </th>
                                        <th className="px-8 py-4 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                                            Qty
                                        </th>
                                        <th className="px-8 py-4 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">
                                            Unit
                                        </th>
                                        <th className="px-8 py-4 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {order.items.map((item, index) => (
                                        <tr key={index} className="group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={`${import.meta.env.VITE_BACKEND_URL}/${item.product.image}`}
                                                        className="w-14 h-14 object-cover rounded-2xl border border-slate-100 group-hover:scale-105 transition-transform"
                                                        alt={item.product.name}
                                                    />
                                                    <div>
                                                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
                                                            {item.product.name}
                                                        </p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                            SKU: PROD-
                                                            {item.product._id.slice(
                                                                -4,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="text-xs font-black text-slate-900">
                                                    ×{item.quantity}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right text-xs font-bold text-slate-500">
                                                Rs {item.price.toLocaleString()}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-sm font-black text-slate-900">
                                                    Rs{" "}
                                                    {(
                                                        item.quantity *
                                                        item.price
                                                    ).toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-10 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-8 mt-auto">
                            <div className="flex flex-col gap-4 w-full md:w-auto">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                    Update Logistics State
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "pending",
                                        "shipped",
                                        "delivered",
                                        "cancelled",
                                    ].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() =>
                                                handleStatusUpdate(status)
                                            }
                                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                                order.status === status
                                                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                                                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2 text-right w-full md:w-64 border-l border-white/10 pl-8">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span>
                                        Rs {order.grandTotal?.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Shipping</span>
                                    <span className="text-emerald-400">
                                        FREE
                                    </span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-white/10 items-end">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                        Grand Total
                                    </span>
                                    <span className="text-2xl font-black text-primary tracking-tighter">
                                        Rs {order.grandTotal?.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <aside className="space-y-8">
                    <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                            <User size={16} className="text-primary" /> Profile
                        </h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-black">
                                {order.recipient?.name?.[0] || "G"}
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                    {order.recipient?.name || "Guest Checkout"}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400">
                                    {order.recipient?.phone}
                                </p>
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <ShieldCheck size={12} /> Security Status
                            </p>
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-tight">
                                Verified Transaction
                            </p>
                        </div>
                    </section>

                    <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                            <Truck size={16} className="text-primary" />{" "}
                            Logistics
                        </h3>
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <MapPin size={16} className="text-slate-300" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-2">
                                    Destination
                                </p>
                                <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight italic">
                                    {order.recipient.street}
                                    <br />
                                    {order.recipient.city}
                                </p>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

export default OrderDetails;

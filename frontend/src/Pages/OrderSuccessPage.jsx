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
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50">
                <Loader2 className="animate-spin text-primary mb-4" size={40} />
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Verifying Transaction...
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
        <div className="bg-slate-50/50 min-h-screen py-12 lg:py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-[2rem] mb-6 border border-emerald-100 shadow-sm">
                            <CheckCircle2
                                className="text-emerald-500"
                                size={40}
                            />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase mb-3">
                            Order{" "}
                            <span className="text-emerald-500">Confirmed</span>
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Transaction successfully processed. Your premium
                            items are being prepared for dispatch.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/40 overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-50">
                            <InfoTile
                                label="Order ID"
                                value={`#${(order.id || order._id).slice(-8).toUpperCase()}`}
                                icon={<PackageCheck size={14} />}
                            />
                            <InfoTile
                                label="Total Amount"
                                value={`Rs ${grandTotal.toLocaleString()}`}
                                icon={<CreditCard size={14} />}
                            />
                            <InfoTile
                                label="Delivery Status"
                                value={order.status}
                                icon={<Truck size={14} />}
                                highlight
                            />
                        </div>

                        <div className="p-8 lg:p-12">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div>
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                                        <MapPin
                                            size={14}
                                            className="text-primary"
                                        />{" "}
                                        Shipping Destination
                                    </h3>
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                        <p className="font-black text-slate-900 uppercase text-sm mb-1">
                                            {order.recipient?.name}
                                        </p>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-4">
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
                                        <p className="text-xs font-bold text-slate-400">
                                            Contact: {order.recipient?.phone}
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white border border-slate-100 text-slate-500">
                                                {order.shippingMethod ||
                                                    "standard"}
                                            </span>
                                            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white border border-slate-100 text-slate-500">
                                                {order.payment?.method || "COD"}
                                            </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                    order.payment?.ispaid
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                        : "bg-amber-50 text-amber-600 border-amber-100"
                                                }`}
                                            >
                                                {order.payment?.ispaid
                                                    ? "Paid"
                                                    : "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                                        <Receipt
                                            size={14}
                                            className="text-primary"
                                        />
                                        Itemized Receipt
                                    </h3>
                                    <div className="space-y-4">
                                        {order.items?.map((item) => (
                                            <div
                                                key={
                                                    item.product?._id ||
                                                    item.product
                                                }
                                                className="flex justify-between items-center group"
                                            >
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">
                                                        {item.product?.name ||
                                                            "Product Item"}
                                                    </p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        Quantity:{" "}
                                                        {item.quantity}
                                                    </p>
                                                </div>
                                                <span className="text-sm font-black text-slate-900">
                                                    Rs{" "}
                                                    {(
                                                        item.totalAmount ||
                                                        item.quantity *
                                                            item.price
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                        <div className="pt-4 mt-4 border-t border-dashed border-slate-200 space-y-3">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                <span>Items Subtotal</span>
                                                <span>
                                                    Rs{" "}
                                                    {itemsSubtotal.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                <span>Tax</span>
                                                <span>
                                                    Rs{" "}
                                                    {taxAmount.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                <span>Shipping</span>
                                                <span>
                                                    Rs{" "}
                                                    {shippingFee.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                                <span className="text-xs font-black uppercase tracking-widest text-slate-900">
                                                    Grand Total
                                                </span>
                                                <span className="text-xl font-black text-primary">
                                                    Rs{" "}
                                                    {grandTotal.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/orders"
                                    className="flex-1 bg-slate-900 text-white h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-lg shadow-slate-900/10"
                                >
                                    Track Order History <ArrowRight size={16} />
                                </Link>
                                <Link
                                    to="/products"
                                    className="flex-1 bg-white border-2 border-slate-100 text-slate-900 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
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
    <div className="p-6 flex flex-col items-center justify-center text-center border-r last:border-r-0 border-slate-50">
        <div className="flex items-center gap-2 mb-1">
            <span className="text-slate-400">{icon}</span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                {label}
            </span>
        </div>
        <span
            className={`text-sm font-black uppercase tracking-tight ${highlight ? "text-emerald-500" : "text-slate-900"}`}
        >
            {value}
        </span>
    </div>
);

export default OrderSuccessPage;

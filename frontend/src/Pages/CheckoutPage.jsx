import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { usePlaceOrder } from "../api/hooks/orders.api";
import { clearCart } from "../store/slices/cartSlice";
import {
    Truck,
    CreditCard,
    Wallet,
    ShieldCheck,
    ArrowLeft,
    Loader2,
    User,
    Phone,
    MapPin,
} from "lucide-react";

const CheckoutPage = () => {
    const { items, totalAmount } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { placeOrder, isLoading } = usePlaceOrder();

    const [formData, setFormData] = useState({
        recipient: {
            name: user?.name || "",
            street: "",
            city: "",
            phone: user?.phone || "",
        },
        payment: {
            method: "COD",
            ispaid: false,
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes("recipient.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                recipient: { ...prev.recipient, [field]: value },
            }));
        } else if (name.includes("payment.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                payment: { ...prev.payment, [field]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedItems = items.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price,
            totalAmount: item.totalPrice,
        }));

        const orderData = {
            userId: user?._id,
            recipient: formData.recipient,
            items: formattedItems,
            grandTotal: totalAmount,
            payment: formData.payment,
            status: "pending",
        };

        try {
            const response = await placeOrder(orderData);
            if (response?.success && response?.order?._id) {
                dispatch(clearCart());
                navigate("/orders/success", {
                    state: { orderId: response.order._id },
                });
            }
        } catch (error) {
            console.error("Order failed:", error);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50">
                <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mb-6">
                    <Wallet className="text-slate-300" size={32} />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
                    Cart is empty
                </h2>
                <p className="text-slate-400 font-medium mb-8">
                    Add some premium tech to your collection first.
                </p>
                <Link
                    to="/products"
                    className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-primary transition-all"
                >
                    Browse Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50/50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <Link
                    to="/cart"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black uppercase text-[10px] tracking-widest mb-8 transition-colors"
                >
                    <ArrowLeft size={14} /> Back to Cart
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <form
                            id="checkout-form"
                            onSubmit={handleSubmit}
                            className="space-y-8"
                        >
                            <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-slate-200/40">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                                    <Truck size={16} className="text-primary" />{" "}
                                    01. Shipping Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CheckoutInput
                                        label="Full Name"
                                        name="recipient.name"
                                        icon={<User size={16} />}
                                        value={formData.recipient.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                    />
                                    <CheckoutInput
                                        label="Phone Number"
                                        name="recipient.phone"
                                        icon={<Phone size={16} />}
                                        value={formData.recipient.phone}
                                        onChange={handleChange}
                                        placeholder="+1 234..."
                                    />
                                    <CheckoutInput
                                        label="City"
                                        name="recipient.city"
                                        icon={<MapPin size={16} />}
                                        value={formData.recipient.city}
                                        onChange={handleChange}
                                        placeholder="New York"
                                    />
                                    <CheckoutInput
                                        label="Street Address"
                                        name="recipient.street"
                                        icon={<MapPin size={16} />}
                                        value={formData.recipient.street}
                                        onChange={handleChange}
                                        placeholder="123 Luxury Ave"
                                    />
                                </div>
                            </section>

                            <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-slate-200/40">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                                    <CreditCard
                                        size={16}
                                        className="text-primary"
                                    />{" "}
                                    02. Payment Method
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <PaymentCard
                                        active={
                                            formData.payment.method === "COD"
                                        }
                                        onClick={() =>
                                            setFormData((p) => ({
                                                ...p,
                                                payment: {
                                                    ...p.payment,
                                                    method: "COD",
                                                },
                                            }))
                                        }
                                        title="Cash on Delivery"
                                        description="Pay when you receive"
                                        icon={<Wallet size={20} />}
                                    />
                                    <PaymentCard
                                        active={
                                            formData.payment.method === "online"
                                        }
                                        onClick={() =>
                                            setFormData((p) => ({
                                                ...p,
                                                payment: {
                                                    ...p.payment,
                                                    method: "online",
                                                },
                                            }))
                                        }
                                        title="Online Payment"
                                        description="Secure Stripe/Card"
                                        icon={<CreditCard size={20} />}
                                    />
                                </div>
                            </section>
                        </form>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white sticky top-8 shadow-2xl shadow-slate-900/20">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                                Order Summary
                            </h3>
                            <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex justify-between items-start group"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-white leading-tight">
                                                {item.name}
                                            </p>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                QTY: {item.quantity}
                                            </p>
                                        </div>
                                        <span className="text-sm font-black text-primary">
                                            Rs {item.totalPrice.toFixed(0)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-white/10 mb-8">
                                <div className="flex justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    <span>Shipping</span>
                                    <span className="text-emerald-400">
                                        Free
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-sm font-black uppercase tracking-widest">
                                        Grand Total
                                    </span>
                                    <span className="text-2xl font-black text-white">
                                        Rs {totalAmount?.toFixed(0)}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isLoading}
                                className="w-full bg-primary text-white h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:bg-white hover:text-slate-900 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2
                                        className="animate-spin"
                                        size={18}
                                    />
                                ) : (
                                    "Complete Purchase"
                                )}
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-slate-500">
                                <ShieldCheck size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest">
                                    Secure Encrypted Checkout
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CheckoutInput = ({ label, name, value, onChange, placeholder, icon }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            {label}
        </label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                {icon}
            </div>
            <input
                required
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-300"
            />
        </div>
    </div>
);

const PaymentCard = ({ active, onClick, title, description, icon }) => (
    <div
        onClick={onClick}
        className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${
            active
                ? "border-primary bg-slate-50"
                : "border-slate-50 bg-white hover:border-slate-200"
        }`}
    >
        <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${active ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}
        >
            {icon}
        </div>
        <p
            className={`font-black uppercase tracking-tight text-sm ${active ? "text-slate-900" : "text-slate-400"}`}
        >
            {title}
        </p>
        <p className="text-[10px] font-medium text-slate-400 mt-1">
            {description}
        </p>
    </div>
);

export default CheckoutPage;

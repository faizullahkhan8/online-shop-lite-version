import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { usePlaceOrder } from "../api/hooks/orders.api";
import { useGetSettings } from "../api/hooks/settings.api";
import { removeSelectedItems } from "../store/slices/cartSlice";
import { addGuestOrder } from "../utils/guestOrders";
import {
    Truck,
    CreditCard,
    Wallet,
    ArrowLeft,
    Loader2,
    User,
    Phone,
    MapPin,
    ChevronRight,
} from "lucide-react";

const CheckoutPage = () => {
    const { items: allItems } = useSelector((state) => state.cart);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    // Check if this is a Buy Now flow
    const buyNowProduct = location.state?.buyNowProduct;
    const items = buyNowProduct
        ? [buyNowProduct]
        : allItems.filter((item) => item.selected);
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    const { placeOrder, isLoading } = usePlaceOrder();
    const { getSettings } = useGetSettings();

    const [formData, setFormData] = useState({
        recipient: {
            name: "",
            street: "",
            addressLine2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            phone: "",
        },
        payment: {
            method: "COD",
            ispaid: false,
        },
        taxAmount: 0,
        shippingFee: 0,
        shippingMethod: "standard",
    });
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    useEffect(() => {
        if (!settingsLoaded) {
            getSettings().then((res) => {
                if (res?.settings) {
                    setFormData((prev) => ({
                        ...prev,
                        taxAmount: Number(res.settings.taxAmount) || 0,
                        shippingFee: Number(res.settings.shippingFee) || 0,
                        shippingMethod:
                            res.settings.shippingMethod || "standard",
                    }));
                }
                setSettingsLoaded(true);
            });
        }
    }, [settingsLoaded, getSettings]);

    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData((prev) => ({
                ...prev,
                recipient: {
                    ...prev.recipient,
                    name: "",
                    phone: "",
                    street: "",
                    addressLine2: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    country: "",
                },
            }));
        }
    }, [user, isAuthenticated]);

    useEffect(() => {
        if (
            formData.shippingMethod === "pickup" &&
            formData.shippingFee !== 0
        ) {
            setFormData((prev) => ({ ...prev, shippingFee: 0 }));
        }
    }, [formData.shippingMethod, formData.shippingFee]);

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
            setFormData((prev) => ({
                ...prev,
                [name]:
                    name === "taxAmount" || name === "shippingFee"
                        ? Number(value)
                        : value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedItems = items.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price,
            totalAmount: item.totalPrice,
            originalPrice: item.originalPrice,
            promotion: item.promotion,
        }));

        const orderData = {
            userId: user?._id,
            recipient: formData.recipient,
            items: formattedItems,
            taxAmount: Number(formData.taxAmount) || 0,
            shippingFee: Number(formData.shippingFee) || 0,
            shippingMethod: formData.shippingMethod,
            grandTotal:
                (totalAmount || 0) +
                (Number(formData.taxAmount) || 0) +
                (Number(formData.shippingFee) || 0),
            payment: formData.payment,
            status: "pending",
        };

        try {
            const response = await placeOrder(orderData);
            if (response?.success && response?.order?._id) {
                addGuestOrder(response.order);
                // Only remove from cart if this is not a Buy Now flow
                if (!buyNowProduct) {
                    const checkedOutProductIds = formattedItems.map(
                        (item) => item.product,
                    );
                    dispatch(
                        removeSelectedItems({
                            productIds: checkedOutProductIds,
                        }),
                    );
                }
                navigate(`/orders/success?id=${response.order._id}`, {
                    state: { orderId: response.order._id },
                });
            }
        } catch (error) {
            console.error("Order failed:", error);
        }
    };

    if (items.length === 0 && !buyNowProduct) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
                <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6">
                    <Wallet
                        className="text-zinc-300"
                        size={24}
                        strokeWidth={1}
                    />
                </div>
                <h2 className="text-[12px] uppercase tracking-[0.3em] font-semibold text-zinc-900 mb-2">
                    Bag is Empty
                </h2>
                <Link
                    to="/products"
                    className="border border-zinc-900 px-10 py-3 text-sm uppercase tracking-[0.2em] font-bold hover:bg-zinc-900 hover:text-white transition-all duration-500"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <Link
                    to={buyNowProduct ? "/products" : "/cart"}
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 mb-12 transition-colors group"
                >
                    <ArrowLeft
                        size={14}
                        className="group-hover:-translate-x-1 transition-transform"
                    />
                    <span className="text-sm uppercase tracking-[0.2em] font-bold">
                        {buyNowProduct ? "Back to Products" : "Return to Bag"}
                    </span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7">
                        <form
                            id="checkout-form"
                            onSubmit={handleSubmit}
                            className="space-y-16"
                        >
                            <section>
                                <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-4">
                                    <h3 className="text-md uppercase tracking-[0.3em] font-bold text-zinc-900 flex items-center gap-3">
                                        <Truck size={16} strokeWidth={1.2} />
                                        Shipping Details
                                    </h3>
                                    {!isAuthenticated && (
                                        <Link
                                            to="/login"
                                            className="text-[9px] uppercase tracking-widest text-zinc-400 hover:text-zinc-900"
                                        >
                                            Already a member? Sign In
                                        </Link>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                                    <CheckoutInput
                                        label="Full Name"
                                        name="recipient.name"
                                        icon={<User size={14} />}
                                        value={formData.recipient.name}
                                        onChange={handleChange}
                                        placeholder="NAME"
                                    />
                                    <CheckoutInput
                                        label="Phone Number"
                                        name="recipient.phone"
                                        icon={<Phone size={14} />}
                                        value={formData.recipient.phone}
                                        onChange={handleChange}
                                        placeholder="CONTACT"
                                    />
                                    <div className="md:col-span-2">
                                        <CheckoutInput
                                            label="Street Address"
                                            name="recipient.street"
                                            icon={<MapPin size={14} />}
                                            value={formData.recipient.street}
                                            onChange={handleChange}
                                            placeholder="HOUSE NO, STREET, AREA"
                                        />
                                    </div>
                                    <CheckoutInput
                                        label="City"
                                        name="recipient.city"
                                        icon={<MapPin size={14} />}
                                        value={formData.recipient.city}
                                        onChange={handleChange}
                                        placeholder="CITY"
                                    />
                                    <CheckoutInput
                                        label="State"
                                        name="recipient.state"
                                        icon={<MapPin size={14} />}
                                        value={formData.recipient.state}
                                        onChange={handleChange}
                                        placeholder="PROVINCE"
                                    />
                                    <CheckoutInput
                                        label="Postal Code"
                                        name="recipient.postalCode"
                                        icon={<MapPin size={14} />}
                                        value={formData.recipient.postalCode}
                                        onChange={handleChange}
                                        placeholder="ZIP CODE"
                                    />
                                    <CheckoutInput
                                        label="Country"
                                        name="recipient.country"
                                        icon={<MapPin size={14} />}
                                        value={formData.recipient.country}
                                        onChange={handleChange}
                                        placeholder="COUNTRY"
                                    />
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center mb-8 border-b border-zinc-100 pb-4">
                                    <h3 className="text-md uppercase tracking-[0.3em] font-bold text-zinc-900 flex items-center gap-3">
                                        <CreditCard
                                            size={16}
                                            strokeWidth={1.2}
                                        />
                                        Payment Method
                                    </h3>
                                </div>
                            </section>
                        </form>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-zinc-50 p-8 sticky top-12 border border-zinc-100">
                            <h3 className="text-sm uppercase tracking-[0.25em] font-bold text-zinc-900 mb-8 pb-4 border-b border-zinc-200">
                                Order Summary
                            </h3>

                            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex justify-between items-start gap-4"
                                    >
                                        <div className="flex-1">
                                            <p className="text-md uppercase tracking-wider font-medium text-zinc-900 leading-tight">
                                                {item.name}
                                            </p>
                                            <p className="text-[9px] tracking-widest text-zinc-400 mt-1 uppercase">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <span className="text-md font-bold text-zinc-900">
                                            Rs {item.totalPrice.toFixed(0)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-zinc-200 mb-8">
                                <div className="flex justify-between text-sm uppercase tracking-widest text-zinc-500">
                                    <span>Subtotal</span>
                                    <span>Rs {totalAmount.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-sm uppercase tracking-widest text-zinc-500">
                                    <span>Tax</span>
                                    <span>
                                        Rs {formData.taxAmount.toFixed(0)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm uppercase tracking-widest text-zinc-500">
                                    <span>Shipping</span>
                                    <span>
                                        {formData.shippingFee === 0
                                            ? "FREE"
                                            : `Rs ${formData.shippingFee}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-zinc-900 mt-4">
                                    <span className="text-md font-black uppercase tracking-[0.2em]">
                                        Total
                                    </span>
                                    <span className="text-lg font-black text-zinc-900">
                                        Rs{" "}
                                        {(
                                            totalAmount +
                                            formData.taxAmount +
                                            formData.shippingFee
                                        ).toFixed(0)}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={Boolean(isLoading)}
                                className="w-full bg-zinc-900 text-white py-4 text-md uppercase tracking-[0.3em] font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                            >
                                {isLoading ? (
                                    <Loader2
                                        className="animate-spin"
                                        size={16}
                                    />
                                ) : (
                                    <>
                                        Complete Purchase
                                        <ChevronRight
                                            size={14}
                                            className="group-hover:translate-x-1 transition-transform"
                                        />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CheckoutInput = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    icon,
    type = "text",
    required = true,
}) => (
    <div className="space-y-3">
        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-500">
            {label}
        </label>
        <div className="relative group">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                {icon}
            </div>
            <input
                required={required}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-transparent border-b border-zinc-200 py-3 pl-7 text-md uppercase tracking-widest text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all placeholder:text-zinc-200"
            />
        </div>
    </div>
);

const PaymentCard = ({ active, onClick, title, description, icon }) => (
    <div
        onClick={onClick}
        className={`p-6 border transition-all cursor-pointer relative overflow-hidden ${
            active
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-100 bg-white text-zinc-400 hover:border-zinc-300"
        }`}
    >
        <div className="flex justify-between items-start mb-4">
            <div className={active ? "text-white" : "text-zinc-900"}>
                {icon}
            </div>
            {active && (
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            )}
        </div>
        <p
            className={`text-sm uppercase tracking-[0.2em] font-bold mb-1 ${active ? "text-white" : "text-zinc-900"}`}
        >
            {title}
        </p>
        <p
            className={`text-[9px] uppercase tracking-widest ${active ? "text-zinc-400" : "text-zinc-400"}`}
        >
            {description}
        </p>
    </div>
);

export default CheckoutPage;

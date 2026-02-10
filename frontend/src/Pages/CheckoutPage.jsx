import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { usePlaceOrder } from "../api/hooks/orders.api";
import { useGetSettings } from "../api/hooks/settings.api";
import { removeSelectedItems } from "../store/slices/cartSlice";
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
    const { items: allItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Only process selected items
    const items = allItems.filter((item) => item.selected);
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    const { placeOrder, isLoading } = usePlaceOrder();
    const { getSettings } = useGetSettings();

    const [formData, setFormData] = useState({
        recipient: {
            name: user?.name || "",
            street: user?.addresses?.[0]?.street || "",
            addressLine2: user?.addresses?.[0]?.addressLine2 || "",
            city: user?.addresses?.[0]?.city || "",
            state: user?.addresses?.[0]?.state || "",
            postalCode: user?.addresses?.[0]?.postalCode || "",
            country: user?.addresses?.[0]?.country || "",
            phone: user?.phone || "",
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
    }, [settingsLoaded]);

    useEffect(() => {
        if (!user) return;
        setFormData((prev) => ({
            ...prev,
            recipient: {
                ...prev.recipient,
                name: user?.name || prev.recipient.name,
                phone: user?.phone || prev.recipient.phone,
                street:
                    user?.addresses?.[0]?.street || prev.recipient.street,
                addressLine2:
                    user?.addresses?.[0]?.addressLine2 ||
                    prev.recipient.addressLine2,
                city: user?.addresses?.[0]?.city || prev.recipient.city,
                state: user?.addresses?.[0]?.state || prev.recipient.state,
                postalCode:
                    user?.addresses?.[0]?.postalCode ||
                    prev.recipient.postalCode,
                country:
                    user?.addresses?.[0]?.country || prev.recipient.country,
            },
        }));
    }, [user]);

    useEffect(() => {
        if (formData.shippingMethod === "pickup" && formData.shippingFee !== 0) {
            setFormData((prev) => ({ ...prev, shippingFee: 0 }));
        }
    }, [formData.shippingMethod]);

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
                // Only remove the items that were successfully checked out
                const checkedOutProductIds = formattedItems.map(item => item.product);
                dispatch(removeSelectedItems({ productIds: checkedOutProductIds }));
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <Wallet className="text-gray-300" size={32} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Cart is empty
                </h2>
                <p className="text-gray-500 mb-6">
                    Add some items to your cart first.
                </p>
                <Link
                    to="/products"
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <Link
                    to="/cart"
                    className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-medium text-sm mb-6 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Cart
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <form
                            id="checkout-form"
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <section className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8">
                                <h3 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <Truck size={18} className="text-blue-600" />
                                    Shipping Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        placeholder="123 Main St"
                                    />
                                    <CheckoutInput
                                        label="Apartment / Suite"
                                        name="recipient.addressLine2"
                                        icon={<MapPin size={16} />}
                                        value={formData.recipient.addressLine2}
                                        onChange={handleChange}
                                        placeholder="Apt 12B"
                                        required={false}
                                    />
                                    <CheckoutInput
                                        label="State / Province"
                                        name="recipient.state"
                                        icon={<MapPin size={16} />}
                                        value={formData.recipient.state}
                                        onChange={handleChange}
                                        placeholder="California"
                                        required={false}
                                    />
                                    <CheckoutInput
                                        label="Postal Code"
                                        name="recipient.postalCode"
                                        icon={<MapPin size={16} />}
                                        value={formData.recipient.postalCode}
                                        onChange={handleChange}
                                        placeholder="90210"
                                        required={false}
                                    />
                                    <CheckoutInput
                                        label="Country"
                                        name="recipient.country"
                                        icon={<MapPin size={16} />}
                                        value={formData.recipient.country}
                                        onChange={handleChange}
                                        placeholder="USA"
                                        required={false}
                                    />
                                </div>
                            </section>

                            <section className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8">
                                <h3 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <CreditCard
                                        size={18}
                                        className="text-blue-600"
                                    />
                                    Payment Method
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        {
                                            value: "COD",
                                            title: "Cash on Delivery",
                                            description: "Pay when you receive",
                                            icon: <Wallet size={18} />,
                                        },
                                        {
                                            value: "card",
                                            title: "Card Payment",
                                            description: "Visa / MasterCard",
                                            icon: <CreditCard size={18} />,
                                        },
                                        {
                                            value: "bank",
                                            title: "Bank Transfer",
                                            description: "Direct bank transfer",
                                            icon: <CreditCard size={18} />,
                                        },
                                        {
                                            value: "wallet",
                                            title: "Mobile Wallet",
                                            description: "Digital payment",
                                            icon: <Wallet size={18} />,
                                        },
                                        {
                                            value: "online",
                                            title: "Online Payment",
                                            description: "Secure checkout",
                                            icon: <CreditCard size={18} />,
                                        },
                                    ].map((method) => (
                                        <PaymentCard
                                            key={method.value}
                                            active={
                                                formData.payment.method ===
                                                method.value
                                            }
                                            onClick={() =>
                                                setFormData((p) => ({
                                                    ...p,
                                                    payment: {
                                                        ...p.payment,
                                                        method: method.value,
                                                    },
                                                }))
                                            }
                                            title={method.title}
                                            description={method.description}
                                            icon={method.icon}
                                        />
                                    ))}
                                </div>
                            </section>

                        </form>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 rounded-lg p-6 text-white sticky top-8">
                            <h3 className="text-sm font-semibold text-gray-300 mb-6">
                                Order Summary
                            </h3>
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex justify-between items-start"
                                    >
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-medium text-white leading-tight">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold text-white">
                                            Rs {item.totalPrice.toFixed(0)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-gray-700 mb-6">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Tax</span>
                                    <span>
                                        Rs{" "}
                                        {Number(
                                            formData.taxAmount || 0,
                                        ).toFixed(0)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Shipping</span>
                                    <span>
                                        Rs{" "}
                                        {Number(
                                            formData.shippingFee || 0,
                                        ).toFixed(0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                                    <span className="text-sm font-medium">
                                        Grand Total
                                    </span>
                                    <span className="text-xl font-semibold text-white">
                                        Rs{" "}
                                        {(
                                            (totalAmount || 0) +
                                            (Number(formData.taxAmount) || 0) +
                                            (Number(formData.shippingFee) ||
                                                0)
                                        ).toFixed(0)}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                            <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
                                <ShieldCheck size={14} />
                                <span className="text-xs">
                                    Secure Checkout
                                </span>
                            </div>
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
    <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
            {label}
        </label>
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {icon}
            </div>
            <input
                required={required}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
            />
        </div>
    </div>
);

const PaymentCard = ({ active, onClick, title, description, icon }) => (
    <div
        onClick={onClick}
        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${active
            ? "border-blue-600 bg-blue-50"
            : "border-gray-200 bg-white hover:border-gray-300"
            }`}
    >
        <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                }`}
        >
            {icon}
        </div>
        <p
            className={`font-medium text-sm ${active ? "text-gray-900" : "text-gray-600"
                }`}
        >
            {title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
            {description}
        </p>
    </div>
);

export default CheckoutPage;
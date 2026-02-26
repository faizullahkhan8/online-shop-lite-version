import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { usePlaceOrder } from "../features/orders/orders.mutations.js";
import { useSettings } from "../features/settings.all.js";
import { removeSelectedItems, updateQuantity } from "../store/slices/cartSlice";
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
    Minus,
    Plus,
} from "lucide-react";
import Select from "../UI/Select";
import Breadcrumb from "../Components/Breadcrumb.jsx";

const CheckoutPage = () => {
    const { items: allItems } = useSelector((state) => state.cart);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    // Check if this is a Buy Now flow
    const buyNowProduct = location.state?.buyNowProduct;
    const [localBuyNowProduct, setLocalBuyNowProduct] = useState(buyNowProduct);

    const items = localBuyNowProduct
        ? [localBuyNowProduct]
        : allItems.filter((item) => item.selected);

    const handleQtyChange = (item, newQuantity) => {
        const qty = Math.max(1, Math.min(newQuantity, item.stock || Infinity));
        if (localBuyNowProduct) {
            setLocalBuyNowProduct({
                ...localBuyNowProduct,
                quantity: qty,
                totalPrice: localBuyNowProduct.price * qty,
            });
        } else {
            dispatch(updateQuantity({ _id: item._id, quantity: qty }));
        }
    };

    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    const { mutateAsync: placeOrder, isPending: placeOrderLoading } = usePlaceOrder();
    const { data: settingsData, isSuccess } = useSettings();

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
    });

    useEffect(() => {
        if (isSuccess && settingsData?.settings && !formData.taxAmount) {
            const s = settingsData.settings;

            setFormData((prev) => ({
                ...prev,
                taxAmount: Number(s.taxAmount) || 0,
                shippingFee: Number(s.shippingFee) || 0,
                shippingMethod: s.shippingMethod || "standard",
            }));
        }
    }, [formData.taxAmount, isSuccess, settingsData]);

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Checkout" },
    ];

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
            grandTotal:
                (totalAmount || 0) +
                (Number(formData.taxAmount) || 0) +
                (Number(formData.shippingFee) || 0),
            payment: formData.payment,
            status: "pending",
        };

        await placeOrder(orderData, {
            onSuccess: (response) => {
                console.log(response.order);
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
            },
        });
    };

    if (items.length === 0 && !buyNowProduct) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
                <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6 rounded-2xl">
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
                    className="border border-zinc-900 px-10 py-3 text-sm uppercase tracking-[0.2em] font-bold hover:bg-zinc-900 hover:text-white transition-all duration-500 rounded-2xl"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <Breadcrumb items={breadcrumbItems} />
                <Link
                    to={buyNowProduct ? "/products" : "/cart"}
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-12 transition-colors group"
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
                                            className="text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-900"
                                        >
                                            Already a member? Sign In
                                        </Link>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                                    <CheckoutInput
                                        label="Full Name"
                                        name="recipient.name"
                                        icon={<User size={22} />}
                                        value={formData.recipient.name}
                                        onChange={handleChange}
                                        placeholder="NAME"
                                    />
                                    <CheckoutInput
                                        label="Phone Number"
                                        name="recipient.phone"
                                        icon={<Phone size={22} />}
                                        value={formData.recipient.phone}
                                        onChange={handleChange}
                                        placeholder="CONTACT"
                                    />
                                    <div className="md:col-span-2">
                                        <CheckoutInput
                                            label="Street Address"
                                            name="recipient.street"
                                            icon={<MapPin size={22} />}
                                            value={formData.recipient.street}
                                            onChange={handleChange}
                                            placeholder="HOUSE NO, STREET, AREA"
                                        />
                                    </div>
                                    <CheckoutInput
                                        label="City"
                                        name="recipient.city"
                                        icon={<MapPin size={22} />}
                                        value={formData.recipient.city}
                                        onChange={handleChange}
                                        placeholder="CITY"
                                    />
                                    <CheckoutInput
                                        label="State"
                                        name="recipient.state"
                                        icon={<MapPin size={22} />}
                                        value={formData.recipient.state}
                                        onChange={handleChange}
                                        placeholder="PROVINCE"
                                    />
                                    <CheckoutInput
                                        label="Postal Code"
                                        name="recipient.postalCode"
                                        icon={<MapPin size={22} />}
                                        value={formData.recipient.postalCode}
                                        onChange={handleChange}
                                        placeholder="ZIP CODE"
                                    />
                                    <CheckoutInput
                                        label="Country"
                                        name="recipient.country"
                                        icon={<MapPin size={22} />}
                                        value={formData.recipient.country}
                                        onChange={handleChange}
                                        placeholder="COUNTRY"
                                    />
                                </div>
                            </section>

                            <section>
                                <div className="flex gap-4 flex-col mb-8  pb-4">
                                    <h3 className="text-md uppercase tracking-[0.3em] font-bold text-zinc-900 flex items-center gap-3">
                                        <CreditCard
                                            size={16}
                                            strokeWidth={1.2}
                                        />
                                        Payment Method
                                    </h3>
                                    <Select
                                        options={[
                                            {
                                                label: "Cash on Delivery",
                                                value: "COD",
                                            },
                                        ]}
                                        value={formData.payment.method}
                                        onChange={(val) =>
                                            setFormData({
                                                ...formData,
                                                payment: {
                                                    ...formData.payment,
                                                    method: val,
                                                },
                                            })
                                        }
                                        className="w-full max-w-none"
                                    />
                                </div>
                            </section>
                        </form>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-zinc-50 p-8 sticky top-12 border border-zinc-100 rounded-2xl">
                            <h3 className="text-sm uppercase tracking-[0.25em] font-bold text-zinc-900 mb-8 pb-4 border-b border-zinc-200">
                                Order Summary
                            </h3>

                            <div className="space-y-6 mb-8 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex justify-between items-start gap-4"
                                    >
                                        <div className="flex justify-between w-full items-center">
                                            <div>
                                                <p className="text-md tracking-wider font-medium text-zinc-900 leading-tight mb-2">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs tracking-wider font-medium text-zinc-600 leading-tight mb-2">
                                                    {item?.description}
                                                </p>
                                            </div>
                                            <div className="self-start flex items-center border border-zinc-200 h-10 w-fit bg-white rounded-2xl">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleQtyChange(
                                                            item,
                                                            item.quantity - 1,
                                                        )
                                                    }
                                                    className="w-10 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="w-8 text-center text-xs font-bold text-zinc-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleQtyChange(
                                                            item,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                    className="w-10 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-zinc-200 mb-8">
                                <div className="flex justify-between text-sm tracking-widest text-zinc-700">
                                    <span>Promotion Name</span>
                                    <span>
                                        {localBuyNowProduct?.promotion?.title}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm tracking-widest text-zinc-700">
                                    <span>Promotion Discount</span>
                                    <span>
                                        {
                                            localBuyNowProduct?.promotion
                                                ?.discountValue
                                        }
                                        {localBuyNowProduct.promotion
                                            ?.discountType === "PERCENTAGE"
                                            ? "%"
                                            : "Rs"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm tracking-widest border-t border-zinc-200 pt-4 text-zinc-700">
                                    <span>Per Unit Price</span>
                                    <span>
                                        Rs {localBuyNowProduct?.originalPrice}
                                    </span>
                                </div>
                                {buyNowProduct.promotion && (
                                    <div className="flex justify-between text-sm tracking-widest text-zinc-700">
                                        <span>
                                            Per Unit Price with Discount
                                        </span>
                                        <span>
                                            Rs{" "}
                                            {localBuyNowProduct?.effectivePrice}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm tracking-widest text-zinc-700">
                                    <span>Subtotal</span>
                                    <span>
                                        Rs{" "}
                                        {localBuyNowProduct.originalPrice *
                                            localBuyNowProduct.quantity}
                                    </span>
                                </div>
                                {buyNowProduct.promotion && (
                                    <div className="flex justify-between text-sm tracking-widest text-zinc-700">
                                        <span>
                                            Subtotal with promotional off
                                        </span>
                                        <span>Rs {totalAmount.toFixed(0)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm tracking-widest border-t border-zinc-200 pt-4 text-zinc-700">
                                    <span>Tax</span>
                                    <span>
                                        Rs {formData.taxAmount.toFixed(0)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm tracking-widest text-zinc-700">
                                    <span>Shipping</span>
                                    <span>
                                        {formData.shippingFee === 0
                                            ? "FREE"
                                            : `Rs ${formData.shippingFee}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-zinc-200 mt-4">
                                    <span className="text-md font-black tracking-[0.2em]">
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
                                disabled={placeOrderLoading}
                                className="w-full bg-zinc-900 text-white py-4 text-md tracking-[0.3em] font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group rounded-2xl"
                            >
                                {placeOrderLoading ? (
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
        <label className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-700">
            {label}
        </label>
        <div className="relative group">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-900 transition-colors">
                {icon}
            </div>
            <input
                required={required}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-transparent border rounded-2xl border-zinc-800 py-3 pl-10 text-md uppercase tracking-widest text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all placeholder:text-zinc-400"
            />
        </div>
    </div>
);

export default CheckoutPage;

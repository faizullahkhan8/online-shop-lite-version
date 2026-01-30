import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { usePlaceOrder } from "../api/hooks/orders.api";
import { clearCart } from "../store/slices/cartSlice"; // Recommended to clear cart after order

const CheckoutPage = () => {
    const { items, totalAmount } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { placeOrder, isLoading } = usePlaceOrder();

    const [formData, setFormData] = useState({
        recipient: {
            name: "",
            street: "",
            city: "",
            phone: "",
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

        // Map items to match orderSchema: { product, quantity, price, totalAmount }
        const formattedItems = items.map((item) => ({
            product: item._id, // References 'Product' model ID
            quantity: item.quantity,
            price: item.price,
            totalAmount: item.totalPrice, // Individual item total
        }));

        const orderData = {
            userId: user?._id, // Matches model userId
            recipient: formData.recipient,
            items: formattedItems,
            grandTotal: totalAmount, // Matches model grandTotal
            payment: formData.payment,
            status: "pending", // Defaulted in model, but good to be explicit
        };

        try {
            const response = await placeOrder(orderData);
            console.log(response);
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
            <div className="container py-20 text-center">
                <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
                <Link to="/products" className="text-primary hover:underline">
                    Go shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shipping & Payment Form */}
                <div className="lg:col-span-2">
                    <form
                        id="checkout-form"
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Recipient Section */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Shipping Details
                            </h3>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Full Name
                                </label>
                                <input
                                    required
                                    name="recipient.name"
                                    value={formData.recipient.name}
                                    onChange={handleChange}
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-green-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        required
                                        name="recipient.phone"
                                        value={formData.recipient.phone}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        City
                                    </label>
                                    <input
                                        required
                                        name="recipient.city"
                                        value={formData.recipient.city}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-green-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Street Address
                                </label>
                                <input
                                    required
                                    name="recipient.street"
                                    value={formData.recipient.street}
                                    onChange={handleChange}
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-green-500"
                                    placeholder="123 Street Name, Area"
                                />
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Payment Method
                            </h3>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment.method"
                                        value="COD"
                                        checked={
                                            formData.payment.method === "COD"
                                        }
                                        onChange={handleChange}
                                    />
                                    <span>Cash on Delivery</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment.method"
                                        value="online"
                                        checked={
                                            formData.payment.method === "online"
                                        }
                                        onChange={handleChange}
                                    />
                                    <span>Online Payment</span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">
                            Order Summary
                        </h3>
                        <div className="space-y-3 text-sm text-gray-600 border-b border-gray-200 pb-4 mb-4">
                            {items.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex justify-between"
                                >
                                    <span className="line-clamp-1 w-2/3">
                                        {item.name} (x{item.quantity})
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        Rs: {item.totalPrice.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
                            <span>Total</span>
                            <span>Rs: {totalAmount?.toFixed(2)}</span>
                        </div>
                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={isLoading}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:bg-gray-400"
                        >
                            {isLoading ? "Processing..." : "Place Order"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;

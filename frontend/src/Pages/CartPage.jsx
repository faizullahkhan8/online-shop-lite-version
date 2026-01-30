import { ArrowLeft, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// Import the actions from your cart slice file
import {
    removeFromCart,
    updateQuantity,
    clearCart,
} from "../store/slices/cartSlice.js";

const CartPage = () => {
    const dispatch = useDispatch();

    // Get cart data from Redux
    const { items, totalAmount } = useSelector((state) => state.cart);

    // --- Action Handlers ---

    const handleRemove = (_id) => {
        // Dispatches the ID to the removeFromCart reducer
        dispatch(removeFromCart({ _id }));
    };

    const handleQuantityChange = (_id, qty) => {
        // Dispatches object { id, quantity } to updateQuantity reducer
        dispatch(updateQuantity({ _id, quantity: qty }));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex justify-between items-center my-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    My cart ({items.length})
                </h1>
                {items.length > 0 && (
                    <button
                        onClick={handleClearCart}
                        className="text-sm text-red-500 hover:underline"
                    >
                        Clear Cart
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    <div className="space-y-4 mb-6">
                        {items.length === 0 ? (
                            <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
                                <p className="text-gray-500 mb-4">
                                    Your cart is empty
                                </p>
                                <Link
                                    to="/"
                                    className="text-green-600 font-semibold hover:underline"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center shadow-sm"
                                >
                                    <div className="bg-gray-50 rounded-lg w-20 h-20 flex-shrink-0 p-2">
                                        <img
                                            src={`${
                                                import.meta.env.VITE_BACKEND_URL
                                            }/${item.image}`}
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            {item.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 mb-3">
                                            Rs: {item.price.toFixed(2)}
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <select
                                                className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(
                                                        item._id,
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                            >
                                                {[
                                                    1, 2, 3, 4, 5, 6, 7, 8, 9,
                                                    10,
                                                ].map((n) => (
                                                    <option key={n} value={n}>
                                                        Qty: {n}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                onClick={() =>
                                                    handleRemove(item._id)
                                                }
                                                className="text-red-500 flex items-center gap-1 text-sm hover:text-red-700"
                                            >
                                                <Trash2 size={16} /> Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">
                                            Rs {item.totalPrice.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <Link
                        to="/"
                        className="flex items-center gap-2 text-gray-600 hover:text-green-600"
                    >
                        <ArrowLeft size={18} /> Back to shop
                    </Link>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-4 shadow-sm">
                        <h3 className="text-lg font-bold mb-4">Summary</h3>
                        <div className="flex justify-between font-bold text-xl border-t pt-4">
                            <span>Total:</span>
                            <span>Rs {totalAmount.toFixed(2)}</span>
                        </div>
                        <Link
                            to="/checkout"
                            className={`block w-full text-center py-3 mt-6 rounded-lg font-bold transition-all ${
                                items.length === 0
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                            onClick={(e) =>
                                items.length === 0 && e.preventDefault()
                            }
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;

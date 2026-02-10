import {
    ArrowLeft,
    Trash2,
    ShoppingBag,
    CreditCard,
    Minus,
    Plus,
    CheckSquare,
    Square,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleItemSelection,
    toggleAllSelection,
} from "../store/slices/cartSlice.js";

const CartPage = () => {
    const dispatch = useDispatch();
    const { items, selectedTotalAmount } = useSelector((state) => state.cart);

    const handleRemove = (_id) => {
        dispatch(removeFromCart({ _id }));
    };

    const handleQuantityChange = (_id, qty) => {
        if (qty < 1) return;
        dispatch(updateQuantity({ _id, quantity: qty }));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleToggleSelection = (_id) => {
        dispatch(toggleItemSelection({ _id }));
    };

    const handleToggleAllSelection = () => {
        const allSelected = items.every((item) => item.selected);
        dispatch(toggleAllSelection({ selected: !allSelected }));
    };

    const selectedCount = items.filter((item) => item.selected).length;
    const allSelected =
        items.length > 0 && items.every((item) => item.selected);

    console.log(items)
    return (
        <div className="container mx-auto px-4 lg:px-8 py-8 min-h-[80vh]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 pb-4 border-b border-gray-200">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <ShoppingBag className="text-blue-600" size={20} />
                        <span className="text-sm text-gray-500 font-medium">
                            Review Items
                        </span>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
                        Shopping Cart
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    {items.length > 0 && (
                        <button
                            onClick={handleToggleAllSelection}
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            {allSelected ? (
                                <CheckSquare
                                    size={18}
                                    className="text-blue-600"
                                />
                            ) : (
                                <Square size={18} />
                            )}
                            {allSelected ? "Deselect All" : "Select All"}
                        </button>
                    )}
                    {items.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                        >
                            Clear Cart
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-4">
                    {items.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-lg py-16 px-6 flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                <ShoppingBag
                                    size={32}
                                    className="text-gray-300"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Your cart is empty
                            </h3>
                            <p className="text-gray-500 text-sm mb-6 max-w-xs text-center">
                                Looks like you haven't added anything yet.
                            </p>
                            <Link
                                to="/products"
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                <ArrowLeft size={16} /> Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item._id}
                                className={`bg-white border rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-center hover:border-blue-500 transition-all duration-100 relative ${item.selected
                                    ? "border-gray-200 opacity-100"
                                    : "border-gray-100  hover:border-blue-500/50"
                                    }`}
                            >
                                {/* Selection Checkbox */}
                                <div className="absolute top-1 right-5">
                                    <button
                                        onClick={() =>
                                            handleToggleSelection(item._id)
                                        }
                                        className="w-max h-max flex items-center justify-center transition-colors gap-2
                                     cursor-pointer hover:bg-gray-200 duration-100 rounded px-2 py-1"
                                    >
                                        <span className="text-gray-600">
                                            Select
                                        </span>
                                        {item.selected ? (
                                            <CheckSquare
                                                size={20}
                                                className="text-blue-600"
                                            />
                                        ) : (
                                            <Square
                                                size={20}
                                                className="text-blue-600"
                                            />
                                        )}
                                    </button>
                                </div>

                                <div
                                    className={`w-24 h-24 bg-gray-50 rounded-lg p-3 shrink-0 border border-gray-100 ${item.selected
                                        ? "opacity-100"
                                        : "opacity-50"
                                        }`}
                                >
                                    <img
                                        src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${item.image}`}
                                        alt={item.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                <div
                                    className={`flex-1 w-full text-center sm:text-left pl-0 sm:pl-6 ${item.selected
                                        ? "opacity-100"
                                        : "opacity-50"
                                        }`}
                                >
                                    <h4 className="font-semibold text-gray-900 text-base mb-1">
                                        {item.name}
                                    </h4>
                                    <div className="flex flex-col">
                                        {item.originalPrice !== item.price && (
                                            <p className="text-xs text-gray-400 line-through">
                                                Rs{" "}
                                                {item.originalPrice?.toLocaleString()}
                                            </p>
                                        )}
                                        <p className="text-sm font-medium text-gray-700">
                                            Unit: Rs{" "}
                                            {item.price.toLocaleString()}
                                        </p>
                                    </div>

                                    <p className={`text-sm text-gray-900 mb-1 ${item.stock > item.quantity ? "text-green-500" : "text-red-500"}`}>
                                        Stock: {item.stock - item.quantity}
                                    </p>
                                    {item.stock < item.quantity && (
                                        <p className="text-sm text-red-500 mb-3 font-medium">
                                            Note: You're ordering out of stock, out of stock items will be delivered later
                                        </p>)}

                                    <div className="flex items-center justify-center sm:justify-start gap-4">
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button
                                                disabled={Boolean(!item.selected)}
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item._id,
                                                        item.quantity - 1,
                                                    )
                                                }
                                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center text-sm font-medium text-gray-900">
                                                {item.quantity}
                                            </span>
                                            <button
                                                disabled={Boolean(!item.selected)}
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item._id,
                                                        item.quantity + 1,
                                                    )
                                                }
                                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            disabled={Boolean(!item.selected)}
                                            onClick={() =>
                                                handleRemove(item._id)
                                            }
                                            className="text-gray-400 hover:text-red-600 transition-colors p-2"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className={`text-right w-full sm:w-auto px-4 ${item.selected
                                    ? "opacity-100"
                                    : "opacity-50"
                                    }`}>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Subtotal
                                    </p>
                                    <p className="font-semibold text-lg text-gray-900">
                                        Rs {item.totalPrice.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}

                    {items.length > 0 && (
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors ml-2"
                        >
                            <ArrowLeft size={14} /> Continue shopping
                        </Link>
                    )}
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-8">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
                            <CreditCard size={20} className="text-blue-600" />
                            Order Summary
                        </h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Total Items</span>
                                <span className="font-medium">
                                    {items.length}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Selected Items</span>
                                <span className="font-medium text-blue-600">
                                    {selectedCount}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Selected Subtotal</span>
                                <span className="font-medium">
                                    Rs {selectedTotalAmount?.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium text-xs">
                                    At checkout
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">
                                Total
                            </span>
                            <span className="text-2xl font-semibold text-gray-900">
                                Rs {selectedTotalAmount?.toLocaleString()}
                            </span>
                        </div>

                        <Link
                            to="/checkout"
                            className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-medium transition-colors ${selectedCount === 0
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                            onClick={(e) =>
                                selectedCount === 0 && e.preventDefault()
                            }
                        >
                            Proceed to Checkout ({selectedCount})
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;

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
    const allSelected = items.length > 0 && items.every((item) => item.selected);

    return (
        <div className="container mx-auto px-4 lg:px-12 py-16 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 pb-8 border-b border-zinc-100">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <ShoppingBag className="text-zinc-900" size={18} strokeWidth={1.5} />
                        <span className="text-sm uppercase tracking-[0.3em] text-zinc-400 font-medium">
                            Your Selection
                        </span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-light tracking-tighter text-zinc-900">
                        Shopping Cart
                    </h1>
                </div>
                <div className="flex items-center gap-8">
                    {items.length > 0 && (
                        <button
                            onClick={handleToggleAllSelection}
                            className="flex items-center gap-2 text-sm uppercase tracking-widest font-semibold text-zinc-900 hover:text-zinc-500 transition-colors"
                        >
                            {allSelected ? (
                                <CheckSquare size={16} className="text-zinc-900" />
                            ) : (
                                <Square size={16} />
                            )}
                            {allSelected ? "Deselect All" : "Select All"}
                        </button>
                    )}
                    {items.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="text-sm uppercase tracking-widest font-semibold text-red-500 hover:text-red-700 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-10">
                    {items.length === 0 ? (
                        <div className="py-24 flex flex-col items-center justify-center border border-dashed border-zinc-200">
                            <ShoppingBag size={48} strokeWidth={0.5} className="text-zinc-300 mb-6" />
                            <h3 className="text-md uppercase tracking-widest font-semibold text-zinc-900 mb-2">
                                Empty Cart
                            </h3>
                            <p className="text-sm text-zinc-400 uppercase tracking-tighter mb-8 text-center">
                                Your curated collection is currently empty.
                            </p>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-3 border border-zinc-900 px-8 py-3 text-sm uppercase tracking-[0.2em] font-medium hover:bg-zinc-900 hover:text-white transition-all duration-500"
                            >
                                <ArrowLeft size={14} /> Continue Exploring
                            </Link>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item._id}
                                className={`group flex flex-col sm:flex-row gap-8 items-start sm:items-center pb-10 border-b border-zinc-50 transition-all duration-500 ${!item.selected && "opacity-60"
                                    }`}
                            >
                                <div className="relative w-32 h-40 bg-zinc-50 flex items-center justify-center shrink-0 overflow-hidden">
                                    <img
                                        src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${item.image}`}
                                        alt={item.name}
                                        className="w-full h-full object-contain p-4 mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <button
                                        onClick={() => handleToggleSelection(item._id)}
                                        className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm p-1 shadow-sm border border-zinc-100"
                                    >
                                        {item.selected ? (
                                            <CheckSquare size={16} className="text-zinc-900" />
                                        ) : (
                                            <Square size={16} className="text-zinc-300" />
                                        )}
                                    </button>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-md uppercase tracking-widest font-semibold text-zinc-900 mb-2 truncate">
                                        {item.name}
                                    </h4>

                                    <div className="flex flex-col gap-1 mb-6">
                                        {item.originalPrice !== item.price && (
                                            <span className="text-sm text-zinc-300 line-through tracking-tighter">
                                                PKR {item.originalPrice?.toLocaleString()}
                                            </span>
                                        )}
                                        <span className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
                                            PKR {item.price.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center border border-zinc-200">
                                            <button
                                                disabled={!item.selected}
                                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-zinc-50 disabled:opacity-30 transition-colors"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="w-8 text-center text-sm font-semibold text-zinc-900">
                                                {item.quantity}
                                            </span>
                                            <button
                                                disabled={!item.selected}
                                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-zinc-50 disabled:opacity-30 transition-colors"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>

                                        <button
                                            disabled={!item.selected}
                                            onClick={() => handleRemove(item._id)}
                                            className="text-zinc-300 hover:text-red-500 transition-colors p-2"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {item.stock < item.quantity && (
                                        <p className="mt-4 text-sm uppercase tracking-[0.2em] text-red-400 font-bold">
                                            Extended Lead Time: Out of Stock
                                        </p>
                                    )}
                                </div>

                                <div className="sm:text-right shrink-0">
                                    <p className="text-sm uppercase tracking-[0.3em] text-zinc-400 mb-1">
                                        Subtotal
                                    </p>
                                    <p className="text-md font-semibold text-zinc-900 tracking-tight">
                                        PKR {item.totalPrice.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-zinc-50 p-10 sticky top-24 border border-zinc-100">
                        <h3 className="text-md uppercase tracking-[0.3em] font-semibold mb-10 flex items-center gap-3 text-zinc-900">
                            <CreditCard size={18} strokeWidth={1.5} />
                            Summary
                        </h3>

                        <div className="space-y-5 mb-10">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm uppercase tracking-widest text-zinc-400 font-medium">Items</span>
                                <span className="text-sm font-semibold text-zinc-900">{items.length}</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm uppercase tracking-widest text-zinc-400 font-medium">Selected</span>
                                <span className="text-sm font-semibold text-zinc-900">{selectedCount}</span>
                            </div>
                            <div className="flex justify-between items-baseline pt-5 border-t border-zinc-200/50">
                                <span className="text-sm uppercase tracking-widest text-zinc-400 font-medium">Subtotal</span>
                                <span className="text-sm font-semibold text-zinc-900">
                                    PKR {selectedTotalAmount?.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm uppercase tracking-widest text-zinc-400 font-medium">Delivery</span>
                                <span className="text-sm uppercase tracking-[0.2em] font-bold text-zinc-400">
                                    Calculated Later
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-zinc-200 pt-8 mb-10 flex justify-between items-end">
                            <span className="text-sm uppercase tracking-[0.3em] font-bold text-zinc-900">
                                Total
                            </span>
                            <span className="text-3xl font-light tracking-tighter text-zinc-900">
                                PKR {selectedTotalAmount?.toLocaleString()}
                            </span>
                        </div>

                        <Link
                            to="/checkout"
                            className={`flex items-center justify-center w-full py-5 text-sm uppercase tracking-[0.3em] font-semibold transition-all duration-500 ${selectedCount === 0
                                ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                                : "bg-zinc-900 text-white hover:bg-zinc-700"
                                }`}
                            onClick={(e) => selectedCount === 0 && e.preventDefault()}
                        >
                            Checkout ({selectedCount})
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
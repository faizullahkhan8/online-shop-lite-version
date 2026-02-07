import {
    ArrowLeft,
    Trash2,
    ShoppingBag,
    CreditCard,
    Minus,
    Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    removeFromCart,
    updateQuantity,
    clearCart,
} from "../store/slices/cartSlice.js";

const CartPage = () => {
    const dispatch = useDispatch();
    const { items, totalAmount } = useSelector((state) => state.cart);

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

    return (
        <div className="container mx-auto px-4 lg:px-8 py-12 min-h-[80vh]">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <ShoppingBag className="text-primary" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Review Items
                        </span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                        Shopping <span className="text-primary">Cart</span>
                    </h1>
                </div>
                {items.length > 0 && (
                    <button
                        onClick={handleClearCart}
                        className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors border-b-2 border-transparent hover:border-red-700 pb-1"
                    >
                        Empty Entire Cart
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-6">
                    {items.length === 0 ? (
                        <div className="bg-white border border-slate-100 rounded-[3rem] py-20 px-6 flex flex-col items-center justify-center shadow-2xl shadow-slate-200/50">
                            <div className="w-24 h-24 bg-slate-50 rounded-4xl flex items-center justify-center mb-6">
                                <ShoppingBag
                                    size={40}
                                    className="text-slate-200"
                                />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">
                                Your cart is empty
                            </h3>
                            <p className="text-slate-400 text-sm mb-8 max-w-xs text-center font-medium">
                                Looks like you haven't added anything yet.
                            </p>
                            <Link
                                to="/products"
                                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-primary transition-all active:scale-95 shadow-lg shadow-slate-900/20"
                            >
                                <ArrowLeft size={16} /> Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white border border-slate-100 rounded-4xl p-6 flex flex-col sm:flex-row gap-6 items-center shadow-xl shadow-slate-200/40 hover:border-primary/20 transition-all relative overflow-hidden group"
                            >
                                <div className="w-32 h-32 bg-slate-50 rounded-2xl p-4 shrink-0 relative overflow-hidden border border-slate-100">
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}/${item.image}`}
                                        alt={item.name}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>

                                <div className="flex-1 w-full text-center sm:text-left">
                                    <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight mb-1">
                                        {item.name}
                                    </h4>
                                    <div className="flex flex-col mb-4">
                                        {item.originalPrice !== item.price && (
                                            <p className="text-[10px] font-black text-slate-400 mb-0.5 uppercase tracking-widest line-through opacity-60">
                                                Rs {item.originalPrice?.toLocaleString()}
                                            </p>
                                        )}
                                        <p className="text-sm font-bold text-primary tracking-tighter">
                                            Unit: Rs {item.price.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-center sm:justify-start gap-6">
                                        <div className="flex items-center bg-slate-100 rounded-xl p-1">
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item._id,
                                                        item.quantity - 1,
                                                    )
                                                }
                                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-600"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center text-xs font-black text-slate-900">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item._id,
                                                        item.quantity + 1,
                                                    )
                                                }
                                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-600"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleRemove(item._id)
                                            }
                                            className="text-slate-300 hover:text-red-500 transition-colors p-2"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right w-full sm:w-auto px-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                                        Subtotal
                                    </p>
                                    <p className="font-black text-xl text-slate-900">
                                        Rs {item.totalPrice.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}

                    {items.length > 0 && (
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors ml-4"
                        >
                            <ArrowLeft size={14} /> Add more items
                        </Link>
                    )}
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 sticky top-8 shadow-2xl shadow-slate-900/30 text-white">
                        <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                            <CreditCard size={20} className="text-primary" />
                            Summary
                        </h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-slate-400 text-[11px] font-black uppercase tracking-widest">
                                <span>Items Total</span>
                                <span>Rs {totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-400 text-[11px] font-black uppercase tracking-widest">
                                <span>Shipping</span>
                                <span className="text-emerald-400">
                                    Calculated at next step
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-slate-800 pt-6 mb-8 flex justify-between items-end">
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
                                Total Payable
                            </span>
                            <span className="text-3xl font-black text-white leading-none">
                                Rs {totalAmount.toLocaleString()}
                            </span>
                        </div>

                        <Link
                            to="/checkout"
                            className={`flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[12px] transition-all shadow-xl shadow-black/20 ${
                                items.length === 0
                                    ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                                    : "bg-primary text-white hover:bg-white hover:text-slate-900 active:scale-95"
                            }`}
                            onClick={(e) =>
                                items.length === 0 && e.preventDefault()
                            }
                        >
                            Proceed to Checkout
                        </Link>

                        <p className="text-center mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                            Secure 128-bit Payment
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;

import {
    Heart,
    Star,
    ShoppingBag,
    ArrowRight,
    ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../store/slices/wishlistSlice";
import { useAddToWishlist, useRemoveFromWishlist } from "../api/hooks/user.api";

const ProductListItem = ({ product }) => {
    const dispatch = useDispatch();
    const wishlistItems = useSelector((state) => state.wishlist.items || []);
    const { addToWishlist } = useAddToWishlist();
    const { removeFromWishlist } = useRemoveFromWishlist();

    const matchId = (a, b) => {
        if (!a || !b) return false;
        const aval = a._id || a.id || a;
        const bval = b._id || b.id || b;
        return aval.toString() === bval.toString();
    };

    const isInWishlist = !!wishlistItems.find((i) => matchId(i, product));

    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleWishlist(product));
        try {
            if (isInWishlist) {
                await removeFromWishlist(product._id || product.id);
            } else {
                await addToWishlist(product._id || product.id);
            }
        } catch {
            dispatch(toggleWishlist(product));
        }
    };

    return (
        <div className="group bg-white border border-slate-100 rounded-[2rem] p-4 flex flex-col md:flex-row gap-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="w-full md:w-56 h-56 bg-slate-50 rounded-[1.5rem] flex-shrink-0 flex items-center justify-center relative p-6 overflow-hidden">
                <img
                    src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${product?.image}`}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                />
                <button
                    onClick={handleWishlist}
                    className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition-all duration-300 ${
                        isInWishlist
                            ? "bg-red-500 text-white shadow-lg shadow-red-200"
                            : "bg-white/80 text-slate-400 hover:text-red-500 shadow-sm"
                    }`}
                >
                    <Heart
                        size={18}
                        fill={isInWishlist ? "currentColor" : "none"}
                    />
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                    <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                {product?.category?.name || "Uncategorized"}
                            </span>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors">
                                {product.name}
                            </h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mb-4">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-slate-900">
                                Rs. {product.price?.toLocaleString()}
                            </span>
                            <span className="text-xs font-bold text-slate-400 line-through">
                                Rs. {(product.price + 500).toLocaleString()}
                            </span>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-100" />
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={12}
                                        fill={i < 4 ? "#f59e0b" : "none"}
                                        className={
                                            i < 4
                                                ? "text-amber-500"
                                                : "text-slate-200"
                                        }
                                    />
                                ))}
                                <span className="ml-1 text-xs font-black text-slate-900">
                                    4.8
                                </span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                154 verified orders
                            </span>
                        </div>
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 max-w-xl">
                        {product.description ||
                            "High-performance architecture meets daily utility. This limited edition item is designed for durability and optimized for professional deployment."}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full">
                            <ShieldCheck
                                size={14}
                                className="text-emerald-600"
                            />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tight">
                                Free Shipping
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            In Stock
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to={`/product/${product?._id}`}
                            className="flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-primary transition-colors group/link"
                        >
                            Details
                            <ArrowRight
                                size={14}
                                className="group-hover/link:translate-x-1 transition-transform"
                            />
                        </Link>
                        <button className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-primary transition-all shadow-xl shadow-slate-200 hover:shadow-primary/20">
                            <ShoppingBag size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductListItem;

import { Star, Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { toggleWishlist } from "../store/slices/wishlistSlice";
import { useAddToWishlist, useRemoveFromWishlist } from "../api/hooks/user.api";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const wishlistItems = useSelector((state) => state.wishlist.items || []);
    const { addToWishlist } = useAddToWishlist();
    const { removeFromWishlist } = useRemoveFromWishlist();

    const matchId = (item, product) => {
        if (!item || !product) return false;
        const aval = item._id || item.id || item;
        const bval = product._id || product.id || product;
        return aval.toString() === bval.toString();
    };

    const isInWishlist = !!wishlistItems.find((item) => matchId(item, product));

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart(product));
    };

    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleWishlist(product));
        try {
            const id = product._id || product.id;
            if (isInWishlist) {
                await removeFromWishlist(id);
            } else {
                await addToWishlist(id);
            }
        } catch {
            dispatch(toggleWishlist(product));
        }
    };

    const isDiscounted =
        product?.effectivePrice !== undefined &&
        product?.effectivePrice < product?.price;
    const displayPrice = isDiscounted
        ? product.effectivePrice
        : product?.price;
    const strikePrice = isDiscounted ? product.price : null;

    const rating = Math.floor(product?.rating || 0);

    return (
        <Link
            to={`/product/${product?._id}`}
            className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 p-2 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
        >
            <div className="relative aspect-square w-full bg-slate-50/50 rounded-xl overflow-hidden">
                {isDiscounted && (
                    <div className="absolute top-2 left-2 z-10 bg-rose-600 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg shadow-rose-500/20 uppercase tracking-widest">
                        {product.promotion?.discountType === "PERCENTAGE"
                            ? `-${product.promotion.discountValue}%`
                            : "OFF"}
                    </div>
                )}

                <button
                    onClick={handleWishlist}
                    className={`absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-lg backdrop-blur-md transition-all ${
                        isInWishlist
                            ? "bg-red-500 text-white shadow-md shadow-red-200"
                            : "bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white shadow-sm"
                    }`}
                >
                    <Heart
                        size={14}
                        fill={isInWishlist ? "currentColor" : "none"}
                    />
                </button>

                <img
                    src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${product?.image}`}
                    alt={product?.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                />
            </div>

            <div className="px-1.5 pt-3 pb-1 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-1.5">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={10}
                                fill={i < rating ? "currentColor" : "none"}
                                className={
                                    i < rating
                                        ? "text-amber-400"
                                        : "text-slate-200"
                                }
                            />
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-400">
                        ({product?.rating || 0})
                    </span>
                </div>

                <h3 className="text-slate-700 font-bold text-[13px] mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {product?.name || "Premium Product"}
                </h3>

                <div className="mt-auto pt-2 flex flex-col gap-2">
                    <div className="flex flex-col">
                        <span className="text-base font-black text-slate-900 leading-none">
                            Rs: {displayPrice?.toLocaleString()}
                        </span>
                        {strikePrice && (
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest line-through mt-0.5 opacity-60">
                                Rs: {strikePrice?.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center gap-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest py-2.5 rounded-lg hover:bg-primary transition-all active:scale-95 shadow-md shadow-slate-200"
                    >
                        <ShoppingCart size={12} />
                        Add to Cart
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;

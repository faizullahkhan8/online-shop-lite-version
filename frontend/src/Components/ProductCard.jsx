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

    let originalPrice = null;
    if (product?.discount > 0) {
        originalPrice = (product.price * 1.1).toFixed(2);
    }

    const rating = Math.floor(product?.rating || 0);

    return (
        <Link
            to={`/product/${product?._id}`}
            className="group flex flex-col h-full bg-white rounded-[2rem] border border-slate-100 p-3 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
        >
            <div className="relative aspect-square w-full bg-slate-50/50 rounded-[1.5rem] overflow-hidden">
                {product?.discount > 0 && (
                    <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                        -{product.discount}%
                    </div>
                )}

                <button
                    onClick={handleWishlist}
                    className={`absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-xl backdrop-blur-md transition-all ${
                        isInWishlist
                            ? "bg-red-500 text-white shadow-lg shadow-red-200"
                            : "bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white shadow-sm"
                    }`}
                >
                    <Heart
                        size={18}
                        fill={isInWishlist ? "currentColor" : "none"}
                    />
                </button>

                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/${product?.image}`}
                    alt={product?.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
                />
            </div>

            <div className="px-2 pt-4 pb-2 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={12}
                                fill={i < rating ? "currentColor" : "none"}
                                className={
                                    i < rating
                                        ? "text-amber-400"
                                        : "text-slate-200"
                                }
                            />
                        ))}
                    </div>
                    <span className="text-[11px] font-black text-slate-400">
                        ({product?.rating || 0})
                    </span>
                </div>

                <h3 className="text-slate-700 font-bold text-sm mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {product?.name || "Premium Product"}
                </h3>

                <div className="mt-auto pt-3 flex flex-col gap-3">
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-slate-900 leading-none">
                            Rs: {product?.price}
                        </span>
                        {originalPrice && (
                            <span className="text-[11px] text-slate-400 line-through mt-1">
                                Rs: {originalPrice}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-primary transition-all active:scale-95 shadow-lg shadow-slate-200"
                    >
                        <ShoppingCart size={14} />
                        Add to Cart
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;

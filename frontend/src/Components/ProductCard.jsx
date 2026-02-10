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
            className="group flex flex-col h-full bg-white rounded-lg border border-gray-200 p-3 hover:border-blue-500 hover:shadow-md transition-all"
        >
            <div className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                {isDiscounted && (
                    <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded shadow-sm">
                        {product.promotion?.discountType === "PERCENTAGE"
                            ? `-${product.promotion.discountValue}%`
                            : "SALE"}
                    </div>
                )}

                <button
                    onClick={handleWishlist}
                    className={`absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-lg transition-all ${isInWishlist
                        ? "bg-red-500 text-white shadow-sm"
                        : "bg-white text-gray-400 hover:text-red-500 shadow-sm border border-gray-200"
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
                    className="absolute inset-0 w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            <div className="px-1 pt-3 pb-1 flex flex-col flex-1">
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
                                        : "text-gray-200"
                                }
                            />
                        ))}
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                        ({product?.rating || 0})
                    </span>
                </div>

                <h3 className="text-gray-900 font-medium text-sm mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {product?.name || "Premium Product"}
                </h3>

                <div className="mt-auto pt-2 flex flex-col gap-2">
                    <div className="flex flex-col">
                        <span className="text-base font-semibold text-gray-900 leading-none">
                            Rs {displayPrice?.toLocaleString()}
                        </span>
                        {strikePrice && (
                            <span className="text-xs text-gray-400 line-through mt-0.5">
                                Rs {strikePrice?.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center gap-1.5 bg-blue-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
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
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
        <div className="group bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-6 hover:border-blue-500 hover:shadow-md transition-all relative">
            <div className="w-full md:w-48 h-48 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center relative p-4 overflow-hidden border border-gray-100">
                <img
                    src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${product?.image}`}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <button
                    onClick={handleWishlist}
                    className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-300 ${isInWishlist
                        ? "bg-red-500 text-white shadow-md"
                        : "bg-white text-gray-400 hover:text-red-500 shadow-sm border border-gray-200"
                        }`}
                >
                    <Heart
                        size={16}
                        fill={isInWishlist ? "currentColor" : "none"}
                    />
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <div className="space-y-0.5">
                            <span className="text-xs font-medium text-blue-600">
                                {product?.collection?.name || "No Collection"}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {product.name}
                            </h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                        <div className="flex flex-col">
                            <span className="text-xl font-semibold text-gray-900">
                                Rs. {product.price?.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                                Rs. {(product.price + 500).toLocaleString()}
                            </span>
                        </div>
                        <div className="h-6 w-[1px] bg-gray-200" />
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={12}
                                        fill={i < 4 ? "#f59e0b" : "none"}
                                        className={
                                            i < 4
                                                ? "text-amber-500"
                                                : "text-gray-200"
                                        }
                                    />
                                ))}
                                <span className="ml-1 text-xs font-semibold text-gray-900">
                                    4.8
                                </span>
                            </div>
                            <span className="text-xs text-gray-500">
                                154 reviews
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4 max-w-xl">
                        {product.description ||
                            "High-performance architecture meets daily utility. This limited edition item is designed for durability and optimized for professional deployment."}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded border border-green-200">
                            <ShieldCheck
                                size={14}
                                className="text-green-600"
                            />
                            <span className="text-xs font-medium text-green-700">
                                Free Shipping
                            </span>
                        </div>
                        <span className="text-xs text-gray-500">
                            In Stock
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to={`/product/${product?._id}`}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group/link"
                        >
                            View Details
                            <ArrowRight
                                size={14}
                                className="group-hover/link:translate-x-0.5 transition-transform"
                            />
                        </Link>
                        <button className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                            <ShoppingBag size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductListItem;

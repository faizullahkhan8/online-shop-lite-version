import { Heart, Star } from "lucide-react";
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
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-shadow">
            {/* Image */}
            <div className="w-full md:w-48 h-48 flex-shrink-0 flex items-center justify-center">
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/${
                        product?.image
                    }`}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                />
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900">
                                Rs: {product.price}
                            </span>
                            <span className="text-gray-400 line-through text-sm">
                                Rs:{product.price + 500}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <div className="flex text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        fill={i < 4 ? "currentColor" : "none"}
                                        className={
                                            i < 4
                                                ? "text-amber-500"
                                                : "text-gray-300"
                                        }
                                    />
                                ))}
                            </div>
                            <span>7.5</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>154 orders</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="text-green-600">
                                Free Shipping
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            dispatch(toggleWishlist(product));
                            try {
                                if (isInWishlist) {
                                    await removeFromWishlist(
                                        product._id || product.id
                                    );
                                } else {
                                    await addToWishlist(
                                        product._id || product.id
                                    );
                                }
                            } catch (err) {
                                dispatch(toggleWishlist(product));
                            }
                        }}
                        className={`p-2 border border-gray-200 rounded-md transition-colors ${
                            isInWishlist
                                ? "text-red-500"
                                : "hover:border-primary hover:text-primary"
                        }`}
                    >
                        <Heart size={20} />
                    </button>
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {product.description ||
                        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                </p>

                <Link
                    to={`/product/${product?._id}`}
                    className="text-primary font-medium text-sm hover:underline"
                >
                    View details
                </Link>
            </div>
        </div>
    );
};

export default ProductListItem;

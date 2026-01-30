import { Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { toggleWishlist } from "../store/slices/wishlistSlice";
import { useAddToWishlist, useRemoveFromWishlist } from "../api/hooks/user.api";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log(product);
        dispatch(addToCart(product));
    };

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
            // revert on failure
            dispatch(toggleWishlist(product));
        }
    };

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

    let originalPrice = null;
    if (product?.discount > 0) {
        originalPrice = (product.price * 1.1).toFixed(2);
    }

    const rating = Math.floor(product?.rating || 0);

    return (
        <Link
            to={`/product/${product?._id}`}
            className="block bg-white border border-gray-200 rounded-lg overflow-hidden 
                       hover:shadow-md transition-shadow group h-full flex flex-col"
        >
            <div className="relative pt-[100%] bg-white border-b border-gray-100">
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/${
                        product?.image
                    }`}
                    alt={product?.name || "Product image"}
                    loading="lazy"
                    className="absolute top-0 left-0 w-full h-full object-contain p-4 
                               group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="font-bold text-lg text-gray-900">
                            Rs:{product?.price}
                        </span>

                        {originalPrice && (
                            <span className="ml-2 text-sm text-gray-400 line-through">
                                Rs: {originalPrice}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleWishlist}
                        className={`p-1.5 border border-gray-200 rounded hover:border-red-200 transition-colors ${
                            isInWishlist ? "text-red-500" : "text-gray-600"
                        }`}
                        aria-label={
                            isInWishlist
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                        }
                    >
                        <Heart size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-amber-500">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <Star
                                key={i}
                                size={14}
                                fill={i < rating ? "currentColor" : "none"}
                                className={
                                    i < rating
                                        ? "text-amber-500"
                                        : "text-gray-300"
                                }
                            />
                        ))}
                    </div>
                    <span className="text-amber-500 text-sm">
                        {product?.rating || 0}
                    </span>
                </div>

                <h3
                    className="text-gray-600 font-medium mb-4 line-clamp-2 grow 
                               group-hover:text-primary transition-colors"
                >
                    {product?.name || "Product"}
                </h3>

                <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 
                               border border-gray-200 text-primary font-medium py-2 rounded 
                               hover:bg-primary hover:text-white transition-all active:scale-95"
                >
                    Add to Cart
                </button>
            </div>
        </Link>
    );
};

export default ProductCard;

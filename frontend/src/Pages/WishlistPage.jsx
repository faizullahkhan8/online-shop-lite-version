import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "../Components/ProductCard";
import { useEffect } from "react";
import { useGetWishlist, useRemoveFromWishlist } from "../api/hooks/user.api";
import { setWishlist, toggleWishlist } from "../store/slices/wishlistSlice";
import { Heart, ArrowRight, Trash2, ShoppingBag } from "lucide-react";

const WishlistPage = () => {
    const items = useSelector((state) => state.wishlist.items);
    const dispatch = useDispatch();
    const { getWishlist } = useGetWishlist();
    const { removeFromWishlist } = useRemoveFromWishlist();

    useEffect(() => {
        (async () => {
            const resp = await getWishlist();
            if (resp?.wishlist) {
                dispatch(
                    setWishlist(
                        resp.wishlist.map((p) => ({ ...p, id: p._id })),
                    ),
                );
            }
        })();
    }, []);

    return (
        <div className="container mx-auto px-4 lg:px-8 py-8 min-h-[70vh]">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 pb-4 border-b border-gray-200">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Heart
                            className="text-blue-600"
                            size={20}
                            fill="currentColor"
                        />
                        <span className="text-sm text-gray-500 font-medium">
                            Personal Collection
                        </span>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
                        My Wishlist
                    </h1>
                </div>
                <p className="text-sm font-medium text-gray-600">
                    {items.length} {items.length === 1 ? "item" : "items"} saved
                </p>
            </div>

            {items.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg py-16 px-6 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-4 relative">
                        <Heart size={32} className="text-gray-300" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                            <ShoppingBag size={12} className="text-blue-600" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Your wishlist is empty
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-xs text-center">
                        Looks like you haven't saved any items yet. Start
                        exploring our latest collections!
                    </p>
                    <Link
                        to="/products"
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Browse Products
                        <ArrowRight size={16} />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.filter(Boolean).map((product, idx) => {
                        const key = product?.id || product?._id || idx;
                        if (!product || (!product.id && !product._id))
                            return null;

                        return (
                            <div key={key} className="group flex flex-col">
                                <ProductCard product={product} />
                                <div className="mt-3 px-1">
                                    <button
                                        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                                        onClick={async () => {
                                            await removeFromWishlist(
                                                product._id || product.id,
                                            );
                                            dispatch(toggleWishlist(product));
                                        }}
                                    >
                                        <Trash2 size={14} />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "../Components/ProductCard";
import { useEffect } from "react";
import { useGetWishlist, useRemoveFromWishlist } from "../api/hooks/user.api";
import { setWishlist, toggleWishlist } from "../store/slices/wishlistSlice";

const WishlistPage = () => {
    const items = useSelector((state) => state.wishlist.items);
    const dispatch = useDispatch();
    const { getWishlist } = useGetWishlist();
    const { removeFromWishlist } = useRemoveFromWishlist();

    useEffect(() => {
        (async () => {
            const resp = await getWishlist();
            if (resp?.wishlist) {
                // server returns populated product objects — normalize id
                dispatch(
                    setWishlist(resp.wishlist.map((p) => ({ ...p, id: p._id })))
                );
            }
        })();
    }, []);

    return (
        <div className="container py-6">
            <h1 className="text-xl font-bold mb-6">
                My Wishlist ({items.length})
            </h1>

            {items.length === 0 ? (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center">
                    <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <svg
                            width="32"
                            height="32"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            className="text-gray-400"
                        >
                            <path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z" />
                        </svg>
                    </span>
                    <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                    <Link
                        to="/products"
                        className="text-primary hover:underline"
                    >
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.filter(Boolean).map((product, idx) => {
                        const key = product?.id || product?._id || idx;
                        if (!product || (!product.id && !product._id))
                            return null;
                        return (
                            <div key={key}>
                                <ProductCard product={product} />
                                <div className="mt-2 text-right">
                                    <button
                                        className="text-sm text-red-500"
                                        onClick={async () => {
                                            await removeFromWishlist(
                                                product._id || product.id
                                            );
                                            dispatch(toggleWishlist(product));
                                        }}
                                    >
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

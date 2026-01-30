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
        <div className="container mx-auto px-4 lg:px-8 py-12 min-h-[70vh]">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Heart
                            className="text-primary"
                            size={20}
                            fill="currentColor"
                        />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Personal Collection
                        </span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                        My <span className="text-primary">Wishlist</span>
                    </h1>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    {items.length} {items.length === 1 ? "Item" : "Items"} Saved
                </p>
            </div>

            {items.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-[3rem] py-20 px-6 flex flex-col items-center justify-center shadow-2xl shadow-slate-200/50">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 relative">
                        <Heart size={40} className="text-slate-200" />
                        <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <ShoppingBag size={14} className="text-primary" />
                        </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">
                        Your wishlist is empty
                    </h3>
                    <p className="text-slate-400 text-sm mb-8 max-w-xs text-center font-medium">
                        Looks like you haven't saved any items yet. Start
                        exploring our latest collections!
                    </p>
                    <Link
                        to="/products"
                        className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-primary transition-all active:scale-95 shadow-lg shadow-slate-900/20"
                    >
                        Browse Products
                        <ArrowRight size={16} />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.filter(Boolean).map((product, idx) => {
                        const key = product?.id || product?._id || idx;
                        if (!product || (!product.id && !product._id))
                            return null;

                        return (
                            <div key={key} className="group flex flex-col">
                                <ProductCard product={product} />
                                <div className="mt-4 px-2">
                                    <button
                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                                        onClick={async () => {
                                            await removeFromWishlist(
                                                product._id || product.id,
                                            );
                                            dispatch(toggleWishlist(product));
                                        }}
                                    >
                                        <Trash2 size={14} />
                                        Remove from list
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

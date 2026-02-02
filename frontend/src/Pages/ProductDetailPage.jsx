import { useState, useEffect } from "react";
import {
    Heart,
    Check,
    Package,
    ShoppingCart,
    Loader2,
    X,
    Boxes,
    ShieldCheck,
    Truck,
    Minus,
    Plus,
} from "lucide-react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../Components/Breadcrumb";
import { useGetProductById } from "../api/hooks/product.api";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { toggleWishlist } from "../store/slices/wishlistSlice";
import { useAddToWishlist, useRemoveFromWishlist } from "../api/hooks/user.api";

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const { getProductById, loading: productLoading } = useGetProductById();

    const dispatch = useDispatch();
    const { addToWishlist } = useAddToWishlist();
    const { removeFromWishlist } = useRemoveFromWishlist();
    const wishlistItems = useSelector((state) => state.wishlist.items || []);

    const matchId = (item, product) => {
        if (!item || !product) return false;
        const aval = item._id || item.id || item;
        const bval = product._id || product.id || product;
        return aval.toString() === bval.toString();
    };

    const isInWishlist = !!wishlistItems.find((item) => matchId(item, product));

    useEffect(() => {
        (async () => {
            const response = await getProductById(id);
            if (response?.success) {
                setProduct(response.product);
            }
        })();
    }, [id]);

    if (productLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50/50">
                <Loader2 className="animate-spin text-primary mb-4" size={40} />
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Loading details...
                </p>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({ ...product, quantity }));
    };

    const handleWishlist = async () => {
        if (!product) return;
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

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Catalog", path: "/products" },
        {
            label: product?.category?.name || "Category",
            path: `/products?category=${product?.category?.name}`,
        },
        { label: product?.name || "Product" },
    ];

    return (
        <div className="bg-slate-50/50 min-h-screen">
            <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
                <Breadcrumb items={breadcrumbItems} />

                <div className="mt-8 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-16">
                        <div className="space-y-6">
                            <div className="aspect-square bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-center p-12 group">
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/${product?.image}`}
                                    alt={product?.name}
                                    className="max-h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="mb-6">
                                {product?.stock > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                        <Check size={12} strokeWidth={3} /> In
                                        Stock
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">
                                        <X size={12} strokeWidth={3} /> Out of
                                        Stock
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-4 uppercase">
                                {product?.name}
                            </h1>

                            <p className="text-slate-500 leading-relaxed mb-8 font-medium">
                                {product?.description ||
                                    "Experience the perfect blend of performance and design with our latest addition to the collection."}
                            </p>

                            <div className="flex items-center gap-8 mb-8 pb-8 border-b border-slate-100">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                                        Total Sales
                                    </span>
                                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                                        <Package
                                            size={16}
                                            className="text-primary"
                                        />
                                        <span>
                                            {product?.soldCount || 0}+ Sold
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                                        Catalog Unit
                                    </span>
                                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                                        <Boxes
                                            size={16}
                                            className="text-primary"
                                        />
                                        <span>
                                            {product?.category?.name || "Tech"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1),
                                                )
                                            }
                                            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-12 text-center font-black text-slate-900">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setQuantity(quantity + 1)
                                            }
                                            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product?.stock <= 0}
                                        className="flex-1 bg-slate-900 text-white h-12 lg:h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:bg-primary transition-all active:scale-95 shadow-xl shadow-slate-900/10 disabled:opacity-50 disabled:hover:bg-slate-900"
                                    >
                                        <ShoppingCart size={18} /> Add to Cart
                                    </button>
                                </div>

                                <button
                                    onClick={handleWishlist}
                                    className={`w-full h-12 lg:h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 border-2 transition-all ${
                                        isInWishlist
                                            ? "bg-rose-50 border-rose-100 text-rose-500"
                                            : "bg-white border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100"
                                    }`}
                                >
                                    <Heart
                                        size={18}
                                        fill={
                                            isInWishlist
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />
                                    {isInWishlist
                                        ? "Saved in Wishlist"
                                        : "Add to Wishlist"}
                                </button>
                            </div>

                            <div className="mt-12 grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                    <Truck className="text-primary" size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                                        Fast Delivery
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                    <ShieldCheck
                                        className="text-primary"
                                        size={20}
                                    />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                                        Secure Warranty
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;

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
    ArrowRight,
    CheckCircle2,
} from "lucide-react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../Components/Breadcrumb";
import { useGetProductById } from "../api/hooks/product.api";

import StarRating from "../Components/UI/StarRating";
import ProductReviews from "../Components/Product/ProductReviews";
import { useNavigate } from "react-router-dom";

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const { getProductById, loading: productLoading } = useGetProductById();
    const navigate = useNavigate();

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
            <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
                <Loader2
                    className="animate-spin text-zinc-900 mb-4"
                    size={32}
                    strokeWidth={1.5}
                />
                <p className="text-sm uppercase tracking-[0.3em] font-bold text-zinc-400">
                    Loading Collection...
                </p>
            </div>
        );
    }

    const handleBuyNow = () => {
        if (!product) return;
        const effectivePrice = product?.effectivePrice || product?.price;
        navigate("/checkout", {
            state: {
                buyNowProduct: {
                    ...product,
                    quantity,
                    price: effectivePrice,
                    totalPrice: effectivePrice * quantity,
                    selected: true,
                },
            },
        });
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Catalog", path: "/products" },
        {
            label: product?.collection?.name || "Collection",
            path: `/products?collection=${product?.collection?._id || product?.collection?.name || ""}`,
        },
        { label: product?.name || "Product" },
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 lg:px-12 py-8 lg:py-12 max-w-7xl">
                <div className="mb-10">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    <div className="lg:col-span-7">
                        <div className="aspect-[4/5] bg-zinc-50 flex items-center justify-center p-12 relative group border border-zinc-100">
                            <img
                                src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${product?.image}`}
                                alt={product?.name}
                                className="max-h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                            />
                            {product?.stock <= 5 && product?.stock > 0 && (
                                <div className="absolute top-6 left-6 bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                                    Limited Stock
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col">
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-sm uppercase tracking-[0.3em] text-zinc-400 font-bold">
                                {product?.collection?.name ||
                                    "Premium Collection"}
                            </p>
                            {product?.stock > 0 ? (
                                <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-bold uppercase tracking-widest">
                                    <CheckCircle2 size={12} /> Available
                                </span>
                            ) : (
                                <span className="text-red-500 text-sm font-bold uppercase tracking-widest">
                                    Sold Out
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-zinc-900 uppercase mb-4">
                            {product?.name?.split(" ").map((word, i) =>
                                i === 0 ? (
                                    <span key={i}>{word} </span>
                                ) : (
                                    <span key={i} className="font-semibold">
                                        {word}{" "}
                                    </span>
                                ),
                            )}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <StarRating
                                rating={product?.rating || 0}
                                readonly
                                size={14}
                            />
                            <span className="text-sm uppercase tracking-widest text-zinc-400 font-bold border-l border-zinc-200 pl-4">
                                {product?.numReviews || 0} REVIEWS
                            </span>
                        </div>

                        <p className="text-zinc-500 text-sm leading-relaxed font-light mb-10 lg:pr-10">
                            {product?.description ||
                                "A masterclass in modern design and functional elegance, part of our exclusive Studio Edition series."}
                        </p>

                        <div className="mb-10 py-8 border-y border-zinc-100">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-3">
                                Unit Price
                            </p>
                            <div className="flex items-baseline gap-4">
                                {product?.promotion ? (
                                    <>
                                        <span className="text-3xl font-light text-emerald-600 tracking-tighter">
                                            RS{" "}
                                            {product?.effectivePrice?.toLocaleString()}
                                        </span>
                                        <span className="text-lg text-zinc-400 line-through font-light">
                                            RS{" "}
                                            {product?.price?.toLocaleString()}
                                        </span>
                                        <span className="text-sm bg-emerald-50 text-emerald-600 px-3 py-1 rounded-sm font-bold uppercase tracking-wider">
                                            {product.promotion.title}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-3xl font-light text-zinc-900 tracking-tighter">
                                        RS {product?.price?.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center border border-zinc-200 h-14 bg-white">
                                    <button
                                        onClick={() =>
                                            setQuantity(
                                                Math.max(1, quantity - 1),
                                            )
                                        }
                                        className="w-12 h-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-10 text-center text-xs font-bold text-zinc-900">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setQuantity(quantity + 1)
                                        }
                                        className="w-12 h-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={product?.stock <= 0}
                                    className="flex-1 bg-zinc-900 text-white h-14 text-md font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-zinc-700 transition-all disabled:opacity-20"
                                >
                                    <ArrowRight size={16} strokeWidth={1.5} />
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        <div className="mt-12 grid grid-cols-2 gap-8 border-t border-zinc-100 pt-10">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 text-zinc-900">
                                    <Truck size={18} strokeWidth={1.2} />
                                    <span className="text-sm font-bold uppercase tracking-widest">
                                        Global Shipping
                                    </span>
                                </div>
                                <p className="text-sm text-zinc-400 leading-relaxed uppercase tracking-tighter">
                                    Delivery within 3-5 business days
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 text-zinc-900">
                                    <ShieldCheck size={18} strokeWidth={1.2} />
                                    <span className="text-sm font-bold uppercase tracking-widest">
                                        Studio Warranty
                                    </span>
                                </div>
                                <p className="text-sm text-zinc-400 leading-relaxed uppercase tracking-tighter">
                                    12-Month authenticity guarantee
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-24 pt-16 border-t border-zinc-100">
                    <div className="mb-12">
                        <h2 className="text-xl font-light uppercase tracking-[0.3em] text-zinc-900">
                            Customer{" "}
                            <span className="font-semibold">Feedback</span>
                        </h2>
                    </div>
                    {product && (
                        <ProductReviews productId={product._id || product.id} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;

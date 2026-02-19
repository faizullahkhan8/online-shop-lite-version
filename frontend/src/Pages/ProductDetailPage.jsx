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
import { useProductById } from "../features/products/product.queries";

import StarRating from "../Components/UI/StarRating";
import ProductReviews from "../Components/Product/ProductReviews";
import { useNavigate } from "react-router-dom";

const ProductDetailPage = () => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);

    const { data, isLoading: productLoading } = useProductById(id);
    const navigate = useNavigate();

    if (productLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
                <Loader2
                    className="animate-spin text-zinc-900 mb-4"
                    size={32}
                    strokeWidth={1.5}
                />
                <p className="text-sm uppercase tracking-[0.3em] font-bold text-zinc-500">
                    Loading Collection...
                </p>
            </div>
        );
    }

    const handleBuyNow = () => {
        if (!data?.product) return;
        const effectivePrice = data?.product?.effectivePrice || data?.product?.price;
        navigate("/checkout", {
            state: {
                buyNowProduct: {
                    ...data?.product,
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
        { label: "Collections", path: "/collections" },
        {
            label: data?.product?.collection?.name || "Collection",
            path: `/products?collection=${data?.product?.collection?._id || data?.product?.collection?.name || ""}`,
        },
        { label: data?.product?.name || "Product" },
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 lg:px-12 py-8 lg:py-12 max-w-7xl">
                <div className="mb-10">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    <div className="lg:col-span-7">
                        <div className="bg-zinc-50 flex items-center justify-center rounded-2xl relative group border border-zinc-100 overflow-hidden">
                            <img
                                src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${data?.product?.image}`}
                                alt={data?.product?.name}
                                className="max-h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                            />
                            {data?.product?.stock <= 5 && data?.product?.stock > 0 && (
                                <div className="absolute top-6 left-6 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest px-3 py-1">
                                    Limited Stock
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col">
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 font-bold">
                                {data?.product?.collection?.name ||
                                    "Premium Collection"}
                            </p>
                            {data?.product?.stock > 0 ? (
                                <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-bold uppercase tracking-widest">
                                    <CheckCircle2 size={12} />
                                    Available
                                </span>
                            ) : (
                                <span className="text-red-500 text-sm font-bold uppercase tracking-widest">
                                    Sold Out
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-zinc-900 uppercase mb-4">
                            {data?.product?.name?.split(" ").map((word, i) =>
                                i === 0 ? (
                                    <span key={i}>{word} </span>
                                ) : (
                                    <span key={i} className="font-semibold">
                                        {word}{" "}
                                    </span>
                                ),
                            )}
                        </h1>

                        <div className={`flex items-center gap-4 mb-8 ${data?.product?.stock === 0 ? "text-red-500" : "text-green-500"}`}>
                            Availible Stock : {data?.product?.stock}
                        </div>
                        <div className="flex items-center gap-4 mb-8">
                            <StarRating
                                rating={data?.product?.rating || 0}
                                readonly
                                size={14}
                            />
                            <span className="text-sm uppercase tracking-widest text-zinc-500 font-bold border-l border-zinc-200 pl-4">
                                {data?.product?.numReviews || 0} REVIEWS
                            </span>
                        </div>


                        <div className="mb-10 py-8 border-y border-zinc-100">
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold mb-3">
                                Unit Price
                            </p>
                            <div className="flex items-baseline gap-4">
                                {data?.product?.promotion ? (
                                    <>
                                        <span className="text-3xl font-light text-emerald-600 tracking-tighter">
                                            RS{" "}
                                            {data?.product?.effectivePrice?.toLocaleString()}
                                        </span>
                                        <span className="text-lg text-zinc-500 line-through font-light">
                                            RS{" "}
                                            {data?.product?.price?.toLocaleString()}
                                        </span>
                                        <span className="text-sm bg-emerald-50 text-emerald-600 px-3 py-1 rounded-2xl font-bold uppercase tracking-wider">
                                            {data?.product?.promotion?.title}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-3xl font-light text-zinc-900 tracking-tighter">
                                        RS {data?.product?.price?.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center border border-zinc-200 h-14 bg-white rounded-2xl">
                                    <button
                                        onClick={() =>
                                            setQuantity(
                                                Math.max(1, quantity - 1),
                                            )
                                        }
                                        className="w-12 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
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
                                        className="w-12 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={data?.product?.stock <= 0}
                                    className="flex-1 bg-zinc-900 text-white h-14 text-md font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-zinc-700 transition-all disabled:opacity-20 rounded-2xl"
                                >
                                    <ArrowRight size={16} strokeWidth={1.5} />
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-10 flex flex-col gap-4">
                    <h1 className="text-xl font-light uppercase tracking-[0.3em] text-zinc-900">Description</h1>
                    <p className="text-zinc-700 text-md leading-relaxed font-light mb-10 lg:pr-10">
                        {data?.product?.description ||
                            "A masterclass in modern design and functional elegance, part of our exclusive Studio Edition series."}
                    </p>

                </div>
                <div className="mt-10 border-zinc-100">
                    {data?.product && (
                        <ProductReviews productId={data?.product._id || data?.product.id} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;

import { useState } from "react";
import {
    Loader2,
    X,
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
import LexicalRenderer from "../Components/LexicalRenderer";
import { useNavigate } from "react-router-dom";

const ProductDetailPage = () => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    // Added state for image switching
    const [activeImage, setActiveImage] = useState(0);

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
                <p className="text-sm font-semibold uppercase tracking-[0.3em] font-bold text-zinc-500">
                    Loading Collection...
                </p>
            </div>
        );
    }

    const handleBuyNow = () => {
        if (!data?.product) return;
        const effectivePrice =
            data?.product?.effectivePrice || data?.product?.price;
        navigate("/checkout", {
            state: {
                buyNowProduct: {
                    ...data?.product,
                    quantity,
                    price: effectivePrice,
                    originalPrice: data?.product?.price,
                    totalPrice: effectivePrice * quantity,
                    selected: true,
                },
            },
        });
    };

    console.log(data?.product);

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Collections", path: "/collections" },
        {
            label: data?.product?.collection?.name || "Collection",
            path: `/products?collection=${data?.product?.collection?._id || data?.product?.collection?.name || ""}`,
        },
        { label: data?.product?.name || "Product" },
    ];

    // Helper to get image URL safely
    const images = data?.product?.images || [];
    const mainImageUrl =
        images.length > 0
            ? `${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${images[activeImage]?.filePath}`
            : `${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${data?.product?.image}`;

    return (
        <div className="bg-white min-h-screen mt-10">
            <div className="container mx-auto px-4 lg:px-12 py-8 lg:py-12 max-w-7xl">
                <div className="mb-10 mt-20">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Refined Image Section */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="bg-zinc-50 flex items-center justify-center rounded-2xl relative group border border-zinc-100 overflow-hidden aspect-square lg:aspect-auto lg:h-150">
                            <img
                                src={mainImageUrl}
                                alt={data?.product?.name}
                                className="max-h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                            />
                            {data?.product?.stock <= 5 &&
                                data?.product?.stock > 0 && (
                                    <div className="absolute top-6 left-6 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest px-3 py-1">
                                        Limited Stock
                                    </div>
                                )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(index)}
                                        className={`relative w-20 h-20 shrink-0 rounded-xl border-2 transition-all overflow-hidden bg-zinc-50 ${activeImage === index
                                            ? "border-zinc-900"
                                            : "border-transparent opacity-80 hover:opacity-100"
                                            }`}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${img.filePath}`}
                                            className="w-full h-full object-cover mix-blend-multiply"
                                            alt={`View ${index + 1}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-5 flex flex-col">
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
                                {data?.product?.collection?.name ||
                                    "Premium Collection"}
                            </p>
                        </div>

                        <h1 className="text-3xl font-medium tracking-widest text-zinc-900 font-heading mb-4">
                            {data?.product?.name}
                        </h1>

                        <div
                            className={`flex items-center gap-4 mb-8 ${data?.product?.stock === 0 ? "text-red-500" : "text-green-500"}`}
                        >
                            {data?.product?.stock > 0
                                ? `Availible Stock: ${data?.product?.stock}`
                                : "Sold out"}
                        </div>
                        <div className="flex items-center gap-4 mb-8">
                            <StarRating
                                rating={data?.product?.rating || 0}
                                readonly
                                size={22}
                            />
                            <span className="text-sm font-semibold uppercase tracking-widest text-zinc-500 font-bold border-l border-zinc-200 pl-4">
                                {data?.product?.numReviews || 0} REVIEWS
                            </span>
                        </div>

                        <div className="mb-10 py-8 border-y border-zinc-100">
                            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-3">
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
                                        <span className="text-sm font-semibold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-2xl font-bold uppercase tracking-wider">
                                            {data?.product?.promotion?.title}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-3xl font-light text-zinc-900 tracking-tighter">
                                        RS{" "}
                                        {data?.product?.price?.toLocaleString()}
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
                                    <input
                                        type="number"
                                        min={1}
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(Math.max(1, Number(e.target.value)))
                                        }
                                        className="w-14 h-full text-center text-sm font-semibold font-bold text-zinc-900 border-none outline-none custom-quantity"
                                    />
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
                    <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900">
                        Description
                    </h1>
                    {/* seprator */}
                    <div className="w-full h-1 rounded-2xl bg-zinc-200"></div>
                    <LexicalRenderer
                        value={data?.product?.description}
                        className="mb-10 lg:pr-10"
                    />
                </div>
                <div className="mt-10 border-zinc-100">
                    {data?.product && (
                        <ProductReviews
                            productId={data?.product._id || data?.product.id}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;

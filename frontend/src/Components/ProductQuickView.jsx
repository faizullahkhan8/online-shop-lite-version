import { X, ChevronRight, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "./UI/StarRating";

const ProductQuickView = ({ product, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const navigate = useNavigate();

    const handleBuyNow = () => {
        if (!product) return;
        const effectivePrice = product?.effectivePrice || product?.price;
        navigate("/checkout", {
            state: {
                buyNowProduct: {
                    ...product,
                    quantity,
                    price: effectivePrice,
                    totalPrice: Number(effectivePrice) * quantity,
                    selected: true,
                },
            },
        });
    };

    const images = product?.images || [];

    const mainImageUrl =
        images.length > 0
            ? `${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${images[activeImage]?.filePath}`
            : `${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${product?.image}`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-white w-full max-w-5xl rounded-2xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 hover:rotate-90 transition-transform duration-300 text-zinc-500 hover:text-zinc-900 bg-white/80 backdrop-blur-sm rounded-full"
                >
                    <X size={20} strokeWidth={1} />
                </button>

                <div className="w-full md:w-1/2 bg-[#f9f9f9] p-6 flex flex-col gap-4">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-zinc-100">
                        <img
                            src={mainImageUrl}
                            alt={product?.name || "Product"}
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                    </div>

                    {images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg border-2 transition-all overflow-hidden bg-white ${
                                        activeImage === index
                                            ? "border-zinc-900"
                                            : "border-transparent opacity-60 hover:opacity-100"
                                    }`}
                                >
                                    <img
                                        src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${img.filePath}`}
                                        className="w-full h-full object-cover mix-blend-multiply"
                                        alt={`Thumbnail ${index + 1}`}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col">
                    <div className="mb-8">
                        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 mb-2 font-bold">
                            {typeof product?.collection === "string"
                                ? product.collection
                                : product?.collection?.name || "Studio Edition"}
                        </p>
                        <h2 className="text-2xl font-medium tracking-tight text-zinc-900 uppercase">
                            {product?.name || "Untitled Product"}
                        </h2>
                        <div className="mt-2 flex items-center gap-3">
                            {product?.promotion ? (
                                <>
                                    <p className="text-lg text-emerald-600 font-bold">
                                        Rs.{" "}
                                        {Number(
                                            product?.effectivePrice,
                                        ).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-zinc-500 line-through">
                                        Rs.{" "}
                                        {Number(
                                            product?.price,
                                        ).toLocaleString()}
                                    </p>
                                </>
                            ) : (
                                <p className="text-lg text-zinc-900 font-bold">
                                    Rs.{" "}
                                    {Number(product?.price).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div
                            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${product.stock === 0 ? "text-red-500" : "text-emerald-600"}`}
                        >
                            {product.stock === 0
                                ? "Out of Stock"
                                : `Available Stock: ${product.stock}`}
                        </div>

                        <div className="flex items-center gap-4">
                            <StarRating
                                rating={product?.rating || 0}
                                readonly
                                size={14}
                            />
                            <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold border-l border-zinc-200 pl-4">
                                {product?.numReviews || 0} REVIEWS
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div>
                            <h4 className="text-sm uppercase tracking-[0.2em] font-bold text-zinc-900 mb-3">
                                Description
                            </h4>
                            <p className="text-sm text-zinc-700 leading-relaxed font-light">
                                {product?.description?.slice(0, 200) + "..."}
                            </p>
                        </div>

                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex items-center border border-zinc-200 rounded-2xl h-14 bg-white">
                                <button
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                    className="px-5 h-full hover:text-zinc-900 text-zinc-400 transition-colors"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-8 text-center text-xs font-bold">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-5 h-full hover:text-zinc-900 text-zinc-400 transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className="flex-1 bg-zinc-900 text-white h-14 text-sm font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 rounded-2xl disabled:opacity-20"
                            >
                                Buy Now
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-zinc-100">
                        <button
                            onClick={() => navigate(`/product/${product?._id}`)}
                            className="text-xs uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900 transition-colors underline underline-offset-4 font-bold"
                        >
                            View Full Product Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductQuickView;

import { X, ChevronRight, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductQuickView = ({ product, onClose }) => {
    const [quantity, setQuantity] = useState(1);
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
                    totalPrice: effectivePrice * quantity,
                    selected: true,
                },
            },
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 hover:rotate-90 transition-transform duration-300 text-zinc-400 hover:text-zinc-900"
                >
                    <X size={20} strokeWidth={1} />
                </button>

                <div className="w-full md:w-1/2 bg-[#f9f9f9] h-[400px] md:h-auto">
                    <img
                        src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${product?.image}`}
                        alt={
                            typeof product?.name === "string"
                                ? product.name
                                : "Product Image"
                        }
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col">
                    <div className="mb-8">
                        <p className="text-sm uppercase tracking-[0.3em] text-zinc-400 mb-2">
                            {typeof product?.collection === "string"
                                ? product.collection
                                : product?.collection?.name || "Studio Edition"}
                        </p>
                        <h2 className="text-2xl font-medium tracking-tight text-zinc-900 uppercase">
                            {/* Explicitly access name to avoid rendering object */}
                            {product?.name || "Untitled Product"}
                        </h2>
                        <div className="mt-2 flex items-center gap-3">
                            {product?.promotion ? (
                                <>
                                    <p className="text-lg text-emerald-600 font-light">
                                        Rs.{" "}
                                        {Number(
                                            product?.effectivePrice,
                                        ).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-zinc-400 line-through">
                                        Rs.{" "}
                                        {Number(
                                            product?.price,
                                        ).toLocaleString()}
                                    </p>
                                </>
                            ) : (
                                <p className="text-lg text-zinc-900 font-light">
                                    Rs.{" "}
                                    {Number(product?.price).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div>
                            <h4 className="text-sm uppercase tracking-[0.2em] font-bold text-zinc-900 mb-3">
                                Description
                            </h4>
                            <p className="text-sm text-zinc-500 leading-relaxed font-light">
                                {product?.description ||
                                    "Premium healthcare solution designed for professional and home use."}
                            </p>
                        </div>

                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex items-center border border-zinc-200">
                                <button
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                    className="px-4 py-2 hover:bg-zinc-50 transition-colors"
                                >
                                    <Minus size={12} />
                                </button>
                                <span className="w-10 text-center text-xs font-medium">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-2 hover:bg-zinc-50 transition-colors"
                                >
                                    <Plus size={12} />
                                </button>
                            </div>

                            <button
                                onClick={handleBuyNow}
                                className="flex-1 bg-zinc-900 text-white py-4 text-md font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
                            >
                                Buy Now
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-zinc-100">
                        <button
                            onClick={() => navigate(`/product/${product?._id}`)}
                            className="text-sm uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors underline underline-offset-4"
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

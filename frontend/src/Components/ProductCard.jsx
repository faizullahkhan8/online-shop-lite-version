import { useState } from "react";
import ProductQuickView from "./ProductQuickView";
import { useNavigate } from "react-router-dom";
import StarRating from "./UI/StarRating";

const ProductCard = ({ product, isLarge = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <div
                className={`flex flex-col group cursor-pointer snap-start ${isLarge ? "min-w-[85vw] md:min-w-[45vw] lg:min-w-[30%]" : "w-full"}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative overflow-hidden aspect-[3/4] bg-[#f5f5f5]">
                    {product.tag && (
                        <div className="absolute top-4 left-4 z-10">
                            <span className="bg-white/90 backdrop-blur-sm text-[9px] tracking-[0.2em] uppercase px-2 py-1 font-medium text-zinc-900">
                                {product.tag}
                            </span>
                        </div>
                    )}

                    <img
                        src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${product?.image}`}
                        alt={product?.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />

                    {isHovered && (
                        <div
                            className="absolute inset-0 bg-black/5 flex items-end justify-center pb-8 animate-in fade-in duration-300"
                            onClick={() => navigate(`/product/${product._id}`)}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsQuickViewOpen(true);
                                }}
                                className="bg-white/90 backdrop-blur-md text-black px-8 py-2.5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-300 shadow-lg cursor-pointer"
                            >
                                Quick view
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex flex-col items-center text-center space-y-1">
                    <h3 className="text-md font-medium tracking-[0.15em] uppercase text-zinc-900 leading-tight">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2 justify-center">
                        {product?.promotion ? (
                            <>
                                <p className="text-sm tracking-wider text-emerald-600 font-light">
                                    {typeof product.effectivePrice === "number"
                                        ? `Rs. ${product.effectivePrice.toLocaleString()}`
                                        : "Price"}
                                </p>
                                <p className="text-xs tracking-wider text-zinc-400 line-through font-light">
                                    {typeof product.price === "number"
                                        ? `Rs. ${product.price.toLocaleString()}`
                                        : product.price}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm tracking-wider text-zinc-500 font-light">
                                {typeof product.price === "number"
                                    ? `Rs. ${product.price.toLocaleString()}`
                                    : product.price}
                            </p>
                        )}
                    </div>
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
                </div>
            </div>

            {isQuickViewOpen && (
                <ProductQuickView
                    product={product}
                    onClose={() => setIsQuickViewOpen(false)}
                />
            )}
        </>
    );
};

export default ProductCard;

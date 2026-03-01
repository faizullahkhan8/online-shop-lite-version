import { useState } from "react";
import { createPortal } from "react-dom";
import ProductQuickView from "./ProductQuickView";
import { useNavigate } from "react-router-dom";
import StarRating from "./UI/StarRating";

const ProductCard = ({ product, isLarge = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const navigate = useNavigate();

    const primaryImage =
        product.images && product.images.length > 0
            ? product.images.find((img) => img.isPrimary)?.filePath ||
            product.images[0].filePath
            : product.image;

    const secondaryImage =
        product.images && product.images.length > 1
            ? product.images[1].filePath
            : primaryImage;

    const handleOverlayClick = () => {
        navigate(`/product/${product._id}`);
    };

    const handleQuickView = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsQuickViewOpen(true);
    };

    return (
        // <>
        //     <div
        //         className={`flex flex-col group cursor-pointer snap-start ${isLarge ? "min-w-[85vw] md:min-w-[45vw] lg:min-w-[30%]" : "w-full"}`}
        //         onMouseEnter={() => setIsHovered(true)}
        //         onMouseLeave={() => setIsHovered(false)}
        //     >
        //         <div className="relative overflow-hidden rounded-2xl aspect-3/4 bg-zinc-50">
        //             {product.tag && (
        //                 <div className="absolute top-4 left-4 z-20">
        //                     <span className="bg-white/90 backdrop-blur-sm text-xs tracking-[0.2em] uppercase px-2 py-1 font-medium text-zinc-900 rounded-2xl">
        //                         {product.tag}
        //                     </span>
        //                 </div>
        //             )}

        //             <img
        //                 src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${primaryImage}`}
        //                 alt={product?.name}
        //                 className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-all duration-500 ${
        //                     isHovered &&
        //                     product.images &&
        //                     product.images.length > 1
        //                         ? "opacity-100 scale-100"
        //                         : "opacity-100 scale-100"
        //                 }`}
        //             />

        //             {product.images && product.images.length > 1 && (
        //                 <img
        //                     src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${secondaryImage}`}
        //                     alt={`${product?.name} alternate`}
        //                     className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-all duration-1000 ${
        //                         isHovered
        //                             ? "opacity-100 scale-105"
        //                             : "opacity-0 scale-100"
        //                     }`}
        //                 />
        //             )}

        //             {/* Clickable overlay — navigates to product page */}
        //             <div
        //                 className={`absolute inset-0 bg-black/5 flex items-end justify-center pb-8 transition-opacity duration-300 z-10 ${
        //                     isHovered ? "opacity-100" : "opacity-0"
        //                 }`}
        //                 onClick={handleOverlayClick}
        //             >
        //                 <button
        //                     type="button"
        //                     onClick={handleQuickView}
        //                     className="bg-white/90 backdrop-blur-md text-black px-8 py-2.5 text-xs font-medium tracking-[0.2em] uppercase rounded-2xl hover:bg-black hover:text-white transition-all duration-300 shadow-lg cursor-pointer"
        //                 >
        //                     Quick view
        //                 </button>
        //             </div>
        //         </div>

        //         <div className="mt-4 flex flex-col items-center text-center space-y-1">
        //             <h3 className="text-md font-medium tracking-[0.15em] uppercase text-zinc-900 leading-tight">
        //                 {product.name}
        //             </h3>
        //             <div className="flex items-center gap-2 justify-center">
        //                 {product?.promotion ? (
        //                     <>
        //                         <p className="text-sm tracking-wider text-emerald-600 font-light">
        //                             {typeof product.effectivePrice === "number"
        //                                 ? `Rs. ${product.effectivePrice.toLocaleString()}`
        //                                 : "Price"}
        //                         </p>
        //                         <p className="text-xs tracking-wider text-zinc-500 line-through font-light">
        //                             {typeof product.price === "number"
        //                                 ? `Rs. ${product.price.toLocaleString()}`
        //                                 : product.price}
        //                         </p>
        //                     </>
        //                 ) : (
        //                     <p className="text-sm tracking-wider text-zinc-700 font-light">
        //                         {typeof product.price === "number"
        //                             ? `Rs. ${product.price.toLocaleString()}`
        //                             : product.price}
        //                     </p>
        //                 )}
        //             </div>
        //             <div className="flex items-center gap-4 py-2">
        //                 <StarRating
        //                     rating={product?.rating || 0}
        //                     readonly
        //                     size={14}
        //                 />
        //                 <span className="text-sm uppercase tracking-widest text-zinc-500 font-bold border-l border-zinc-200 pl-4">
        //                     {product?.numReviews || 0} REVIEWS
        //                 </span>
        //             </div>
        //         </div>
        //     </div>

        //     {isQuickViewOpen &&
        //         createPortal(
        //             <ProductQuickView
        //                 product={product}
        //                 onClose={() => setIsQuickViewOpen(false)}
        //             />,
        //             document.body,
        //         )}
        // </>




        <>
            <div
                className={`flex flex-col group cursor-pointer snap-start ${isLarge ? "min-w-[60vw] md:min-w-[45vw] lg:min-w-[30%]" : "w-full"}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative overflow-hidden rounded-lg md:rounded-2xl aspect-[3/4] bg-zinc-50">
                    {product.tag && (
                        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20">
                            <span className="bg-white/90 backdrop-blur-sm text-[9px] md:text-xs tracking-[0.2em] uppercase px-1.5 py-0.5 md:px-2 md:py-1 font-medium text-zinc-900 rounded-lg md:rounded-2xl">
                                {product.tag}
                            </span>
                        </div>
                    )}

                    <img
                        src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${primaryImage}`}
                        alt={product?.name}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg md:rounded-2xl transition-all duration-500"
                    />

                    {product.images && product.images.length > 1 && (
                        <img
                            src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${secondaryImage}`}
                            alt={`${product?.name} alternate`}
                            className={`absolute inset-0 w-full h-full object-cover rounded-lg md:rounded-2xl transition-all duration-1000 ${isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
                                }`}
                        />
                    )}

                    {/* Overlay */}
                    <div
                        className={`absolute inset-0 bg-black/5 flex items-end justify-center pb-4 md:pb-8 transition-opacity duration-300 z-10 ${isHovered ? "opacity-100" : "opacity-0"
                            }`}
                        onClick={handleOverlayClick}
                    >
                        <button
                            type="button"
                            onClick={handleQuickView}
                            className="bg-white/90 backdrop-blur-md text-black px-5 md:px-8 py-1.5 md:py-2.5 text-[9px] md:text-xs font-medium tracking-[0.2em] uppercase rounded-lg md:rounded-2xl hover:bg-black hover:text-white transition-all duration-300 shadow-lg cursor-pointer"
                        >
                            Quick view
                        </button>
                    </div>
                </div>

                <div className="mt-2 md:mt-4 flex flex-col items-center text-center space-y-0.5 md:space-y-1 px-1">
                    <h3 className="text-[11px] md:text-md font-medium tracking-[0.12em] md:tracking-[0.15em] uppercase text-zinc-900 leading-tight line-clamp-1">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 md:gap-2 justify-center">
                        {product?.promotion ? (
                            <>
                                <p className="text-[11px] md:text-sm tracking-wider text-emerald-600 font-light">
                                    {typeof product.effectivePrice === "number"
                                        ? `Rs. ${product.effectivePrice.toLocaleString()}`
                                        : "Price"}
                                </p>
                                <p className="text-[10px] md:text-xs tracking-wider text-zinc-500 line-through font-light">
                                    {typeof product.price === "number"
                                        ? `Rs. ${product.price.toLocaleString()}`
                                        : product.price}
                                </p>
                            </>
                        ) : (
                            <p className="text-[11px] md:text-sm tracking-wider text-zinc-700 font-light">
                                {typeof product.price === "number"
                                    ? `Rs. ${product.price.toLocaleString()}`
                                    : product.price}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 py-0.5 md:py-2">
                        <StarRating
                            rating={product?.rating || 0}
                            readonly
                            size={10}
                        />
                        <span className="text-[9px] md:text-sm uppercase tracking-widest text-zinc-400 font-bold border-l border-zinc-200 pl-2 md:pl-4">
                            {product?.numReviews || 0}
                        </span>
                    </div>
                </div>
            </div>

            {isQuickViewOpen &&
                createPortal(
                    <ProductQuickView
                        product={product}
                        onClose={() => setIsQuickViewOpen(false)}
                    />,
                    document.body,
                )}
        </>
    );
};

export default ProductCard;

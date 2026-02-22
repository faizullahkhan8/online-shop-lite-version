import { useState } from "react";
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

    return (
        // <>
        //     <div
        //         className={`flex flex-col group cursor-pointer snap-start ${isLarge ? "min-w-[85vw] md:min-w-[45vw] lg:min-w-[30%]" : "w-full"}`}
        //         onMouseEnter={() => setIsHovered(true)}
        //         onMouseLeave={() => setIsHovered(false)}
        //     >
        //         <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-zinc-50">
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
        //                 className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-all duration-1000 ${
        //                     isHovered &&
        //                     product.images &&
        //                     product.images.length > 1
        //                         ? "opacity-0 scale-105"
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

        //             <div
        //                 className={`absolute inset-0 bg-black/5 flex items-end justify-center pb-8 transition-opacity duration-300 z-10 ${
        //                     isHovered ? "opacity-100" : "opacity-0"
        //                 }`}
        //                 onClick={() => navigate(`/product/${product._id}`)}
        //             >
        //                 <button
        //                     onClick={(e) => {
        //                         e.stopPropagation();
        //                         setIsQuickViewOpen(true);
        //                     }}
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

        //     {isQuickViewOpen && (
        //         <ProductQuickView
        //             product={product}
        //             onClose={() => setIsQuickViewOpen(false)}
        //         />
        //     )}
        // </>


        <div
            className={`flex flex-col group cursor-pointer snap-start h-full ${isLarge ? "min-w-[85vw] md:min-w-[45vw] lg:min-w-[30%]" : "w-full"}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Area — remove fixed h-100 w-60, use aspect ratio only */}
            {/* <div className="relative overflow-hidden rounded-xl aspect-[3/4] bg-gray-50 w-full">

                {product.tag && (
                    <div className="absolute top-3 left-3 z-20">
                        <span className="bg-white/95 text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 font-medium text-gray-700 rounded-full shadow-sm">
                            {product.tag}
                        </span>
                    </div>
                )}

                <div className="relative overflow-hidden rounded-xl aspect-[3/4] bg-gray-50 w-full">
                    <img
                        src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${primaryImage}`}
                        alt={product?.name}
                        className={`absolute inset-0 w-full h-full object-contain object-center transition-all duration-1000 ${isHovered && product.images && product.images.length > 1
                            ? "opacity-0 scale-100"
                            : "opacity-100 scale-100"
                            }`}
                    />

                    {product.images && product.images.length > 1 && (
                        <img
                            src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${secondaryImage}`}
                            alt={`${product?.name} alternate`}
                            className={`absolute inset-0 w-full h-full object-contain object-center transition-all duration-1000 ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-100"
                                }`}
                        />
                    )}
                </div>

                <div
                    className={`absolute inset-0 bg-black/10 flex items-end justify-center pb-6 transition-opacity duration-300 z-10 ${isHovered ? "opacity-100" : "opacity-0"
                        }`}
                    onClick={() => navigate(`/product/${product._id}`)}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsQuickViewOpen(true);
                        }}
                        className="bg-white text-gray-900 px-7 py-2.5 text-[10px] font-medium tracking-[0.2em] uppercase rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-md cursor-pointer"
                    >
                        Quick view
                    </button>
                </div>
            </div> */}


            <div className="relative rounded-xl aspect-[3/4] bg-gray-50 w-full overflow-hidden">
             
             

                 {product.tag && (
                    <div className="absolute top-3 left-3 z-20">
                        <span className="bg-white/95 text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 font-medium text-gray-700 rounded-full shadow-sm">
                            {product.tag}
                        </span>
                    </div>
                )}



                
             
                {/* padding wrapper — this is what gives the breathing room */}
                <div className="absolute inset-0 p-3">
                    <img
                        src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${primaryImage}`}
                        alt={product?.name}
                        className={`w-full h-full object-contain object-center transition-all duration-700 rounded-lg ${isHovered && product.images && product.images.length > 1
                                ? "opacity-0 scale-105"
                                : "opacity-100 scale-100"
                            }`}
                    />

                    {product.images && product.images.length > 1 && (
                        <img
                            src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${secondaryImage}`}
                            alt={`${product?.name} alternate`}
                            className={`absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] object-contain object-center transition-all duration-700 rounded-lg ${isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
                                }`}
                        />
                    )}
                </div>

                {/* Quick view overlay — still full bleed */}
                <div
                    className={`absolute inset-0 bg-black/10 flex items-end justify-center pb-6 transition-opacity duration-300 z-10 ${isHovered ? "opacity-100" : "opacity-0"
                        }`}
                    onClick={() => navigate(`/product/${product._id}`)}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsQuickViewOpen(true);
                        }}
                        className="bg-white text-gray-900 px-7 py-2.5 text-[10px] font-medium tracking-[0.2em] uppercase rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-md cursor-pointer"
                    >
                        Quick view
                    </button>
                </div>
            </div>





            {/* Card Info */}
            <div className="mt-3 flex flex-col items-center text-center px-1 w-full">

                <div className="min-h-[2.2rem] flex items-start justify-center w-full">
                    <h3 className="text-[11px] font-medium tracking-[0.15em] uppercase text-gray-800 leading-snug line-clamp-2 font-sans">
                        {product.name}
                    </h3>
                </div>

                <div className="min-h-[1.5rem] flex items-center justify-center gap-2 mb-3">
                    {product?.promotion ? (
                        <>
                            <p className="text-sm tracking-wider text-emerald-600 font-normal font-sans">
                                {typeof product.effectivePrice === "number"
                                    ? `Rs. ${product.effectivePrice.toLocaleString()}`
                                    : "Price"}
                            </p>
                            <p className="text-xs tracking-wider text-gray-400 line-through font-light font-sans">
                                {typeof product.price === "number"
                                    ? `Rs. ${product.price.toLocaleString()}`
                                    : product.price}
                            </p>
                        </>
                    ) : (
                        <p className="text-sm tracking-wider text-gray-700 font-normal font-sans">
                            {typeof product.price === "number"
                                ? `Rs. ${product.price.toLocaleString()}`
                                : product.price}
                        </p>
                    )}
                </div>

                <div className="min-h-[1.5rem] flex items-center justify-center gap-3">
                    <StarRating rating={product?.rating || 0} readonly size={12} />
                    <span className="text-[9px] uppercase tracking-[0.15em] text-gray-400 font-sans border-l border-gray-200 pl-3">
                        {product?.numReviews || 0} Reviews
                    </span>
                </div>
            </div>
        </div>



    );
};

export default ProductCard;

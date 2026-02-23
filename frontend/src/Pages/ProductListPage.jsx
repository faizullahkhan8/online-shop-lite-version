// import { useState, useEffect } from "react";
// import { X, PackageSearch, Loader2 } from "lucide-react";
// import { useSearchParams } from "react-router-dom";
// import ProductCard from "../Components/ProductCard.jsx";
// import { useProducts } from "../features/products/product.queries";
// import Pagination from "../Components/Pagination.jsx";
// import Breadcrumb from "../Components/Breadcrumb.jsx";

// const ProductListPage = () => {
//     const [searchParams] = useSearchParams();
//     const searchQuery = searchParams.get("search");
//     const collectionQuery = searchParams.get("collection");

//     const [page, setPage] = useState(1);
//     const [limit, setLimit] = useState(10);

//     const { data, isLoading } = useProducts({
//         search: searchQuery,
//         collection: collectionQuery,
//         page,
//         limit,
//     });

//     const products = data?.products || [];
//     const totalPages = data?.totalPages || 1;

//     if (isLoading) {
//         return (
//             <div className="flex flex-col items-center justify-center py-40">
//                 <Loader2
//                     className="animate-spin text-zinc-900 mb-4"
//                     size={24}
//                     strokeWidth={1}
//                 />
//                 <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
//                     Synchronizing...
//                 </p>
//             </div>
//         );
//     }

//     const breadcrumbItems = [
//         { label: "Home", path: "/" },
//         { label: "Products" },
//     ];

//     const displayProducts = products;

//     return (
//         <div className="bg-white min-h-screen mt-10">
//             <div className="container px-4 lg:px-12 py-12">
//                 <Breadcrumb items={breadcrumbItems} />

//                 <div className="flex flex-col gap-12">
//                     <main className="w-full">
//                         {products?.length === 0 ? (
//                             <div className="py-32 px-6 flex flex-col items-center justify-center border border-dashed border-zinc-200">
//                                 <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
//                                     <PackageSearch
//                                         size={24}
//                                         strokeWidth={1}
//                                         className="text-zinc-300"
//                                     />
//                                 </div>
//                                 <h3 className="text-md uppercase tracking-[0.2em] font-medium text-zinc-900 mb-2">
//                                     No Products Found
//                                 </h3>
//                                 <p className="text-sm text-zinc-500 tracking-wide max-w-xs text-center">
//                                     Your search criteria did not match any items
//                                     in our current collection.
//                                 </p>
//                             </div>
//                         ) : (
//                             <div className="space-y-32">
//                                 <section>
//                                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-6 lg:gap-y-6">
//                                         {products.map((product) => (
//                                             <ProductCard
//                                                 key={product._id}
//                                                 product={product}
//                                             />
//                                         ))}
//                                     </div>

//                                     <div className="mt-32 flex justify-center">
//                                         <Pagination
//                                             currentPage={page}
//                                             totalPages={totalPages}
//                                             onPageChange={setPage}
//                                             limit={limit}
//                                             setLimit={setLimit}
//                                         />
//                                     </div>
//                                 </section>
//                             </div>
//                         )}
//                     </main>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const FilterChip = ({ label, onRemove }) => (
//     <span className="flex items-center gap-2 bg-zinc-900 text-white pl-4 pr-2 py-2 text-sm uppercase tracking-widest transition-all hover:bg-zinc-800">
//         {label}
//         <button
//             onClick={onRemove}
//             className="p-1 hover:bg-white/10 transition-colors"
//         >
//             <X size={12} />
//         </button>
//     </span>
// );

// export default ProductListPage;

import { useState, useEffect, useRef } from "react";
import {
    X,
    PackageSearch,
    Loader2,
    Leaf,
    SlidersHorizontal,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import ProductCard from "../Components/ProductCard.jsx";
import { useProducts } from "../features/products/product.queries";
import Pagination from "../Components/Pagination.jsx";
import Breadcrumb from "../Components/Breadcrumb.jsx";

/* ─── Variants ─── */
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (d = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: d },
    }),
};

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const cardAnim = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
};

/* ─── Component ─── */
const ProductListPage = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search");
    const collectionQuery = searchParams.get("collection");
    const promotionQuery = searchParams.get("promotionId");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, isLoading } = useProducts({
        page,
        limit,
        ...(searchQuery ? { search: searchQuery } : {}),
        ...(collectionQuery ? { collection: collectionQuery } : {}),
        ...(promotionQuery ? { promotionId: promotionQuery } : {}),
    });

    const products = data?.products || [];
    const totalPages = data?.totalPages || 1;

    const headingRef = useRef(null);
    const isInView = useInView(headingRef, { once: true, margin: "-60px" });

    /* ── Loading ── */
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdfdfb]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.4,
                        ease: "linear",
                    }}
                >
                    <Loader2
                        className="text-[#7aaf68]"
                        size={22}
                        strokeWidth={1.5}
                    />
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-[10px] uppercase tracking-[0.35em] text-stone-400"
                >
                    Curating your ritual…
                </motion.p>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Products" },
    ];

    return (
        <div className="bg-[#fdfdfb] min-h-screen">
            {/* ── Hero Banner ── */}
            {/* ── Hero Banner ── */}
            <div className="relative w-full bg-[#f4f8f2] border-b border-[#e8f0e4] overflow-hidden">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#d6eacc] opacity-40 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-8 w-48 h-48 rounded-full bg-[#e8f4e0] opacity-50 blur-2xl pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-14 md:py-16 flex flex-col items-center text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-3"
                    >
                        <Leaf size={10} /> Premium Collection
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        className="text-2xl md:text-3xl font-light tracking-[0.25em] uppercase text-[#1a2e1a] mb-3"
                    >
                        Health & Beauty Essentials
                    </motion.h1>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                            duration: 0.55,
                            ease: "easeOut",
                            delay: 0.2,
                        }}
                        className="w-10 h-px bg-[#b5d4a6] mb-3 origin-center"
                    />

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs text-stone-400 tracking-widest"
                    >
                        Discover skincare, wellness, and beauty products crafted
                        for your daily routine
                    </motion.p>
                </div>
            </div>
            {/* ── Main Content ── */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
                {/* Breadcrumb */}
                <motion.div
                    custom={0}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="mb-10"
                >
                    <Breadcrumb items={breadcrumbItems} />
                </motion.div>

                {/* ── Empty State ── */}
                {products?.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="py-32 flex flex-col items-center justify-center border border-dashed border-[#dcebd5] rounded-2xl bg-[#f8faf7]"
                    >
                        <div className="w-16 h-16 rounded-full bg-[#eef6ea] flex items-center justify-center mb-6">
                            <PackageSearch
                                size={22}
                                strokeWidth={1}
                                className="text-[#b5d4a6]"
                            />
                        </div>
                        <h3 className="text-sm uppercase tracking-[0.25em] font-medium text-[#1a2e1a] mb-2">
                            No Products Found
                        </h3>
                        <p className="text-xs text-stone-400 tracking-wide max-w-xs text-center leading-relaxed">
                            Your search criteria did not match any items in our
                            current collection.
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-16">
                        {/* Product Grid */}
                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8"
                        >
                            {products.map((product) => (
                                <motion.div
                                    key={product._id}
                                    variants={cardAnim}
                                    whileHover={{
                                        y: -4,
                                        transition: { duration: 0.25 },
                                    }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Pagination */}
                        <motion.div
                            custom={0.2}
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            className="flex justify-center pt-4 border-t border-[#eef3eb]"
                        >
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                                limit={limit}
                                setLimit={setLimit}
                            />
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

const FilterChip = ({ label, onRemove }) => (
    <span className="flex items-center gap-2 bg-[#1a2e1a] text-white pl-4 pr-2 py-2 text-[10px] uppercase tracking-widest transition-all hover:bg-[#2e4a2e]">
        {label}
        <button
            onClick={onRemove}
            className="p-1 hover:bg-white/10 transition-colors"
        >
            <X size={11} />
        </button>
    </span>
);

export default ProductListPage;

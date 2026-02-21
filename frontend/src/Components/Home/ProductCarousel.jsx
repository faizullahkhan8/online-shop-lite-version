import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../ProductCard";
import { motion, useInView } from "framer-motion";





const ProductCarousel = ({ products, title, isViewAll }) => {
    const scrollRef = useRef(null);
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

    const fadeUp = {
        hidden: { opacity: 0, y: 32 },
        visible: (delay = 0) => ({
            opacity: 1, y: 0,
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay },
        }),
    };
    const lineVariant = {
        hidden: { scaleX: 0 },
        visible: { scaleX: 1, transition: { duration: 0.6, ease: "easeOut", delay: 0.3 } },
    };
    const staggerContainer = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.2, delayChildren: 0.35 } },
    };
    const cardVariant = {
        hidden: { opacity: 0, y: 24, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    }








    const scroll = (dir) => {
        const el = scrollRef.current;
        if (!el) return;
        const cardW = el.querySelector(".snap-start")?.offsetWidth ?? 0;
        el.scrollBy({ left: dir * cardW, behavior: "smooth" });
    };

    return (
        // <section className="py-10 relative">
        //     {/* Heading */}
        //     <div className="flex flex-col items-center mb-12 px-4">
        //         <h2 className="text-md font-semibold tracking-[0.3em] uppercase text-zinc-900 mb-1">
        //             {title}
        //         </h2>
        //         {isViewAll && (
        //             <Link
        //                 to="/products"
        //                 className="text-xs tracking-[0.2em] uppercase text-zinc-500 border-b border-zinc-200 pb-0.5 hover:text-zinc-800 hover:border-zinc-800 transition-all"
        //             >
        //                 View All
        //             </Link>
        //         )}
        //     </div>

        //     {/* Carousel wrapper */}
        //     <div className="relative">
        //         {/* Left chevron */}
        //         <button
        //             onClick={() => scroll(-1)}
        //             aria-label="Scroll left"
        //             className="absolute left-1 md:left-3 top-1/3 -translate-y-1/2 z-10
        //                        w-8 h-8 md:w-10 md:h-10 flex items-center justify-center
        //                        bg-white/90 backdrop-blur-sm border border-zinc-200
        //                        rounded-full shadow-md hover:bg-zinc-900 hover:text-white
        //                        hover:border-zinc-900 transition-all duration-200 active:scale-95"
        //         >
        //             <ChevronLeft size={18} />
        //         </button>

        //         {/* Track */}
        //         <div
        //             ref={scrollRef}
        //             className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar
        //                        px-[calc(50%-40vw)]
        //                        sm:px-[calc(50%-30vw)]
        //                        md:px-12
        //                        gap-3 md:gap-4"
        //         >
        //             {products.map((product) => (
        //                 <div
        //                     key={product.id}
        //                     className="snap-center shrink-0
        //                                w-[80vw]
        //                                sm:w-[60vw]
        //                                md:w-[calc(33.333%-1rem)]
        //                                lg:w-[calc(20%-1rem)]"
        //                 >
        //                     <ProductCard product={product} />
        //                 </div>
        //             ))}
        //         </div>

        //         {/* Right chevron */}
        //         <button
        //             onClick={() => scroll(1)}
        //             aria-label="Scroll right"
        //             className="absolute right-1 md:right-3 top-1/3 -translate-y-1/2 z-10
        //                        w-8 h-8 md:w-10 md:h-10 flex items-center justify-center
        //                        bg-white/90 backdrop-blur-sm border border-zinc-200
        //                        rounded-full shadow-md hover:bg-zinc-900 hover:text-white
        //                        hover:border-zinc-900 transition-all duration-200 active:scale-95"
        //         >
        //             <ChevronRight size={18} />
        //         </button>
        //     </div>

        //     <style
        //         dangerouslySetInnerHTML={{
        //             __html: `
        //                 .no-scrollbar::-webkit-scrollbar { display: none; }
        //                 .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        //             `,
        //         }}
        //     />
        // </section>

        //         <section className="py-20 px-4 bg-white">
        //     {/* Section Heading */}
        //     <div className="max-w-7xl mx-auto mb-14 flex flex-col items-center text-center">
        //         <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-sans mb-3">
        //             Our Collection
        //         </p>
        //         <h2 className="text-sm font-medium tracking-[0.3em] uppercase text-gray-900 font-sans mb-4">
        //             {title}
        //         </h2>
        //         <div className="w-8 h-[1px] bg-gray-200 mb-4" />
        //         {isViewAll && (
        //             <Link
        //                 to="/products"
        //                 className="text-[10px] tracking-[0.25em] uppercase text-gray-400 border-b border-gray-200 pb-0.5 hover:text-gray-900 hover:border-gray-900 transition-all duration-300 font-sans"
        //             >
        //                 View All
        //             </Link>
        //         )}
        //     </div>

        //     {/* Carousel Wrapper */}
        //     <div className="relative max-w-7xl mx-auto">
        //         {/* Left Chevron */}
        //         <button
        //             onClick={() => scroll(-1)}
        //             aria-label="Scroll left"
        //             className="absolute -left-4 md:-left-6 top-1/3 -translate-y-1/2 z-10
        //                        w-9 h-9 flex items-center justify-center
        //                        bg-white border border-gray-100 rounded-full
        //                        shadow-sm hover:bg-gray-900 hover:text-white hover:border-gray-900
        //                        transition-all duration-300 ease-out active:scale-95 text-gray-400"
        //         >
        //             <ChevronLeft size={15} />
        //         </button>

        //         {/* Track */}
        //         <div
        //             ref={scrollRef}
        //             className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar
        //                        px-[calc(50%-40vw)]
        //                        sm:px-[calc(50%-30vw)]
        //                        md:px-4
        //                        gap-4 md:gap-5"
        //         >
        //             {products.map((product) => (
        //                 <div
        //                     key={product.id}
        //                     className="snap-center shrink-0
        //                                w-[80vw]
        //                                sm:w-[60vw]
        //                                md:w-[calc(33.333%-1.25rem)]
        //                                lg:w-[calc(25%-1.25rem)]"
        //                 >
        //                     <ProductCard product={product} />
        //                 </div>
        //             ))}
        //         </div>

        //         {/* Right Chevron */}
        //         <button
        //             onClick={() => scroll(1)}
        //             aria-label="Scroll right"
        //             className="absolute -right-4 md:-right-6 top-1/3 -translate-y-1/2 z-10
        //                        w-9 h-9 flex items-center justify-center
        //                        bg-white border border-gray-100 rounded-full
        //                        shadow-sm hover:bg-gray-900 hover:text-white hover:border-gray-900
        //                        transition-all duration-300 ease-out active:scale-95 text-gray-400"
        //         >
        //             <ChevronRight size={15} />
        //         </button>
        //     </div>

        //     <style
        //         dangerouslySetInnerHTML={{
        //             __html: `
        //                 .no-scrollbar::-webkit-scrollbar { display: none; }
        //                 .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        //             `,
        //         }}
        //     />
        // </section>



        <section ref={sectionRef} className="py-20 px-4 bg-white">

            {/* Section Heading */}
            <div className="max-w-7xl mx-auto mb-14 flex flex-col items-center text-center">

                <motion.p
                    custom={0}
                    variants={fadeUp}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-sans mb-3"
                >
                    Our Collection
                </motion.p>

                <motion.h2
                    custom={0.1}
                    variants={fadeUp}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-sm font-medium tracking-[0.3em] uppercase text-gray-900 font-sans mb-4"
                >
                    {title}
                </motion.h2>

                <motion.div
                    variants={lineVariant}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="w-8 h-[1px] bg-gray-200 mb-4 origin-center"
                />

                {isViewAll && (
                    <motion.div
                        custom={0.25}
                        variants={fadeUp}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                    >
                        <Link
                            to="/products"
                            className="text-[10px] tracking-[0.25em] uppercase text-gray-400 border-b border-gray-200 pb-0.5 hover:text-gray-900 hover:border-gray-900 transition-all duration-300 font-sans"
                        >
                            View All
                        </Link>
                    </motion.div>
                )}
            </div>

            {/* Carousel Wrapper */}
            <motion.div
                custom={0.2}
                variants={fadeUp}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="relative max-w-7xl mx-auto"
            >
                {/* Left Chevron */}
                <motion.button
                    onClick={() => scroll(-1)}
                    aria-label="Scroll left"
                    whileHover={{ scale: 1.08, backgroundColor: "#111827", color: "#ffffff", borderColor: "#111827" }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -left-4 md:-left-6 top-1/3 -translate-y-1/2 z-10
                       w-9 h-9 flex items-center justify-center
                       bg-white border border-gray-100 rounded-full
                       shadow-sm text-gray-400"
                >
                    <ChevronLeft size={15} />
                </motion.button>

                {/* Track */}
                <motion.div
                    ref={scrollRef}
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar
                       px-[calc(50%-40vw)]
                       sm:px-[calc(50%-30vw)]
                       md:px-4
                       gap-4 md:gap-5"
                >
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            variants={cardVariant}
                            whileHover={{ y: -4, transition: { duration: 0.3, ease: "easeOut" } }}
                            className="snap-center shrink-0
                               w-[80vw]
                               sm:w-[60vw]
                               md:w-[calc(33.333%-1.25rem)]
                               lg:w-[calc(25%-1.25rem)]"
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Right Chevron */}
                <motion.button
                    onClick={() => scroll(1)}
                    aria-label="Scroll right"
                    whileHover={{ scale: 1.08, backgroundColor: "#111827", color: "#ffffff", borderColor: "#111827" }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -right-4 md:-right-6 top-1/3 -translate-y-1/2 z-10
                       w-9 h-9 flex items-center justify-center
                       bg-white border border-gray-100 rounded-full
                       shadow-sm text-gray-400"
                >
                    <ChevronRight size={15} />
                </motion.button>
            </motion.div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `,
                }}
            />
        </section>
    );
};

export default ProductCarousel;
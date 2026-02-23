/* eslint-disable no-unused-vars */
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
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay },
        }),
    };
    const staggerContainer = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.2, delayChildren: 0.35 } },
    };
    const cardVariant = {
        hidden: { opacity: 0, y: 24, scale: 0.97 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
    };

    const scroll = (dir) => {
        const el = scrollRef.current;
        if (!el) return;
        const cardW = el.querySelector(".snap-start")?.offsetWidth ?? 0;
        el.scrollBy({ left: dir * cardW, behavior: "smooth" });
    };

    return (
        <section ref={sectionRef} className="py-20 px-4 bg-white">
            {/* Section Heading */}
            <div className="max-w-7xl mx-auto mb-14 flex flex-col items-center text-center">
                {/* Eyebrow — ruled lines flanking the label */}
                <motion.div
                    custom={0}
                    variants={fadeUp}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="flex items-center gap-3 mb-4"
                >
                    <span className="block w-10 h-px bg-gray-200" />
                    <span className="text-[9px] uppercase tracking-[0.45em] text-gray-400 font-sans">
                        Our Collection
                    </span>
                    <span className="block w-10 h-px bg-gray-200" />
                </motion.div>

                {/* Main title — larger, lighter weight */}
                <motion.h2
                    custom={0.12}
                    variants={fadeUp}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-2xl sm:text-3xl font-light tracking-[0.2em] uppercase text-gray-900 font-sans mb-5"
                >
                    {title}
                </motion.h2>

                {isViewAll && (
                    <motion.div
                        custom={0.25}
                        variants={fadeUp}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                    >
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gray-400 hover:text-gray-900 transition-colors duration-300 font-sans group"
                        >
                            <span className="block w-4 h-px bg-current transition-all duration-300 group-hover:w-6" />
                            View All
                            <span className="block w-4 h-px bg-current transition-all duration-300 group-hover:w-6" />
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
                    whileHover={{
                        scale: 1.08,
                        backgroundColor: "#111827",
                        color: "#ffffff",
                        borderColor: "#111827",
                    }}
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
                    whileHover={{
                        scale: 1.08,
                        backgroundColor: "#111827",
                        color: "#ffffff",
                        borderColor: "#111827",
                    }}
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

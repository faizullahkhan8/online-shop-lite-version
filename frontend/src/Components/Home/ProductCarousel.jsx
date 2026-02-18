import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../ProductCard";

const ProductCarousel = ({ products, title, isViewAll }) => {
    const scrollRef = useRef(null);

    const scroll = (dir) => {
        const el = scrollRef.current;
        if (!el) return;
        const cardW = el.querySelector(".snap-start")?.offsetWidth ?? 0;
        el.scrollBy({ left: dir * cardW, behavior: "smooth" });
    };

    return (
        <section className="py-10 relative">
            {/* Heading */}
            <div className="flex flex-col items-center mb-12 px-4">
                <h2 className="text-md font-semibold tracking-[0.3em] uppercase text-zinc-900 mb-1">
                    {title}
                </h2>
                {isViewAll && (
                    <Link
                        to="/products"
                        className="text-xs tracking-[0.2em] uppercase text-zinc-500 border-b border-zinc-200 pb-0.5 hover:text-zinc-800 hover:border-zinc-800 transition-all"
                    >
                        View All
                    </Link>
                )}
            </div>

            {/* Carousel wrapper */}
            <div className="relative">
                {/* Left chevron */}
                <button
                    onClick={() => scroll(-1)}
                    aria-label="Scroll left"
                    className="absolute left-1 md:left-3 top-1/3 -translate-y-1/2 z-10
                               w-8 h-8 md:w-10 md:h-10 flex items-center justify-center
                               bg-white/90 backdrop-blur-sm border border-zinc-200
                               rounded-full shadow-md hover:bg-zinc-900 hover:text-white
                               hover:border-zinc-900 transition-all duration-200 active:scale-95"
                >
                    <ChevronLeft size={18} />
                </button>

                {/* Track */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar
                               px-[calc(50%-40vw)]
                               sm:px-[calc(50%-30vw)]
                               md:px-12
                               gap-3 md:gap-4"
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="snap-center shrink-0
                                       w-[80vw]
                                       sm:w-[60vw]
                                       md:w-[calc(33.333%-1rem)]
                                       lg:w-[calc(20%-1rem)]"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Right chevron */}
                <button
                    onClick={() => scroll(1)}
                    aria-label="Scroll right"
                    className="absolute right-1 md:right-3 top-1/3 -translate-y-1/2 z-10
                               w-8 h-8 md:w-10 md:h-10 flex items-center justify-center
                               bg-white/90 backdrop-blur-sm border border-zinc-200
                               rounded-full shadow-md hover:bg-zinc-900 hover:text-white
                               hover:border-zinc-900 transition-all duration-200 active:scale-95"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

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
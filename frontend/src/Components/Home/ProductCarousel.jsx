import { useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";

const ProductCarousel = ({ products, title, isViewAll }) => {
    const scrollRef = useRef(null);

    return (
        <section className="py-10 relative">
            <div className="flex flex-col items-center mb-12 px-4">
                <h2 className="text-md font-semibold tracking-[0.3em] uppercase text-zinc-900 mb-1">
                    {title}
                </h2>

                {isViewAll && (
                    <Link
                        to="/products"
                        className="text-xs tracking-[0.2em] uppercase text-zinc-400 border-b border-zinc-200 pb-0.5 hover:text-zinc-800 hover:border-zinc-800 transition-all"
                    >
                        View All
                    </Link>
                )}
            </div>

            <div className="relative px-4 md:px-12">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 no-scrollbar"
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="snap-start shrink-0 
                                       w-full 
                                       sm:w-1/2 
                                       md:w-1/2 
                                       lg:w-1/5"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                        .no-scrollbar {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `,
                }}
            />
        </section>
    );
};

export default ProductCarousel;

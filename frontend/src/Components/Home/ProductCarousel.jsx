import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';


const ProductCarousel = ({ products, title, isViewAll }) => {
    const scrollRef = useRef(null);

    return (
        <section className="py-10 relative group/section">
            <div className="flex flex-col items-center mb-12 px-4">
                <h2 className="text-md font-semibold tracking-[0.3em] uppercase text-zinc-900 mb-1">
                    {title}
                </h2>
                {isViewAll && <Link to="/products" className="text-xs tracking-[0.2em] uppercase text-zinc-400 border-b border-zinc-200 pb-0.5 hover:text-zinc-800 hover:border-zinc-800 transition-all">
                    View All
                </Link>}
            </div>

            <div className="relative px-4 md:px-12">

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth gap-x-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
        </section>
    );
};

export default ProductCarousel;
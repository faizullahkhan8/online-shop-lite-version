import ProductCard from "../ProductCard";

const RecommendedItems = ({ items }) => {
    return (
        <div className="container mx-auto px-4 lg:px-8 mb-16">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                        Recommended <span className="text-primary">Items</span>
                    </h2>
                    <div className="h-1 w-12 bg-primary mt-2 rounded-full" />
                </div>

                <button className="hidden sm:block text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                    View All
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
                {items?.map((product, index) => (
                    <div
                        key={index}
                        className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            <div className="mt-10 sm:hidden">
                <button className="w-full py-4 bg-slate-100 text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl">
                    View All Items
                </button>
            </div>
        </div>
    );
};

export default RecommendedItems;

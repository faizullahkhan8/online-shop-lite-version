import { useState, useEffect } from "react";
import {
    X,
    SlidersHorizontal,
    PackageSearch,
    Loader2,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../Components/ProductCard.jsx";
import { useGetAllProducts } from "../api/hooks/product.api";
import ProductCarousel from "../Components/Home/ProductCarousel.jsx";
import Button from "../UI/Button.jsx";

const ProductListPage = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const { getAllProducts, loading: productLoading } = useGetAllProducts();
    const searchQuery = searchParams.get("search");
    const collectionQuery = searchParams.get("collection");

    useEffect(() => {
        (async () => {
            const response = await getAllProducts({
                search: searchQuery,
                collection: collectionQuery,
            });
            if (response?.success) {
                setProducts(response.products);
            }
        })();
    }, [searchQuery, collectionQuery, getAllProducts]);

    const displayProducts = products;

    return (
        <div className="bg-white min-h-screen">
            <div className="container px-4 lg:px-12 py-12 lg:py-20">


                <div className="flex flex-col gap-12">
                    <main className="w-full">
                        {productLoading ? (
                            <div className="flex flex-col items-center justify-center py-40">
                                <Loader2
                                    className="animate-spin text-zinc-900 mb-4"
                                    size={24}
                                    strokeWidth={1}
                                />
                                <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
                                    Synchronizing...
                                </p>
                            </div>
                        ) : products?.length === 0 ? (
                            <div className="py-32 px-6 flex flex-col items-center justify-center border border-dashed border-zinc-200">
                                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                                    <PackageSearch
                                        size={24}
                                        strokeWidth={1}
                                        className="text-zinc-300"
                                    />
                                </div>
                                <h3 className="text-md uppercase tracking-[0.2em] font-medium text-zinc-900 mb-2">
                                    No Artifacts Found
                                </h3>
                                <p className="text-sm text-zinc-400 tracking-wide max-w-xs text-center">
                                    Your search criteria did not match any items in our current collection.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-32">
                                <section>
                                    <div className="flex justify-between items-end mb-12 border-b border-zinc-100 pb-6">
                                        <div>
                                            <Button variant="outline" className="text-md font-semibold tracking-[0.3em] uppercase text-zinc-900">
                                                Filters
                                            </Button>
                                        </div>

                                        <button className="flex items-center gap-2 text-xs tracking-widest uppercase font-medium hover:text-zinc-500 transition-colors py-2">
                                            <SlidersHorizontal size={14} strokeWidth={1.5} />
                                            Refine
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-6 lg:gap-y-6">
                                        {displayProducts.map((product) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </div>

                                    <div className="mt-32 flex justify-center">
                                        <Button variant="studio" size="lg">
                                            View More
                                        </Button>
                                    </div>
                                </section>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

const FilterChip = ({ label, onRemove }) => (
    <span className="flex items-center gap-2 bg-zinc-900 text-white pl-4 pr-2 py-2 text-sm uppercase tracking-widest transition-all hover:bg-zinc-800">
        {label}
        <button
            onClick={onRemove}
            className="p-1 hover:bg-white/10 transition-colors"
        >
            <X size={12} />
        </button>
    </span>
);

export default ProductListPage;

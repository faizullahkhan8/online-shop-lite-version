import { useState, useEffect } from "react";
import { X, PackageSearch, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../Components/ProductCard.jsx";
import { useProducts } from "../features/products/product.queries";
import Pagination from "../Components/Pagination.jsx";
import Breadcrumb from "../Components/Breadcrumb.jsx";

const ProductListPage = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search");
    const collectionQuery = searchParams.get("collection");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, isLoading } = useProducts({
        search: searchQuery,
        collection: collectionQuery,
        page,
        limit,
    });

    const products = data?.products || [];
    const totalPages = data?.totalPages || 1;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2
                    className="animate-spin text-zinc-900 mb-4"
                    size={24}
                    strokeWidth={1}
                />
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                    Synchronizing...
                </p>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Products" },
    ];

    const displayProducts = products;

    return (
        <div className="bg-white min-h-screen">
            <div className="container px-4 lg:px-12 py-12">
                <Breadcrumb items={breadcrumbItems} />

                <div className="flex flex-col gap-12">
                    <main className="w-full">
                        {products?.length === 0 ? (
                            <div className="py-32 px-6 flex flex-col items-center justify-center border border-dashed border-zinc-200">
                                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                                    <PackageSearch
                                        size={24}
                                        strokeWidth={1}
                                        className="text-zinc-300"
                                    />
                                </div>
                                <h3 className="text-md uppercase tracking-[0.2em] font-medium text-zinc-900 mb-2">
                                    No Products Found
                                </h3>
                                <p className="text-sm text-zinc-500 tracking-wide max-w-xs text-center">
                                    Your search criteria did not match any items
                                    in our current collection.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-32">
                                <section>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-6 lg:gap-y-6">
                                        {products.map((product) => (
                                            <ProductCard
                                                key={product._id}
                                                product={product}
                                            />
                                        ))}
                                    </div>

                                    <div className="mt-32 flex justify-center">
                                        <Pagination
                                            currentPage={page}
                                            totalPages={totalPages}
                                            onPageChange={setPage}
                                            limit={limit}
                                            setLimit={setLimit}
                                        />
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

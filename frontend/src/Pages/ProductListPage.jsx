import { useState, useEffect, useMemo } from "react";
import {
    LayoutGrid,
    List,
    X,
    SlidersHorizontal,
    PackageSearch,
    Loader2,
    Search,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../Components/ProductCard.jsx";
import ProductListItem from "../Components/ProductListItem";
import Pagination from "../Components/Pagination";
import { useGetAllProducts } from "../api/hooks/product.api";

const ProductListPage = () => {
    const [viewMode, setViewMode] = useState("grid");
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const { getAllProducts, loading: productLoading } = useGetAllProducts();

    const page = parseInt(searchParams.get("page") || "1");
    const searchQuery = searchParams.get("search");

    const handlePageChange = (newPage) => {
        setSearchParams((prev) => {
            prev.set("page", newPage);
            return prev;
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        (async () => {
            const response = await getAllProducts({ 
                page, 
                search: searchQuery 
            });
            if (response?.success) {
                setProducts(response.products);
                setTotalPages(response.totalPages || 1);
            }
        })();
    }, [page, searchQuery]);

    // Searching is now handled on the server side
    const displayProducts = products;

    return (
        <div className="bg-slate-50/50 min-h-screen">
            <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <SlidersHorizontal
                                    className="text-primary"
                                    size={18}
                                />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    Premium Collection
                                </span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                                Shop{" "}
                                <span className="text-primary">
                                    All Products
                                </span>
                            </h1>
                        </div>
                        <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                            {products?.length || 0} Products Found
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    <main className="flex-1 w-full">
                        <div className="bg-white border border-slate-100 rounded-4xl p-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
                            <div className="w-full flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-4xl border border-slate-200">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="px-4 py-2 text-md w-full outline-none bg-transparent"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSearchParams((prev) => {
                                            if (val) prev.set("search", val);
                                            else prev.delete("search");
                                            prev.set("page", 1); // Reset to first page on search
                                            return prev;
                                        });
                                    }}
                                />
                                <Search />
                            </div>

                            <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
                                <ViewButton
                                    active={viewMode === "grid"}
                                    onClick={() => setViewMode("grid")}
                                    icon={<LayoutGrid size={18} />}
                                />
                                <ViewButton
                                    active={viewMode === "list"}
                                    onClick={() => setViewMode("list")}
                                    icon={<List size={18} />}
                                />
                            </div>
                        </div>

                        {productLoading ? (
                            <div className="flex flex-col items-center justify-center py-32 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/50">
                                <Loader2
                                    className="animate-spin text-primary mb-4"
                                    size={40}
                                />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                                    Fetching Catalog...
                                </p>
                            </div>
                        ) : products?.length === 0 ? (
                            <div className="bg-white border border-slate-100 rounded-[3rem] py-24 px-6 flex flex-col items-center justify-center shadow-xl shadow-slate-200/50">
                                <div className="w-20 h-20 bg-slate-50 rounded-4xl flex items-center justify-center mb-6">
                                    <PackageSearch
                                        size={32}
                                        className="text-slate-300"
                                    />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                                    No results found
                                </h3>
                                <p className="text-slate-400 text-sm mb-8 max-w-xs text-center font-medium">
                                    We couldn't find any products matching your
                                    current selection. Try adjusting your
                                    filters.
                                </p>
                            </div>
                        ) : (
                            <div
                                className={
                                    viewMode === "grid"
                                        ? "grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-6 gap-4"
                                        : "flex flex-col gap-6"
                                }
                            >
                                {displayProducts?.map((product) =>
                                    viewMode === "grid" ? (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                        />
                                    ) : (
                                        <ProductListItem
                                            key={product._id}
                                            product={product}
                                        />
                                    ),
                                )}
                            </div>
                        )}

                        <div className="mt-16 flex justify-center">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

const FilterChip = ({ label, onRemove }) => (
    <span className="flex items-center gap-2 bg-slate-900 text-white pl-4 pr-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-slate-900/10 transition-all hover:bg-primary group">
        {label}
        <button
            onClick={onRemove}
            className="bg-white/10 p-1 rounded-md group-hover:bg-white/20 transition-colors"
        >
            <X size={12} />
        </button>
    </span>
);

const ViewButton = ({ active, onClick, icon }) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-lg transition-all ${active ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
    >
        {icon}
    </button>
);

export default ProductListPage;

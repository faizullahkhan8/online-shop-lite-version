import { useState, useEffect } from "react";
import { LayoutGrid, List, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import SidebarFilter from "../Components/SidebarFilter";
import ProductCard from "../Components/ProductCard";
import ProductListItem from "../Components/ProductListItem";
import Pagination from "../Components/Pagination";
import Breadcrumb from "../Components/Breadcrumb";
import { useGetAllProducts } from "../api/hooks/product.api";

const ProductListPage = () => {
    const [viewMode, setViewMode] = useState("grid");
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    // const [pagination, setPagination] = useState(null);

    const { getAllProducts, loading: productLoading } = useGetAllProducts();

    // Initial Filter State
    const [filters, setFilters] = useState({
        category: searchParams.get("category") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        brands: [],
        features: [],
        rating: null,
        condition: "",
    });

    // Pagination state
    const page = parseInt(searchParams.get("page") || "1");
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        (async () => {
            // Build query params for API
            const params = {
                page,
                limit: 9,
                ...filters,
                brands: filters.brands.join(","),
                features: filters.features.join(","),
            };
            const response = await getAllProducts(params);
            if (response.success) {
                setProducts(response.products);
                setTotalPages(response.totalPages || 1);
            }
        })();
    }, [page, filters]);

    // //
    // useEffect(() => {
    //     const category = searchParams.get("category");
    //     if (category) {
    //         setFilters((prev) => ({ ...prev, category }));
    //     }
    // }, [searchParams]);

    // const page = parseInt(searchParams.get("page") || "1");
    // const search = searchParams.get("search") || "";

    // useEffect(() => {
    //     const params = {
    //         page,
    //         search,
    //         limit: 9,
    //         ...filters,
    //         brands: filters.brands.join(","),
    //         features: filters.features.join(","),
    //     };
    // }, [page, search, filters]);

    const handleFilterChange = (newFilters) => {
        setFilters((prev) => {
            const updated = { ...prev, ...newFilters };
            setSearchParams((prevParams) => {
                prevParams.set("page", "1");
                Object.keys(newFilters).forEach((key) => {
                    if (
                        Array.isArray(newFilters[key]) &&
                        newFilters[key].length === 0
                    ) {
                        prevParams.delete(key);
                    } else if (
                        newFilters[key] === "" ||
                        newFilters[key] == null
                    ) {
                        prevParams.delete(key);
                    } else {
                        prevParams.set(key, newFilters[key]);
                    }
                });
                return prevParams;
            });
            return updated;
        });
    };

    const clearAllFilters = () => {
        setFilters({
            category: "",
            minPrice: "",
            maxPrice: "",
            brands: [],
            features: [],
            rating: null,
            condition: "",
        });
        setSearchParams((prev) => {
            [
                "category",
                "minPrice",
                "maxPrice",
                "brands",
                "features",
                "rating",
                "condition",
                "page",
            ].forEach((key) => prev.delete(key));
            return prev;
        });
    };

    const handlePageChange = (newPage) => {
        setSearchParams((prev) => {
            prev.set("page", newPage);
            return prev;
        });
        window.scrollTo(0, 0);
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Products", path: "/products" },
        ...(filters.category ? [{ label: filters.category }] : []),
    ];

    const removeFilter = (key, value = null) => {
        if (Array.isArray(filters[key])) {
            handleFilterChange({
                [key]: filters[key].filter((item) => item !== value),
            });
        } else {
            handleFilterChange({ [key]: "" });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            {/* Breadcrumbs */}
            <Breadcrumb items={breadcrumbItems} />

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <SidebarFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                <div className="flex-1">
                    {/* Top Bar */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3 px-4 mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm">
                            {products?.length || 0} items{" "}
                            <span className="font-bold">found</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex border border-gray-300 rounded overflow-hidden">
                                <button
                                    className={`p-1.5 ${
                                        viewMode === "list"
                                            ? "bg-gray-200 text-black"
                                            : "bg-white text-gray-500"
                                    }`}
                                    onClick={() => setViewMode("grid")}
                                >
                                    <LayoutGrid size={20} />
                                </button>
                                <button
                                    className={`p-1.5 ${
                                        viewMode === "list"
                                            ? "bg-white text-gray-500"
                                            : "bg-gray-200 text-black"
                                    }`}
                                    onClick={() => setViewMode("list")}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters (Chips) */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 flex-wrap">
                        {filters.category && (
                            <span className="flex items-center gap-1 bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                                {filters.category}{" "}
                                <X
                                    size={14}
                                    className="cursor-pointer"
                                    onClick={() => removeFilter("category")}
                                />
                            </span>
                        )}
                        {filters.brands.map((brand) => (
                            <span
                                key={brand}
                                className="flex items-center gap-1 bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm"
                            >
                                {brand}{" "}
                                <X
                                    size={14}
                                    className="cursor-pointer"
                                    onClick={() =>
                                        removeFilter("brands", brand)
                                    }
                                />
                            </span>
                        ))}
                        {filters.maxPrice && (
                            <span className="flex items-center gap-1 bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                                Price: {filters.minPrice || 0}-
                                {filters.maxPrice}{" "}
                                <X
                                    size={14}
                                    className="cursor-pointer"
                                    onClick={() => removeFilter("maxPrice")}
                                />
                            </span>
                        )}

                        {(filters.category ||
                            filters.brands.length > 0 ||
                            filters.maxPrice ||
                            filters.rating ||
                            filters.condition) && (
                            <button
                                onClick={clearAllFilters}
                                className="text-primary text-sm font-medium hover:underline ml-2"
                            >
                                Clear all filter
                            </button>
                        )}
                    </div>

                    {/* Product Grid/List */}
                    {productLoading ? (
                        <div className="text-center py-20">
                            Loading products...
                        </div>
                    ) : (
                        <div
                            className={
                                viewMode === "grid"
                                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                    : "flex flex-col gap-4"
                            }
                        >
                            {products?.map((product) =>
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
                                )
                            )}
                        </div>
                    )}

                    {!productLoading && products?.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">
                                No products found matching your filters.
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="text-primary mt-2 hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;

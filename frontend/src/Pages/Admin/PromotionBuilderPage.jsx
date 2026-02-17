import { useState, useEffect, useCallback } from "react";
import {
    Zap,
    Settings,
    Package,
    Search,
    Plus,
    Trash2,
    Save,
    Loader2,
    Percent,
    Calendar,
} from "lucide-react";
import { useGetAllProducts } from "../../api/hooks/product.api";
import { useAddPromotion, useUpdatePromotion, useGetPromotionById } from "../../api/hooks/promotion.api";
import { useNavigate, useSearchParams } from "react-router-dom";

import Input from "../../UI/Input";
import Select from "../../UI/Select";

const PromotionBuilder = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("id");

    const { getAllProducts } = useGetAllProducts();
    const { addPromotion, loading: addLoading } = useAddPromotion();
    const { updatePromotion, loading: updateLoading } = useUpdatePromotion();
    const { getPromotionById, loading: fetchLoading } = useGetPromotionById();

    const loading = addLoading || updateLoading || (editId && fetchLoading);

    const [promotionData, setPromotionData] = useState({
        title: "",
        type: "FLASH_DEAL",
        discountType: "PERCENTAGE",
        discountValue: 0,
        startTime: "",
        endTime: "",
    });

    const [productSearch, setProductSearch] = useState("");
    const [availableProducts, setAvailableProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [noProductFound, setNoProductFound] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [errors, setErrors] = useState({});

    // Fetch existing promotion if editing
    useEffect(() => {
        if (editId) {
            const loadPromotion = async () => {
                const data = await getPromotionById(editId);
                if (data && data.promotion) {
                    const p = data.promotion;
                    setPromotionData({
                        title: p.title,
                        type: p.type,
                        discountType: p.discountType,
                        discountValue: p.discountValue,
                        startTime: new Date(p.startTime).toISOString().slice(0, 16),
                        endTime: new Date(p.endTime).toISOString().slice(0, 16),
                    });
                    setSelectedProducts(p.products);
                }
            };
            loadPromotion();
        }
    }, [editId, getPromotionById]);

    // Fetch products based on search or page changes
    const fetchProducts = useCallback(async () => {
        setIsSearching(true);
        setNoProductFound(false);
        try {
            const response = await getAllProducts({
                search: productSearch,
                page: page,
                limit: 12,
                excludeActivePromotions: true,
                currentPromotionId: editId,
            });
            if (response?.success) {
                setAvailableProducts(response.products);
                setTotalPages(response.totalPages);
                if (response.products.length === 0) {
                    setNoProductFound(true);
                }
            } else {
                setAvailableProducts([]);
                setNoProductFound(true);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setIsSearching(false);
        }
    }, [productSearch, page, getAllProducts]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Reset page when search changes
    useEffect(() => {
        setPage(1);
    }, [productSearch]);

    const handleDataChange = (name, value) => {
        setPromotionData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const toggleProduct = (product) => {
        const isSelected = selectedProducts.some((p) => p._id === product._id);
        if (isSelected) {
            setSelectedProducts((prev) =>
                prev.filter((p) => p._id !== product._id),
            );
        } else {
            setSelectedProducts((prev) => [...prev, product]);
        }
        setNoProductFound(false);
    };

    const validateEndTime = (endTime) => {
        if (new Date(endTime) <= new Date()) {
            return "End time must be in the future";
        }
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!promotionData.title) newErrors.title = "Title is required";
        if (promotionData.discountValue <= 0)
            newErrors.discountValue = "Value must be positive";
        if (!promotionData.startTime) newErrors.startTime = "Start is required";
        if (!promotionData.endTime) newErrors.endTime = "End is required";

        const endTimeError = validateEndTime(promotionData.endTime);
        if (endTimeError) newErrors.endTime = endTimeError;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const data = {
            ...promotionData,
            products: selectedProducts.map((p) => p._id),
        };

        let result;
        if (editId) {
            result = await updatePromotion(editId, data);
        } else {
            result = await addPromotion(data);
        }

        if (result?.success) {
            navigate("/admin-dashboard/promotions");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            {editId ? "Edit Promotion" : "Create Promotion"}
                        </h1>
                        <span className="text-sm text-gray-500">
                            {editId ? "Update campaign details" : "Build a new campaign"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate("/admin-dashboard/promotions")}
                        className="px-4 py-2 rounded-2xl text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors border border-gray-200 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        form="promotion-form"
                        type="submit"
                        disabled={loading || selectedProducts.length === 0}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-2xl font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <Save size={16} />
                        )}
                        {editId ? "Update" : "Create"}
                    </button>
                </div>
            </div>

            <form
                id="promotion-form"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
                {/* Configuration Panel */}
                <div className="lg:col-span-5 space-y-4">
                    <section className="bg-white border border-gray-200 rounded-2xl p-5">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Settings size={16} className="text-blue-600" />
                            Configuration
                        </h3>

                        <div className="space-y-4">
                            <Input
                                label="Promotion Title"
                                placeholder="e.g., Summer Sale"
                                value={promotionData.title}
                                className="w-full"
                                onChange={(e) =>
                                    handleDataChange("title", e.target.value)
                                }
                                error={errors.title}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <Select
                                    label="Type"
                                    value={promotionData.type}
                                    onChange={(val) =>
                                        handleDataChange("type", val)
                                    }
                                    className="w-full!"
                                    options={[
                                        { value: "FLASH_DEAL", label: "Flash Deal" },
                                        { value: "OFFER", label: "Offer" },
                                    ]}
                                />
                                <Select
                                    label="Discount Type"
                                    value={promotionData.discountType}
                                    onChange={(val) =>
                                        handleDataChange("discountType", val)
                                    }
                                    className="w-full!"
                                    options={[
                                        { value: "PERCENTAGE", label: "Percentage" },
                                        { value: "FIXED_AMOUNT", label: "Fixed Amount" },
                                    ]}
                                />
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Discount Value
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={promotionData.discountValue}
                                        onChange={(e) =>
                                            handleDataChange(
                                                "discountValue",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="flex-1 bg-white border border-gray-200 rounded-2xl px-3 py-2 text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                                        {promotionData.discountType === "PERCENTAGE" ? (
                                            <Percent size={18} />
                                        ) : (
                                            <span className="font-semibold text-sm">PKR</span>
                                        )}
                                    </div>
                                </div>
                                {errors.discountValue && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.discountValue}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="bg-gray-900 rounded-2xl p-5 text-white">
                        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                            <Calendar size={16} className="text-blue-400" />
                            Timeline
                        </h3>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-400">
                                    Start Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={promotionData.startTime}
                                    onChange={(e) =>
                                        handleDataChange("startTime", e.target.value)
                                    }
                                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.startTime && (
                                    <p className="text-xs text-red-400">{errors.startTime}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-400">
                                    End Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={promotionData.endTime}
                                    onChange={(e) =>
                                        handleDataChange("endTime", e.target.value)
                                    }
                                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.endTime && (
                                    <p className="text-xs text-red-400">{errors.endTime}</p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Product Selection */}
                <div className="lg:col-span-7 space-y-4">
                    <section className="bg-white border border-gray-200 rounded-2xl flex flex-col min-h-[400px]">
                        <div className="p-5 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Package size={16} className="text-blue-600" />
                                Product Selection
                            </h3>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={productSearch}
                                    onChange={(e) =>
                                        setProductSearch(e.target.value)
                                    }
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {isSearching ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <Search size={18} />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-5 overflow-y-auto">
                            {isSearching && availableProducts.length === 0 ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader2 className="animate-spin text-blue-600" size={32} />
                                </div>
                            ) : noProductFound ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <Search size={32} className="text-gray-300 mb-2" />
                                    <p className="text-sm text-gray-500">
                                        No products found or all products are already in active promotions
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {availableProducts.map((p) => {
                                        const isSelected = selectedProducts.some(
                                            (sp) => sp._id === p._id,
                                        );
                                        return (
                                            <button
                                                key={p._id}
                                                type="button"
                                                onClick={() => toggleProduct(p)}
                                                className={`relative p-3 rounded-2xl border transition-all flex flex-col items-center text-center gap-2 ${isSelected
                                                    ? "bg-blue-50 border-blue-500"
                                                    : "bg-white border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <div className="w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 p-2">
                                                    <img
                                                        src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${p.image}`}
                                                        className="w-full h-full object-contain"
                                                        alt={p.name}
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <p className="text-xs font-medium text-gray-900 truncate">
                                                        {p.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        PKR {p.price.toLocaleString()}
                                                    </p>
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center">
                                                        <Plus size={12} className="rotate-45" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between">
                                <button
                                    type="button"
                                    disabled={page === 1}
                                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                    className="px-3 py-1.5 rounded-2xl text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={page === totalPages}
                                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                                    className="px-3 py-1.5 rounded-2xl text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </section>
                </div>

                {/* Selected Products */}
                <div className="lg:col-span-12">
                    <section className="bg-white border border-gray-200 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Plus size={16} className="text-blue-600" />
                                Selected Products
                            </h3>
                            <span className="bg-gray-900 text-white px-3 py-1 rounded text-sm font-medium">
                                {selectedProducts.length} selected
                            </span>
                        </div>

                        {selectedProducts.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center">
                                <Package size={40} className="text-gray-300 mb-3" />
                                <p className="text-sm text-gray-500">
                                    No products selected
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                                {selectedProducts.map((p) => (
                                    <div
                                        key={p._id}
                                        className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden min-w-0">
                                            <div className="w-10 h-10 shrink-0 bg-white rounded-2xl p-1 border border-gray-200">
                                                <img
                                                    src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${p.image}`}
                                                    className="w-full h-full object-contain"
                                                    alt={p.name}
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-medium text-gray-900 truncate">
                                                    {p.name}
                                                </p>
                                                <p className="text-xs text-blue-600 mt-0.5">
                                                    Rs{" "}
                                                    {(promotionData.discountType === "PERCENTAGE"
                                                        ? p.price - (p.price * promotionData.discountValue) / 100
                                                        : p.price - promotionData.discountValue
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => toggleProduct(p)}
                                            className="w-6 h-6 shrink-0 rounded flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </form>
        </div>
    );
};

export default PromotionBuilder;

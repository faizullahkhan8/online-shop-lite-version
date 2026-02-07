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
import { useAddPromotion } from "../../api/hooks/promotion.api";
import { useNavigate } from "react-router-dom";

import Input from "../../UI/Input";
import Select from "../../UI/Select";

const PromotionBuilder = () => {
    const navigate = useNavigate();
    const { getAllProducts } = useGetAllProducts();
    const { addPromotion, loading: promotionLoading } = useAddPromotion();

    const [promotionData, setPromotionData] = useState({
        title: "",
        type: "FLASH_DEAL", // FLASH_DEAL or OFFER
        discountType: "PERCENTAGE", // PERCENTAGE or FIXED_AMOUNT
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

    // Fetch products based on search or page changes
    const fetchProducts = useCallback(async () => {
        setIsSearching(true);
        setNoProductFound(false);
        try {
            const response = await getAllProducts({
                search: productSearch,
                page: page,
                limit: 12, // Increased limit for grid view
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
        const timer = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(timer);
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

        const result = await addPromotion(data);
        if (result?.success) {
            navigate("/admin?tab=dashboard");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-4 shadow-lg shadow-slate-200/40">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-primary shadow-2xl shadow-slate-900/20">
                        <Zap size={28} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                            Promotion <span className="text-primary">Builder</span>
                        </h1>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Strategic Marketing Module
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate("/admin?tab=dashboard")}
                        className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all border border-slate-100 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        form="promotion-form"
                        type="submit"
                        disabled={
                            promotionLoading || selectedProducts.length === 0
                        }
                        className="flex items-center gap-2 bg-slate-900 text-primary px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all active:scale-95 shadow-lg shadow-slate-900/20 disabled:opacity-50"
                    >
                        {promotionLoading ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <Save size={16} />
                        )}
                        Authorize
                    </button>
                </div>
            </div>

            <form
                id="promotion-form"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
                {/* Configuration Panel */}
                <div className="lg:col-span-5 space-y-6">
                    <section className="bg-white border border-slate-100 rounded-3xl p-5 shadow-lg shadow-slate-200/40">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                            <Settings size={14} className="text-primary" />
                            Configuration
                        </h3>

                        <div className="space-y-5">
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

                            <div className="grid grid-cols-2 gap-4">
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
                                    label="Discount Logic"
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

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                                    Discount Value
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            value={promotionData.discountValue}
                                            onChange={(e) =>
                                                handleDataChange(
                                                    "discountValue",
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="w-full bg-white border-none rounded-lg px-4 py-2 text-xl font-black text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-primary shadow-md">
                                        {promotionData.discountType ===
                                        "PERCENTAGE" ? (
                                            <Percent size={18} />
                                        ) : (
                                            <span className="font-black text-sm">PKR</span>
                                        )}
                                    </div>

                                </div>
                                {errors.discountValue && (
                                    <p className="text-[10px] text-red-500 font-bold mt-2">
                                        {errors.discountValue}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="bg-slate-900 rounded-3xl p-5 shadow-lg shadow-slate-900/40 text-white">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                            <Calendar size={14} className="text-primary" />
                            Timeline
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    Start Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={promotionData.startTime}
                                    onChange={(e) =>
                                        handleDataChange("startTime", e.target.value)
                                    }
                                    className="w-full bg-slate-800 border-none rounded-lg px-3 py-2 text-xs font-bold text-white focus:ring-2 focus:ring-primary/30"
                                />
                                {errors.startTime && (
                                    <p className="text-[9px] text-primary font-bold">{errors.startTime}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    End Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={promotionData.endTime}
                                    onChange={(e) =>
                                        handleDataChange("endTime", e.target.value)
                                    }
                                    className="w-full bg-slate-800 border-none rounded-lg px-3 py-2 text-xs font-bold text-white focus:ring-2 focus:ring-primary/30"
                                />
                                {errors.endTime && (
                                    <p className="text-[9px] text-primary font-bold">{errors.endTime}</p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Inventory Mapping */}
                <div className="lg:col-span-7 space-y-6">
                    <section className="bg-white border border-slate-100 rounded-3xl shadow-lg shadow-slate-200/40 flex flex-col min-h-[400px]">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                <Package size={14} className="text-primary" />
                                Product Selection
                            </h3>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for products to add..."
                                    value={productSearch}
                                    onChange={(e) =>
                                        setProductSearch(e.target.value)
                                    }
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    {isSearching ? (
                                        <Loader2
                                            className="animate-spin"
                                            size={18}
                                        />
                                    ) : (
                                        <Search size={18} />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                            {isSearching && availableProducts.length === 0 ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader2
                                        className="animate-spin text-primary"
                                        size={32}
                                    />
                                </div>
                            ) : noProductFound ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                                    <Search size={32} className="text-slate-300 mb-3" />
                                    <p className="text-xs font-bold text-slate-400">
                                        No products found matching your search.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {availableProducts.map((p) => {
                                        const isSelected = selectedProducts.some(
                                            (sp) => sp._id === p._id,
                                        );
                                        return (
                                            <button
                                                key={p._id}
                                                type="button"
                                                onClick={() => toggleProduct(p)}
                                                className={`group relative p-3 rounded-2xl border transition-all flex flex-col items-center text-center gap-3 ${
                                                    isSelected
                                                        ? "bg-primary/5 border-primary shadow-sm"
                                                        : "bg-white border-slate-100 hover:border-slate-200 shadow-sm"
                                                }`}
                                            >
                                                <div className="w-full aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-100 p-2">
                                                    <img
                                                        src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${p.image}`}
                                                        className="w-full h-full object-contain"
                                                        alt={p.name}
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight truncate w-full">
                                                        {p.name}
                                                    </p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                        PKR {p.price.toLocaleString()}
                                                    </p>
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                                                        <Plus size={14} className="rotate-45" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between">
                                <button
                                    type="button"
                                    disabled={page === 1}
                                    onClick={() =>
                                        setPage((prev) => Math.max(1, prev - 1))
                                    }
                                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all border border-slate-100 hover:bg-slate-50 disabled:opacity-30"
                                >
                                    Previous
                                </button>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={page === totalPages}
                                    onClick={() =>
                                        setPage((prev) =>
                                            Math.min(totalPages, prev + 1),
                                        )
                                    }
                                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all border border-slate-100 hover:bg-slate-50 disabled:opacity-30"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </section>
                </div>

                {/* Selected Items Panel */}
                <div className="lg:col-span-12">
                    <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-lg shadow-slate-200/40">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <Plus size={14} className="text-primary" />
                                Selected Inventory Cluster
                            </h3>
                            <span className="bg-slate-900 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                {selectedProducts.length} Units Mapped
                            </span>
                        </div>

                        {selectedProducts.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center opacity-40">
                                <Package size={40} className="text-slate-300 mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Queue Empty: Select products to initialize
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                {selectedProducts.map((p) => (
                                    <div
                                        key={p._id}
                                        className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 shrink-0 bg-white rounded-lg p-1 border">
                                                <img
                                                    src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${p.image}`}
                                                    className="w-full h-full object-contain"
                                                    alt={p.name}
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold text-slate-900 uppercase truncate">
                                                    {p.name}
                                                </p>
                                                <p className="text-[9px] font-black text-primary mt-0.5">
                                                    Rs{" "}
                                                    {(promotionData.discountType ===
                                                    "PERCENTAGE"
                                                        ? p.price -
                                                          (p.price *
                                                              promotionData.discountValue) /
                                                              100
                                                        : p.price -
                                                          promotionData.discountValue
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => toggleProduct(p)}
                                            className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={12} />
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

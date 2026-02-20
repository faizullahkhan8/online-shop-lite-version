import {
    Zap,
    Calendar,
    ArrowUp,
    ArrowDown,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Loader2,
    Plus,
    Percent,
    AlertCircle,
    FilePenLine,
} from "lucide-react";
import { usePromotions } from "../../features/promotions/promotions.query";

import {
    useUpdatePromotion,
    useDeletePromotion,
} from "../../features/promotions/promotions.mutations";

import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";

const PromotionManager = () => {
    const navigate = useNavigate();
    const { data, isLoading } = usePromotions();

    const updateMutation = useUpdatePromotion();
    const deleteMutation = useDeletePromotion();

    const promotions = data?.promotions || [];

    const handleStatusToggle = async (promotion) => {
        const newStatus = promotion.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        await updateMutation.mutateAsync({
            id: promotion._id,
            data: { status: newStatus },
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this promotion?")) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const handleMove = async (index, direction) => {
        const newPromotions = [...promotions];
        const targetIndex = direction === "up" ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newPromotions.length) return;

        // Swap locally
        [newPromotions[index], newPromotions[targetIndex]] = [
            newPromotions[targetIndex],
            newPromotions[index],
        ];

        // Update orders locally
        newPromotions.forEach((p, i) => (p.order = i));

        // Ideally, sending a bulk update or updating the two swapped items
        // For simplicity, updating both items with their new order
        const p1 = newPromotions[index];
        const p2 = newPromotions[targetIndex];

        await Promise.all([
            updateMutation.mutateAsync({
                id: p1._id,
                data: { order: p1.order },
            }),
            updateMutation.mutateAsync({
                id: p2._id,
                data: { order: p2.order },
            }),
        ]);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-sm text-gray-500 mt-3">
                    Loading promotions...
                </p>
            </div>
        );
    }

    if (updateMutation.isError && !updateMutation.isPending) {
        toast.error("something went wronge!");
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            Promotion Manager
                        </h1>
                        <span className="text-sm text-gray-500">
                            Manage your campaigns
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() =>
                            navigate("/admin-dashboard/promotions/create")
                        }
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-2xl text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={16} />
                        New Campaign
                    </button>
                </div>
            </div>

            {/* Promotions List */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar size={16} className="text-blue-600" />
                        Active Campaigns
                    </h3>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm font-medium">
                        {promotions.length} Total
                    </span>
                </div>

                {promotions.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center">
                        <AlertCircle size={40} className="text-gray-300 mb-3" />
                        <p className="text-sm text-gray-500">
                            No campaigns found. Create one to get started!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {promotions.map((promo, index) => (
                            <div
                                key={promo._id}
                                className={`group relative bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4 transition-all hover:border-blue-500 ${
                                    promo.status === "ACTIVE"
                                        ? "opacity-100"
                                        : "opacity-60"
                                }`}
                            >
                                {/* Drag Handles / Order */}
                                <div className="flex flex-col gap-1 items-center justify-center mr-2">
                                    <button
                                        disabled={
                                            index === 0 ||
                                            updateMutation.isPending
                                        }
                                        onClick={() => handleMove(index, "up")}
                                        className="w-6 h-6 rounded bg-white border border-gray-300 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ArrowUp size={12} />
                                    </button>
                                    <span className="text-xs font-medium text-gray-400">
                                        {index + 1}
                                    </span>
                                    <button
                                        disabled={
                                            index === promotions.length - 1 ||
                                            updateMutation.isPending
                                        }
                                        onClick={() =>
                                            handleMove(index, "down")
                                        }
                                        className="w-6 h-6 rounded bg-white border border-gray-300 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ArrowDown size={12} />
                                    </button>
                                </div>

                                {/* Icon Type */}
                                <div className="w-11 h-11 shrink-0 bg-white rounded-2xl border border-gray-200 flex items-center justify-center text-gray-900">
                                    {promo.type === "FLASH_DEAL" ? (
                                        <Zap size={18} />
                                    ) : (
                                        <Percent size={18} />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                                            {promo.title}
                                        </h4>
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs font-medium border ${
                                                promo.status === "ACTIVE"
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : promo.status ===
                                                        "SCHEDULED"
                                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                                      : "bg-gray-100 text-gray-600 border-gray-200"
                                            }`}
                                        >
                                            {promo.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {format(
                                                new Date(promo.startTime),
                                                "MMM dd",
                                            )}{" "}
                                            -{" "}
                                            {format(
                                                new Date(promo.endTime),
                                                "MMM dd, yyyy",
                                            )}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            {promo.discountType === "PERCENTAGE"
                                                ? `${promo.discountValue}% OFF`
                                                : `PKR ${promo.discountValue} OFF`}
                                        </span>
                                        <span>
                                            {promo.products.length} Products
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto justify-end border-t md:border-t-0 border-gray-200 pt-3 md:pt-0">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/admin-dashboard/promotions/create?id=${promo._id}`,
                                            )
                                        }
                                        className="w-8 h-8 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-500 flex items-center justify-center transition-colors"
                                        title="Edit Promotion"
                                    >
                                        <FilePenLine size={14} />
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleStatusToggle(promo)
                                        }
                                        disabled={updateMutation.isPending}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-medium border transition-colors ${
                                            promo.status === "ACTIVE"
                                                ? "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                                                : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                        }`}
                                    >
                                        {updateMutation.isPending ? (
                                            <Loader2
                                                size={24}
                                                className="animate-spin"
                                            />
                                        ) : promo.status === "ACTIVE" ? (
                                            <>
                                                <ToggleRight size={14} />
                                                Deactivate
                                            </>
                                        ) : (
                                            <>
                                                <ToggleLeft size={14} />
                                                Activate
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(promo._id)}
                                        disabled={deleteMutation.isPending}
                                        className="w-8 h-8 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                                    >
                                        {deleteMutation.isPending ? (
                                            <Loader2
                                                size={14}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromotionManager;

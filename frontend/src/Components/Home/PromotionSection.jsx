import { Loader2, Megaphone } from "lucide-react";
import { usePromotionHighlights } from "../../features/promotions/promotions.query";
import PromotionCard from "../PromotionCard";

const PromotionSection = () => {
    const { data, isLoading, isError } = usePromotionHighlights();

    const activePromotion = data?.activePromotion || null;
    const nextUpcomingPromotion = data?.nextUpcomingPromotion || null;

    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-3">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-sans">
                        Promotions
                    </p>
                    <h2 className="text-sm font-medium tracking-[0.3em] uppercase text-gray-900 font-sans">
                        Current & Upcoming Deals
                    </h2>
                    <div className="w-8 h-px bg-gray-200 mx-auto" />
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="h-90 rounded-2xl border border-gray-200 bg-gray-50 animate-pulse" />
                        <div className="h-90 rounded-2xl border border-gray-200 bg-gray-50 animate-pulse" />
                    </div>
                ) : isError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                            <Megaphone size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-red-700">
                                Failed to load promotions
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                                Please refresh and try again.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <PromotionCard
                            promotion={activePromotion}
                            variant="active"
                        />
                        <PromotionCard
                            promotion={nextUpcomingPromotion}
                            variant="upcoming"
                        />
                    </div>
                )}

                {isLoading && (
                    <div className="flex items-center justify-center text-gray-500 text-sm gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        Loading promotions...
                    </div>
                )}
            </div>
        </section>
    );
};

export default PromotionSection;

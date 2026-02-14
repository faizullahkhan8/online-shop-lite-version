import { useEffect, useState, memo } from "react";
import { Clock, Tag, ChevronRight } from "lucide-react";
import { useGetActiveDeals } from "../../api/hooks/promotion.api";
import { Link } from "react-router-dom";

const CompactTimer = memo(({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const update = () => {
            const distance = new Date(endTime).getTime() - Date.now();
            if (distance < 0) {
                setTimeLeft("CLOSED");
                return;
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (days > 0) setTimeLeft(`${days}D ${hours}H`);
            else setTimeLeft(`${hours}H ${minutes}M ${seconds}S`);
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [endTime]);

    return (
        <div className="flex items-center gap-1.5 text-sm tracking-tighter text-zinc-900 font-medium">
            <Clock size={12} strokeWidth={2} />
            <span>{timeLeft}</span>
        </div>
    );
});

const PromotionSection = () => {
    const { getActiveDeals, loading } = useGetActiveDeals();
    const [deals, setDeals] = useState([]);

    useEffect(() => {
        getActiveDeals().then((res) => {
            if (res && res.data) {
                setDeals(res.data);
            }
        });
    }, [getActiveDeals]);

    if (loading || deals.length === 0) return null;

    return (
        <section className="container mx-auto px-4 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <h2 className="text-md uppercase tracking-[0.3em] font-semibold text-zinc-900">
                        Special Curations
                    </h2>
                    <p className="text-sm text-zinc-400 uppercase tracking-widest mt-2">
                        Limited Access
                    </p>
                </div>
                <Link
                    to="/promotions"
                    className="flex items-center gap-2 text-sm text-zinc-900 hover:text-zinc-500 font-semibold uppercase tracking-[0.2em] transition-colors pb-1 border-b border-zinc-900"
                >
                    View All
                    <ChevronRight size={14} />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {deals.map((deal) => (
                    <Link
                        key={deal._id}
                        to="/promotions"
                        className="group flex flex-col bg-white border border-zinc-100 p-8 transition-all duration-500 hover:border-zinc-300"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-zinc-400">
                                <Tag size={12} strokeWidth={1.5} />
                                <span>{deal.type.replace("_", " ")}</span>
                            </div>
                            {deal.type === "FLASH_DEAL" && (
                                <CompactTimer endTime={deal.endTime} />
                            )}
                        </div>

                        <h3 className="text-2xl font-light text-zinc-900 mb-4 tracking-tight leading-snug group-hover:text-zinc-600 transition-colors">
                            {deal.title}
                        </h3>

                        <div className="mb-8">
                            <p className="text-md uppercase tracking-[0.15em] font-medium text-zinc-900">
                                {deal.discountType === "PERCENTAGE"
                                    ? `${deal.discountValue}% Reduction`
                                    : `PKR ${deal.discountValue.toLocaleString()} Credit`}
                            </p>
                        </div>

                        <div className="mt-auto pt-6 border-t border-zinc-50 flex items-center justify-between">
                            <span className="text-sm text-zinc-400 uppercase tracking-widest">
                                {deal.products.length} Items
                            </span>
                            <div className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500">
                                <ChevronRight size={14} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default PromotionSection;
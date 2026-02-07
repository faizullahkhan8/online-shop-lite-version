import { useEffect, useState, memo } from "react";
import { Zap, Percent, ChevronRight } from "lucide-react";
import { useGetActiveDeals } from "../../api/hooks/promotion.api";
import { Link } from "react-router-dom";

// Optimized Countdown unit component
const TimeUnit = memo(({ value, label, suffix }) => (
    <div className="flex items-center gap-1">
        <span className="bg-white/10 px-3 py-2 rounded-xl backdrop-blur-md border border-white/20 min-w-[50px] text-center">
            {String(value).padStart(2, "0")}
            <span className="text-[10px] ml-0.5 opacity-50">{suffix}</span>
        </span>
    </div>
));

const CountdownTimer = memo(({ endTime, currentTime }) => {
    const distance = new Date(endTime).getTime() - currentTime;

    if (distance < 0) {
        return (
            <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] animate-pulse">
                DEAL EXPIRED
            </div>
        );
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return (
        <div className="flex items-center gap-2 font-black text-2xl tracking-widest text-white">
            {days > 0 && <TimeUnit value={days} suffix="d" />}
            {days > 0 && <span className="text-primary/40 pb-1">:</span>}
            <TimeUnit value={hours} suffix="h" />
            <span className="text-primary animate-pulse pb-1">:</span>
            <TimeUnit value={minutes} suffix="m" />
            <span className="text-primary animate-pulse pb-1">:</span>
            <TimeUnit value={seconds} suffix="s" />
        </div>
    );
});

const PromotionTimeline = memo(({ startTime, endTime, currentTime }) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const now = currentTime;

    const total = end - start;
    const elapsed = now - start;
    const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));

    return (
        <div className="mt-6">
            <div className="flex justify-between items-end mb-2">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">
                    Timeline Authorization
                </span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                    {progress.toFixed(1)}% Consumed
                </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-px">
                <div
                    className="h-full bg-linear-to-r from-primary/50 to-primary rounded-full transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(13,110,253,0.3)]"
                    style={{ width: `${progress}%` }}
                />
            </div>

        </div>
    );
});

const PromotionSection = () => {
    const { getActiveDeals, loading } = useGetActiveDeals();
    const [deals, setDeals] = useState([]);
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        getActiveDeals().then((res) => {
            if (res && res.data) {
                setDeals(res.data);
            }
        });
    }, [getActiveDeals]);

    if (loading || deals.length === 0) return null;

    return (
        <div className="space-y-12">
            {deals.map((deal) => (
                <section key={deal._id} className="container mx-auto px-4">
                    <div
                        className={`relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 mb-8 ${
                            deal.type === "FLASH_DEAL"
                                ? "bg-slate-900 border border-slate-800 shadow-2xl shadow-slate-900/40"
                                : "bg-primary border border-primary/20 shadow-2xl shadow-primary/20"
                        }`}
                    >
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />

                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                            <div className="flex items-center gap-6">
                                <div
                                    className={`p-5 rounded-3xl ${
                                        deal.type === "FLASH_DEAL"
                                            ? "bg-primary text-white"
                                            : "bg-white text-primary"
                                    }`}
                                >
                                    {deal.type === "FLASH_DEAL" ? (
                                        <Zap size={32} />
                                    ) : (
                                        <Percent size={32} />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-white/50 uppercase tracking-[0.4em] mb-2">
                                        {deal.type.replace("_", " ")}
                                    </h3>
                                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                                        {deal.title}
                                    </h2>
                                </div>
                            </div>

                            {deal.type === "FLASH_DEAL" && (
                                <div className="text-center md:text-right space-y-3">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
                                        Expending Energy In:
                                    </p>
                                    <CountdownTimer
                                        endTime={deal.endTime}
                                        currentTime={currentTime}
                                    />
                                </div>
                            )}

                            {deal.type === "OFFER" && (
                                <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20">
                                    <p className="text-3xl font-black text-white tracking-tighter">
                                        {deal.discountType === "PERCENTAGE"
                                            ? `${deal.discountValue}% OFF`
                                            : `SAVE PKR ${deal.discountValue}`}
                                    </p>
                                </div>
                            )}
                        </div>

                        <PromotionTimeline
                            startTime={deal.startTime}
                            endTime={deal.endTime}
                            currentTime={currentTime}
                        />
                    </div>

                    <div className="flex overflow-x-auto pb-6 gap-6 no-scrollbar snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:overflow-visible xl:grid-cols-6 lg:snap-none">
                        {deal.products.map((product) => {

                            const originalPrice = product.price;
                            let discountedPrice = originalPrice;
                            if (deal.discountType === "PERCENTAGE") {
                                discountedPrice =
                                    originalPrice -
                                    (originalPrice * deal.discountValue) / 100;
                            } else {
                                discountedPrice =
                                    originalPrice - deal.discountValue;
                            }

                            return (
                                <Link
                                    key={product._id}
                                    to={`/product/${product._id}`}
                                    className="group bg-white rounded-4xl p-5 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all hover:-translate-y-2 relative overflow-hidden shrink-0 w-[240px] sm:w-[280px] lg:w-auto snap-start"
                                >

                                    <div className="absolute top-4 right-4 z-10 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-primary/20">
                                        {deal.discountType === "PERCENTAGE"
                                            ? `-${deal.discountValue}%`
                                            : `OFF`}
                                    </div>

                                    <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4">
                                        <img
                                            src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${product.image}`}
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                            alt={product.name}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                                            {product.name}
                                        </h4>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 line-through font-black uppercase tracking-widest">
                                                PKR{" "}
                                                {originalPrice.toLocaleString()}
                                            </span>
                                            <span className="text-xl font-black text-rose-600 tracking-tighter">
                                                PKR{" "}
                                                {discountedPrice.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            Stock Level:{" "}
                                            {product.stock > 0
                                                ? "Optimal"
                                                : "Depleted"}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default PromotionSection;

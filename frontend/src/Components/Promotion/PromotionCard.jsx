import { memo } from "react";
import { Clock, Tag, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const TimeUnit = memo(({ value, suffix }) => (
    <div className="flex items-center">
        <span className="bg-white border border-zinc-200 px-2 py-1 rounded text-sm font-medium text-zinc-900 min-w-[38px] text-center tracking-tighter">
            {String(value).padStart(2, "0")}
            <span className="text-sm ml-0.5 text-zinc-400 uppercase">{suffix}</span>
        </span>
    </div>
));

const CountdownTimer = memo(({ endTime, currentTime }) => {
    const distance = new Date(endTime).getTime() - currentTime;

    if (distance < 0) {
        return (
            <div className="text-sm font-medium uppercase tracking-widest text-zinc-400">
                Archive Closed
            </div>
        );
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return (
        <div className="flex gap-1.5">
            {days > 0 && <TimeUnit value={days} suffix="d" />}
            <TimeUnit value={hours} suffix="h" />
            <TimeUnit value={minutes} suffix="m" />
            <TimeUnit value={seconds} suffix="s" />
        </div>
    );
});

const PromotionTimeline = memo(({ startTime, endTime, currentTime }) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const progress = Math.min(100, Math.max(0, ((currentTime - start) / (end - start)) * 100));

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm uppercase tracking-[0.15em] text-zinc-400">Availability</span>
                <span className="text-sm font-medium text-zinc-900">{progress.toFixed(0)}%</span>
            </div>
            <div className="h-[1px] w-full bg-zinc-100 overflow-hidden">
                <div
                    className="h-full bg-zinc-900 transition-all duration-1000 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
});

const PromotionCard = ({ deal, currentTime }) => {
    return (
        <section className="group">
            <div className="bg-white border border-zinc-100 overflow-hidden flex flex-col lg:flex-row transition-all duration-500 hover:border-zinc-300">
                <div className="lg:w-96 shrink-0 p-8 lg:p-10 bg-[#fafafa] flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                        <Tag size={14} className="text-zinc-900" strokeWidth={1.5} />
                        <span className="text-sm uppercase tracking-[0.2em] text-zinc-500 font-medium">
                            {deal.type.replace("_", " ")}
                        </span>
                    </div>

                    <h2 className="text-3xl font-light text-zinc-900 mb-6 leading-[1.1] tracking-tight">
                        {deal.title}
                    </h2>

                    {deal.type === "FLASH_DEAL" && (
                        <div className="space-y-4 mb-2">
                            <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-zinc-400">
                                <Clock size={14} strokeWidth={1.5} />
                                <span>Closing In</span>
                            </div>
                            <CountdownTimer endTime={deal.endTime} currentTime={currentTime} />
                        </div>
                    )}

                    {deal.type === "OFFER" && (
                        <div className="mb-6">
                            <p className="text-md uppercase tracking-[0.15em] font-medium text-zinc-900">
                                {deal.discountType === "PERCENTAGE"
                                    ? `${deal.discountValue}% Reduction`
                                    : `Credit: PKR ${deal.discountValue.toLocaleString()}`}
                            </p>
                        </div>
                    )}

                    <PromotionTimeline
                        startTime={deal.startTime}
                        endTime={deal.endTime}
                        currentTime={currentTime}
                    />
                </div>

                <div className="flex-1 p-8 lg:p-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        {deal.products.map((product) => {
                            const discountedPrice = deal.discountType === "PERCENTAGE"
                                ? product.price - (product.price * deal.discountValue) / 100
                                : product.price - deal.discountValue;

                            return (
                                <Link
                                    key={product._id}
                                    to={`/product/${product._id}`}
                                    className="group/product flex flex-col"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden bg-[#f3f3f3] mb-4">
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="text-sm font-medium text-zinc-900 bg-white/90 backdrop-blur-sm px-2 py-1 uppercase tracking-tighter">
                                                {deal.discountType === "PERCENTAGE" ? `-${deal.discountValue}%` : "Offer"}
                                            </span>
                                        </div>
                                        <img
                                            src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${product.image}`}
                                            className="w-full h-full object-cover grayscale-[0.5] group-hover/product:grayscale-0 group-hover/product:scale-105 transition-all duration-700"
                                            alt={product.name}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-md font-light text-zinc-900 tracking-wide line-clamp-1 uppercase">
                                            {product.name}
                                        </h4>
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-sm font-medium text-zinc-900">
                                                PKR {discountedPrice.toLocaleString()}
                                            </span>
                                            <span className="text-sm text-zinc-400 line-through font-light">
                                                {product.price.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 flex items-center justify-between border-t border-zinc-50">
                                        <span className={`text-sm uppercase tracking-widest ${product.stock > 0 ? "text-zinc-400" : "text-red-800"}`}>
                                            {product.stock > 0 ? "Available" : "Sold Out"}
                                        </span>
                                        <ChevronRight size={14} className="text-zinc-300 group-hover/product:text-zinc-900 transition-colors" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromotionCard;
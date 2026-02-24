import {
    ArrowRight,
    CalendarDays,
    Clock3,
    ImageOff,
    Tag,
    Zap,
} from "lucide-react";
import { format, formatDistanceToNowStrict } from "date-fns";
import { Link } from "react-router-dom";

const getImageSrc = (promotion) => {
    if (promotion?.image?.url) return promotion.image.url;
    if (promotion?.image?.filePath) {
        return `${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${promotion.image.filePath}`;
    }
    return "";
};

const getDiscountLabel = (promotion) => {
    if (!promotion) return "";
    if (promotion.discountType === "PERCENTAGE") {
        return `${promotion.discountValue}% OFF`;
    }
    return `PKR ${Number(promotion.discountValue || 0).toLocaleString()} OFF`;
};

const formatDateTime = (date) => {
    if (!date) return "";
    return format(new Date(date), "MMM dd, yyyy - hh:mm a");
};

const getTimingText = (promotion, variant) => {
    if (!promotion) return "";
    const date =
        variant === "upcoming" ? promotion.startTime : promotion.endTime;
    const prefix = variant === "upcoming" ? "Starts" : "Ends";
    return `${prefix} ${formatDistanceToNowStrict(new Date(date), {
        addSuffix: true,
    })}`;
};

const PromotionCard = ({ promotion, variant = "active" }) => {
    const imageSrc = getImageSrc(promotion);
    const isFlashDeal = promotion?.type === "FLASH_DEAL";
    const variantLabel = variant === "upcoming" ? "Next Up" : "Live Now";

    if (!promotion) {
        return (
            <div className="h-full min-h-62.5 rounded-2xl border border-dashed border-gray-300 bg-white p-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
                    <ImageOff size={20} />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                    {variant === "upcoming"
                        ? "No upcoming promotion yet"
                        : "No active promotion right now"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Create or activate promotions from the admin panel.
                </p>
            </div>
        );
    }

    return (
        <article id={promotion?._id} className="group relative h-full min-h-55 min-w-150 overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
            {/* Full background image */}
            {imageSrc ? (
                <img
                    src={imageSrc}
                    alt={promotion.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                    <ImageOff size={32} />
                </div>
            )}

            {/* Gradient overlay — strong on the left, fades to transparent on the right */}
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent" />

            {/* Content — left-aligned */}
            <div className="relative z-10 flex flex-col justify-between h-full p-5 sm:p-6 max-w-[60%]">
                {/* Top badges */}
                <div className="flex items-center gap-2">
                    <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            variant === "upcoming"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                        }`}
                    >
                        {variantLabel}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-sm">
                        {isFlashDeal ? "Flash Deal" : "Offer"}
                    </span>
                </div>

                {/* Middle — title + discount */}
                <div className="mt-4 space-y-1">
                    <p className="text-white text-xl sm:text-2xl font-bold leading-tight line-clamp-2">
                        {promotion.title}
                    </p>
                    <p className="text-white/70 text-xs">
                        {promotion.products?.length || 0} products included
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                        <span className="flex items-center gap-1.5 text-white/80 text-xs font-medium">
                            {isFlashDeal ? (
                                <Zap size={13} />
                            ) : (
                                <Tag size={13} />
                            )}
                            {promotion.type.replace("_", " ")}
                        </span>
                        <span className="text-white text-2xl font-bold">
                            {getDiscountLabel(promotion)}
                        </span>
                    </div>
                </div>

                {/* Bottom — timing + CTA */}
                <div className="mt-4 space-y-3">
                    <div className="space-y-1">
                        <p className="text-white/75 text-xs flex items-center gap-1.5">
                            <Clock3 size={12} />
                            {getTimingText(promotion, variant)}
                        </p>
                        <p className="text-white/60 text-xs flex items-center gap-1.5">
                            <CalendarDays size={12} />
                            {formatDateTime(promotion.startTime)} –{" "}
                            {formatDateTime(promotion.endTime)}
                        </p>
                    </div>

                    <Link
                        to={`/products?promotionId=${promotion._id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/80 transition-colors"
                    >
                        Shop Products
                        <ArrowRight size={15} />
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default PromotionCard;

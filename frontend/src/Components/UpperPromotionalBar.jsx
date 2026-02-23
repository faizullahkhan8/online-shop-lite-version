import { intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";
import { useActiveDeals } from "../features/promotions/promotions.query";

// Pad numbers so "9 seconds" and "10 seconds" take the same width
const formatRemainingTimeTabular = (endTime, currentTime = new Date()) => {
    if (!endTime) return "Ending soon";

    const now = new Date(currentTime);
    const endDate = new Date(endTime);

    if (Number.isNaN(endDate.getTime())) return "Ending soon";
    if (endDate <= now) return "Ended";

    const duration = intervalToDuration({ start: now, end: endDate });
    const totalDays = duration.days || 0;

    const timeParts = [
        { label: "mo", value: duration.months || 0 },
        { label: "w", value: Math.floor(totalDays / 7) },
        { label: "d", value: totalDays % 7 },
        { label: "h", value: duration.hours || 0 },
        { label: "m", value: duration.minutes || 0 },
        { label: "s", value: duration.seconds || 0 },
    ];

    const firstNonZeroIndex = timeParts.findIndex((part) => part.value > 0);
    if (firstNonZeroIndex === -1) return "< 1s";

    // Always anchor to seconds as the last segment, take up to 3 leading segments
    const lastIndex = timeParts.length - 1; // always "s"
    const startIndex = Math.min(firstNonZeroIndex, lastIndex - 2); // at most 3 slots ending at "s"
    const visibleParts = timeParts
        .slice(startIndex, lastIndex + 1)
        .slice(-3) // cap at 3 segments
        .map((part) => ({
            ...part,
            display: String(part.value).padStart(2, "0"),
        }));

    return visibleParts.map((p) => `${p.display}${p.label}`).join(" : ");
};

const PromotionBar = () => {
    const { data, isLoading, isError } = useActiveDeals();
    const [now, setNow] = useState(() => Date.now());

    const activePromotion = data?.data?.[0] || null;
    const productCount = activePromotion?.products?.length || 0;

    useEffect(() => {
        if (!activePromotion?.endTime) return undefined;

        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, [activePromotion?.endTime]);

    const remainingTime = activePromotion?.endTime
        ? formatRemainingTimeTabular(activePromotion.endTime, now)
        : "";

    const timeText =
        remainingTime && remainingTime !== "Ended"
            ? `Ends in ${remainingTime}`
            : remainingTime || "Calculating...";

    if (isLoading || isError || !activePromotion) {
        return (
            <div className="w-full h-9 z-50 bg-[#F1F8ED] text-[#1F3A2E] flex items-center justify-center px-4">
                <p className="text-xs tracking-wide font-medium text-[#1F3A2E]/60">
                    {isLoading
                        ? "Loading promotion..."
                        : isError
                          ? "Unable to load promotion"
                          : "No active promotion right now"}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-9 z-50 bg-[#F1F8ED] overflow-hidden">
            <div className="flex items-center justify-center h-full px-4 gap-0">
                {/* Title — fixed width, right-aligned */}
                <span className="text-[#1F3A2E] text-xs font-semibold tracking-wide truncate max-w-45 sm:max-w-xs text-right shrink-0">
                    {activePromotion.title}
                </span>

                <Divider />

                {/* Product count — fixed width so it never shifts layout */}
                <span className="text-[#1F3A2E]/70 text-xs font-medium tabular-nums whitespace-nowrap shrink-0 w-20 text-center">
                    {productCount} product{productCount === 1 ? "" : "s"}
                </span>

                <Divider />

                {/* Timer — monospaced + fixed width so ticking never shifts */}
                <span
                    className="text-[#2D6A4F] text-xs font-semibold whitespace-nowrap shrink-0 w-29"
                    style={{
                        fontVariantNumeric: "tabular-nums",
                        fontFamily: "monospace",
                    }}
                >
                    {timeText}
                </span>
            </div>
        </div>
    );
};

const Divider = () => (
    <span className="mx-2.5 sm:mx-3 text-[#1F3A2E] text-2xl text-bold select-none shrink-0">
        ·
    </span>
);

export default PromotionBar;

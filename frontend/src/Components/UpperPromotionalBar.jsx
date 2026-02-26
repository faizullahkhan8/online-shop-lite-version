import { useEffect, useState } from "react";
import { useActiveDeals } from "../features/promotions/promotions.query";

import {
    differenceInMonths,
    differenceInWeeks,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
    addMonths,
    addWeeks,
    addDays,
    addHours,
    addMinutes,
} from "date-fns";

const formatRemainingTimeTabular = (endTime, currentTime = new Date()) => {
    if (!endTime) return "Ending soon";

    const now = new Date(currentTime);
    const endDate = new Date(endTime);

    if (Number.isNaN(endDate.getTime())) return "Ending soon";
    if (endDate <= now) return "Ended";

    // 1️⃣ Months (calendar accurate)
    const months = differenceInMonths(endDate, now);
    let cursor = addMonths(now, months);

    // 2️⃣ Weeks
    const weeks = differenceInWeeks(endDate, cursor);
    cursor = addWeeks(cursor, weeks);

    // 3️⃣ Days
    const days = differenceInDays(endDate, cursor);
    cursor = addDays(cursor, days);

    // 4️⃣ Hours
    const hours = differenceInHours(endDate, cursor);
    cursor = addHours(cursor, hours);

    // 5️⃣ Minutes
    const minutes = differenceInMinutes(endDate, cursor);
    cursor = addMinutes(cursor, minutes);

    // 6️⃣ Seconds
    const seconds = differenceInSeconds(endDate, cursor);

    const timeParts = [
        { label: "mo", value: months },
        { label: "w", value: weeks },
        { label: "d", value: days },
        { label: "h", value: hours },
        { label: "m", value: minutes },
        { label: "s", value: seconds },
    ];

    return timeParts
        .map((part) => `${String(part.value).padStart(2, "0")}${part.label}`)
        .join(" : ");
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

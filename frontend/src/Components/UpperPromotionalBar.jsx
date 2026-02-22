import { useEffect, useState } from "react";

const PromotionBar = () => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const target = new Date();
        target.setHours(target.getHours() + 12); // 12 hour countdown

        const interval = setInterval(() => {
            const now = new Date();
            const difference = target - now;

            if (difference <= 0) {
                clearInterval(interval);
                return;
            }

            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference / (1000 * 60)) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft({ hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-5 z-50 bg-[#F1F8ED] text-[#1F3A2E]">
            <div className="   flex items-center justify-center gap-6 pt-1 text-[10px] tracking-widest">

                <span className="uppercase font-light">
                    Exclusive Beauty Sale
                </span>

                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <span>{String(timeLeft.hours).padStart(2, "0")}</span>:
                        <span>{String(timeLeft.minutes).padStart(2, "0")}</span>:
                        <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PromotionBar;
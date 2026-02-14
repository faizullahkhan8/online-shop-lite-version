import { useEffect, useState } from "react";
import { useGetActiveDeals } from "../api/hooks/promotion.api";
import PromotionCard from "../Components/Promotion/PromotionCard";
import { Tag } from "lucide-react";

const PromotionsPage = () => {
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

    return (
        <div className="min-h-screen bg-white">
            <main className="py-16">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="flex flex-col items-center text-center mb-16 space-y-5">
                        <div className="flex items-center gap-3">
                            <Tag className="text-zinc-900" size={16} strokeWidth={1.5} />
                            <span className="text-sm uppercase tracking-[0.25em] text-zinc-400 font-medium">
                                Limited Releases
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-light text-zinc-900 tracking-tight">
                            The Editorial Archive
                        </h1>

                        <p className="text-zinc-500 max-w-md text-sm leading-relaxed tracking-wide">
                            A curated selection of seasonal promotions and exclusive collection events.
                            Available for a strictly limited duration.
                        </p>

                        <div className="w-12 h-[1px] bg-zinc-200 mt-4"></div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-32">
                            <div className="w-8 h-8 border-[1px] border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : deals.length === 0 ? (
                        <div className="text-center py-32 bg-[#fafafa] border border-zinc-100">
                            <h3 className="text-md uppercase tracking-[0.2em] font-medium text-zinc-400">
                                No Active Curations
                            </h3>
                            <p className="text-sm text-zinc-500 mt-4 tracking-wider">
                                Check back for future collection releases.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-16 lg:gap-24">
                            {deals.map((deal) => (
                                <div key={deal._id} className="group cursor-pointer">
                                    <PromotionCard
                                        deal={deal}
                                        currentTime={currentTime}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PromotionsPage;
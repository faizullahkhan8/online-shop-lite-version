import { useState } from "react";
import { Timer } from "lucide-react";
import ProductCard from "../../Components/ProductCard";

const DealsAndOffers = ({ items }) => {
    const [timeLeft] = useState({
        days: "04",
        hours: "13",
        mins: "34",
        secs: "56",
    });

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row bg-white border-y border-slate-100 overflow-hidden shadow-sm">
                <div className="p-8 lg:w-72 shrink-0 flex flex-col justify-center bg-slate-50/50 border-r border-slate-100">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Timer size={16} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                Limited Time
                            </span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight">
                            Deals and Offers
                        </h2>
                        <p className="text-xs font-medium text-slate-400 mt-2">
                            Hygiene equipments
                        </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-8">
                        {[
                            { val: timeLeft.days, label: "Days" },
                            { val: timeLeft.hours, label: "Hrs" },
                            { val: timeLeft.mins, label: "Min" },
                            { val: timeLeft.secs, label: "Sec" },
                        ].map((unit, i) => (
                            <div
                                key={i}
                                className="aspect-square rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shadow-lg"
                            >
                                <span className="text-sm font-black italic">
                                    {unit.val}
                                </span>
                                <span className="text-[8px] font-bold uppercase opacity-60">
                                    {unit.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-1 overflow-x-auto no-scrollbar py-4 px-2 gap-4">
                    {items?.map((prod) => (
                        <div key={prod.id} className="min-w-70 shrink-0">
                            <ProductCard product={prod} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DealsAndOffers;

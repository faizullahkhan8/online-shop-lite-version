import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../UI/Button";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { Timer } from "lucide-react";

const DealsAndOffers = ({ items }) => {
    const [timeLeft] = useState({
        days: "04",
        hours: "13",
        mins: "34",
        secs: "56",
    });

    const dispatch = useDispatch();

    return (
        <div className="max-w-7xl mx-auto my-2 px-4 lg:px-0">
            <div className="flex flex-col lg:flex-row bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="p-6 lg:w-64 shrink-0 flex flex-col justify-between bg-slate-50/50 border-r border-slate-100">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Timer size={14} className="text-primary" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                                Limited Time
                            </span>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 leading-tight">
                            Deals and Offers
                        </h2>
                        <p className="text-[11px] font-medium text-slate-400 mt-1">
                            Hygiene equipments
                        </p>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 mt-6 lg:mt-0">
                        {[
                            { val: timeLeft.days, label: "Days" },
                            { val: timeLeft.hours, label: "Hrs" },
                            { val: timeLeft.mins, label: "Min" },
                            { val: timeLeft.secs, label: "Sec" },
                        ].map((unit, i) => (
                            <div
                                key={i}
                                className="aspect-square rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shadow-md shadow-slate-200"
                            >
                                <span className="text-xs font-black italic">
                                    {unit.val}
                                </span>
                                <span className="text-[7px] font-bold uppercase opacity-60">
                                    {unit.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-1 overflow-x-auto no-scrollbar">
                    {items?.map((prod) => (
                        <div
                            key={prod.id}
                            className="min-w-[160px] max-w-[180px] flex-1 border-r border-slate-50 p-3 flex flex-col hover:bg-slate-50/50 transition-all duration-300 relative group"
                        >
                            <span className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">
                                -10%
                            </span>

                            <Link
                                to={`/product/${prod?._id}`}
                                className="w-full aspect-square mb-3 relative flex items-center justify-center p-2 bg-white rounded-xl border border-transparent group-hover:border-slate-100 transition-all overflow-hidden"
                            >
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/${prod.image}`}
                                    alt={prod.name}
                                    className="w-24 h-24 object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                                />
                            </Link>

                            <div className="flex flex-col flex-1">
                                <h4 className="text-slate-700 font-bold mb-2 text-[11px] line-clamp-2 leading-tight h-7">
                                    {prod.name}
                                </h4>

                                <div className="mt-auto">
                                    <Button
                                        onClick={() =>
                                            dispatch(addToCart(prod))
                                        }
                                        className="w-full bg-slate-900 hover:bg-primary text-white rounded-lg py-1.5 font-bold text-[9px] uppercase tracking-wider transition-all active:scale-95"
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DealsAndOffers;

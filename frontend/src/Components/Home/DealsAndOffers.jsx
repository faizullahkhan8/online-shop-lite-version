import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../UI/Button";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";

const DealsAndOffers = ({ items }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: "04",
        hours: "13",
        mins: "34",
        secs: "56",
    });

    const dispatch = useDispatch();

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setTimeLeft((prev) => {
    //             const s = parseInt(prev.secs);
    //             return {
    //                 ...prev,
    //                 secs: s > 0 ? String(s - 1).padStart(2, "0") : "59",
    //             };
    //         });
    //     }, 1000);
    //     return () => clearInterval(timer);
    // }, []);

    return (
        <div className="max-w-7xl mx-auto mb-6">
            <div className="flex flex-col lg:flex-row bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {/* Left: Countdown */}
                <div className="p-6 lg:w-70 shrink-0 flex flex-col justify-between border-r border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Deals and offers
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Hygiene equipments
                        </p>
                    </div>

                    <div className="flex gap-2 mt-6">
                        {[
                            { val: timeLeft.days, label: "Days" },
                            { val: timeLeft.hours, label: "Hour" },
                            { val: timeLeft.mins, label: "Min" },
                            { val: timeLeft.secs, label: "Sec" },
                        ].map((unit, i) => (
                            <div
                                key={i}
                                className="w-12 h-12 rounded bg-gray-800 text-white flex flex-col items-center justify-center"
                            >
                                <span className="text-base font-bold leading-none">
                                    {unit.val}
                                </span>
                                <span className="text-[10px] text-gray-300 mt-0.5">
                                    {unit.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Products */}
                <div className="flex flex-1 overflow-x-auto">
                    {items?.map((prod) => (
                        <div
                            key={prod.id}
                            className="min-w-44 flex-1 border-l border-gray-200 p-4 flex flex-col hover:bg-gray-50 transition-all duration-300 relative"
                        >
                            <Link
                                to={`/product/${prod?._id}`}
                                className="w-full cursor-pointer group h-28 mb-4 relative flex items-center justify-center"
                            >
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/${
                                        prod.image
                                    }`}
                                    alt={prod.name}
                                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300 mix-blend-multiply"
                                />
                            </Link>

                            <h4 className="text-gray-900 font-medium mb-1 text-xs transition-colors">
                                {prod.name}
                            </h4>
                            <Button
                                onClick={() => dispatch(addToCart(prod))}
                                size="sm"
                            >
                                Add to Cart
                            </Button>
                            <span
                                className="absolute top-2 text-sm bg-red-100 rounded-full
                             px-2 right-2 text-red-500 font-semibold"
                            >
                                {/* -{prod.discount}% */}
                                -10%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DealsAndOffers;

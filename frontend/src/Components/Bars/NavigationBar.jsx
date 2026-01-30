import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, Zap, Gift, Briefcase, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetAllCategories } from "../../api/hooks/category.api";

const NavigationBar = () => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const dropdownRef = useRef(null);
    const { getAllCategories } = useGetAllCategories();

    useEffect(() => {
        getAllCategories().then((res) => {
            setCategories(res.categories);
        });
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsCategoryOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="border-t border-slate-100 hidden md:block bg-white relative">
            <div className="container mx-auto px-8 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                                isCategoryOpen
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                    : "hover:bg-slate-50 text-slate-700"
                            }`}
                        >
                            <Menu
                                size={18}
                                className={`${
                                    isCategoryOpen ? "rotate-90" : ""
                                } transition-transform duration-300`}
                            />
                            <span className="uppercase tracking-wider text-[11px]">
                                All Categories
                            </span>
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-300 ${
                                    isCategoryOpen ? "rotate-180" : "opacity-40"
                                }`}
                            />
                        </button>

                        {isCategoryOpen && (
                            <div className="absolute top-[120%] left-0 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 py-3 z-[60] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                                    {categories.map((cat, index) => (
                                        <Link
                                            key={index}
                                            to={`/products?category=${cat.name
                                                .toLowerCase()
                                                .replace(" ", "-")}`}
                                            className="flex items-center justify-between px-5 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors group"
                                            onClick={() =>
                                                setIsCategoryOpen(false)
                                            }
                                        >
                                            <span className="text-sm font-semibold">
                                                {cat.name}
                                            </span>
                                            <ChevronDown
                                                size={14}
                                                className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-6 w-[1px] bg-slate-100 mx-2"></div>

                    <nav className="flex items-center gap-1">
                        <Link
                            to="/products"
                            className="flex items-center gap-2 px-4 py-2.5 hover:text-primary rounded-xl hover:bg-primary/5 transition-all group relative"
                        >
                            <Zap
                                size={16}
                                className="text-amber-500 group-hover:animate-pulse"
                            />
                            <span className="uppercase tracking-wider text-[11px]">
                                Hot Offers
                            </span>
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group">
                        <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 uppercase tracking-widest">
                            EN | PKR
                        </span>
                        <ChevronDown
                            size={12}
                            className="text-slate-300 group-hover:text-slate-900"
                        />
                    </button>

                    <button className="flex items-center gap-3 px-4 py-2 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group">
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                                🇩🇪
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 uppercase tracking-widest">
                                Ship to
                            </span>
                        </div>
                        <ChevronDown
                            size={12}
                            className="text-slate-300 group-hover:text-slate-900"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NavigationBar;

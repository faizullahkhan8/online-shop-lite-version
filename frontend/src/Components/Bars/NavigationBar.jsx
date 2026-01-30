import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetAllCategories } from "../../api/hooks/category.api";

const NavigationBar = () => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const dropdownRef = useRef(null);
    const { getAllCategories } = useGetAllCategories();

    useEffect(() => {
        getAllCategories().then((res) => {
            console.log(res);
            setCategories(res.categories);
        });
    }, []);

    // Close dropdown when clicking outside
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
        <div className="border-t border-gray-200 hidden md:block bg-gradient-to-r from-gray-50 to-white relative">
            <div className="container py-3 flex items-center justify-between">
                {/* Left Navigation */}
                <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
                    {/* All Categories Dropdown Container */}
                    <div className="relative" ref={dropdownRef}>
                        <div
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-md transition-all group ${
                                isCategoryOpen
                                    ? "text-primary bg-primary/5"
                                    : "hover:text-primary hover:bg-primary/5"
                            }`}
                        >
                            <Menu
                                size={18}
                                className={`${
                                    isCategoryOpen
                                        ? "scale-110"
                                        : "group-hover:scale-110"
                                } transition-transform`}
                            />
                            <span>All category</span>
                            <ChevronDown
                                size={16}
                                className={`text-gray-400 transition-transform duration-200 ${
                                    isCategoryOpen
                                        ? "rotate-180 text-primary"
                                        : "group-hover:text-primary"
                                }`}
                            />
                        </div>

                        {/* Actual Dropdown Menu */}
                        {isCategoryOpen && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-y-scroll max-h-50">
                                {categories.map((cat, index) => (
                                    <Link
                                        key={index}
                                        to={`/products?category=${cat.name
                                            .toLowerCase()
                                            .replace(" ", "-")}`}
                                        className="block px-4 py-2 text-gray-600 hover:bg-primary/5 hover:text-primary transition-colors"
                                        onClick={() => setIsCategoryOpen(false)}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <Link
                        to="/products"
                        className="px-3 py-1.5 hover:text-primary hover:bg-primary/5 rounded-md transition-all relative group"
                    >
                        Hot offers
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            HOT
                        </span>
                    </Link>

                    <Link
                        to="/products"
                        className="px-3 py-1.5 hover:text-primary hover:bg-primary/5 rounded-md transition-all"
                    >
                        Gift boxes
                    </Link>

                    <Link
                        to="/products"
                        className="px-3 py-1.5 hover:text-primary hover:bg-primary/5 rounded-md transition-all"
                    >
                        Projects
                    </Link>
                </div>

                {/* Right Settings */}
                <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:text-primary hover:bg-primary/5 rounded-md transition-all group">
                        <span>English, PKR</span>
                        <ChevronDown
                            size={16}
                            className="text-gray-400 group-hover:text-primary transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:text-primary hover:bg-primary/5 rounded-md transition-all group">
                        <span>Ship to</span>
                        <span className="text-lg">🇩🇪</span>
                        <ChevronDown
                            size={16}
                            className="text-gray-400 group-hover:text-primary transition-colors"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigationBar;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, ArrowRight } from "lucide-react";

import { useGetAllCategories } from "../../api/hooks/category.api";

// Import images
import BannerImage from "../../assets/images/phone.png";
import tshirt from "../../assets/images/t-shirt.png";
import sofas from "../../assets/images/sofas.png";

const HeroSection = () => {
    const [categories, setCategories] = useState([]);
    const { getAllCategories, loading: categoiresLoading } =
        useGetAllCategories();

    useEffect(() => {
        (async () => {
            const response = await getAllCategories();
            if (response.success) {
                setCategories(response.categories.slice(0, 9));
            }
        })();
    }, []);

    const slides = [
        {
            title: "Latest Trending",
            headline: "Electronic Items",
            subtitle: "Learn more",
            bg: "bg-[#e3f0ff]", // Light blue
            img: BannerImage,
            darkText: true,
        },
        {
            title: "Summer Collection",
            headline: "Fashion Trends",
            subtitle: "Shop now",
            bg: "bg-[#fff1e6]", // Light orange
            img: tshirt,
            darkText: true,
        },
        {
            title: "Modern Living",
            headline: "Home Interiors",
            subtitle: "Discover comfort",
            bg: "bg-[#e8f5e9]", // Light green
            img: sofas,
            darkText: true,
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-slide effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 lg:grid-cols-10 gap-6">
                {/* 1. Sidebar Navigation (2 cols) */}
                <aside className="hidden lg:block lg:col-span-2">
                    <ul className="space-y-1">
                        {categories.map((cat, index) => (
                            <li key={index}>
                                <Link
                                    to={`/products?category=${cat.name.toLowerCase()}`}
                                    className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-primary rounded-md transition-colors text-sm font-medium"
                                >
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* 2. Main Banner Slider (6 cols) */}
                <div className="lg:col-span-6">
                    <div
                        className={`relative w-full h-[360px] rounded-md overflow-hidden transition-colors duration-500 ${slides[currentSlide].bg}`}
                    >
                        {/* Banner Content */}
                        <div className="absolute inset-0 flex items-center px-12 z-10">
                            <div className="max-w-md">
                                <h3 className="text-xl md:text-2xl font-light text-gray-700 mb-2">
                                    {slides[currentSlide].title}
                                </h3>
                                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                    {slides[currentSlide].headline}
                                </h2>
                                <Link
                                    to="/products"
                                    className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-md"
                                >
                                    {slides[currentSlide].subtitle}
                                </Link>
                            </div>
                        </div>

                        {/* Banner Image */}
                        <img
                            src={slides[currentSlide].img}
                            alt="Banner"
                            className="absolute right-8 bottom-0 h-4/5 object-contain opacity-90 transition-opacity duration-500"
                        />

                        {/* Slide Indicators */}
                        <div className="absolute bottom-4 left-12 flex gap-2">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                                        currentSlide === idx
                                            ? "bg-primary w-6"
                                            : "bg-gray-400 hover:bg-gray-600"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Right User Widget (2 cols) */}
                <div className="hidden lg:flex lg:col-span-2 flex-col gap-4">
                    {/* User Welcome Card */}
                    <div className="bg-[#e3f0ff] p-4 rounded-md h-[150px] flex flex-col justify-between">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-[#c7e1ff] p-2 rounded-full text-white">
                                <User className="text-gray-700" size={24} />
                            </div>
                            <div>
                                <p className="text-sm">Hi, user</p>
                                <p className="text-sm">let's get started</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Link
                                to="/register"
                                className="block w-full bg-primary text-white text-center text-sm py-1.5 rounded hover:bg-primary-dark transition-colors"
                            >
                                Join now
                            </Link>
                            <Link
                                to="/login"
                                className="block w-full bg-white text-primary text-center text-sm py-1.5 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                Log in
                            </Link>
                        </div>
                    </div>

                    {/* Promo Box 1 - Orange */}
                    <div className="bg-[#F38332] p-4 rounded-md text-white flex-1 flex flex-col justify-center">
                        <p className="text-sm opacity-90 mb-1">
                            Get Rs:1000 off
                        </p>
                        <p className="font-medium text-lg leading-tight mb-2">
                            with a new supplier
                        </p>
                    </div>

                    {/* Promo Box 2 - Teal */}
                    <div className="bg-[#55BDC3] p-4 rounded-md text-white flex-1 flex flex-col justify-center">
                        <p className="text-sm opacity-90 mb-1">
                            Send quotes with
                        </p>
                        <p className="font-medium text-lg leading-tight mb-2">
                            supplier preferences
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile View - Simplified */}
            <div className="lg:hidden mt-4">
                <div className="grid grid-cols-2 gap-2">
                    {/* Mobile Categories - simplified list */}
                    {categories.slice(0, 4).map((cat, idx) => (
                        <Link
                            key={idx}
                            to={`/products`}
                            className="bg-gray-100 p-3 rounded text-sm text-center font-medium"
                        >
                            {cat.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroSection;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useGetAllCategories } from "../../api/hooks/category.api";

const BannerImage =
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1200";
const tshirt =
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200";
const sofas =
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200";

const HeroSection = () => {
    const [categories, setCategories] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const { getAllCategories } = useGetAllCategories();

    const slides = [
        {
            title: "Latest Trending",
            headline: "Electronic Items",
            subtitle: "Learn more",
            bg: "bg-[#e3f0ff]",
            img: BannerImage,
            accent: "text-blue-600",
        },
        {
            title: "Summer Collection",
            headline: "Fashion Trends",
            subtitle: "Shop now",
            bg: "bg-[#fff1e6]",
            img: tshirt,
            accent: "text-orange-600",
        },
        {
            title: "Modern Living",
            headline: "Home Interiors",
            subtitle: "Discover comfort",
            bg: "bg-[#e8f5e9]",
            img: sofas,
            accent: "text-emerald-600",
        },
    ];

    useEffect(() => {
        (async () => {
            const response = await getAllCategories();
            if (response?.success) {
                setCategories(response.categories.slice(0, 9));
            }
        })();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-5 grid grid-cols-1 lg:grid-cols-4 gap-6 shadow-sm">
                <aside className="hidden lg:block lg:col-span-1 py-2">
                    <div className="flex flex-col gap-1">
                        {categories.map((cat, index) => (
                            <Link
                                key={index}
                                to={`/products?category=${cat._id}`}
                                className="flex items-center justify-between px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl transition-all group"
                            >
                                <span className="text-sm font-bold tracking-tight">
                                    {cat.name}
                                </span>
                                <ChevronRight
                                    size={14}
                                    className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-300"
                                />
                            </Link>
                        ))}
                    </div>
                </aside>

                <div className="lg:col-span-3">
                    <div
                        className={`relative w-full h-[400px] rounded-[2rem] overflow-hidden transition-all duration-700 ${slides[currentSlide].bg}`}
                    >
                        <div className="absolute inset-0 flex items-center px-10 md:px-16 z-20">
                            <div className="max-w-md">
                                <p
                                    className={`font-black uppercase tracking-[0.2em] text-[10px] mb-3 opacity-80 ${slides[currentSlide].accent}`}
                                >
                                    {slides[currentSlide].title}
                                </p>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                                    {slides[currentSlide].headline}
                                </h2>
                                <Link
                                    to="/products"
                                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-primary transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                                >
                                    {slides[currentSlide].subtitle}
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>

                        <img
                            src={slides[currentSlide].img}
                            alt="Hero"
                            className="absolute right-0 bottom-0 h-[85%] w-1/2 object-contain object-right-bottom drop-shadow-2xl mix-blend-multiply opacity-90 transition-all duration-1000 p-8"
                        />

                        <div className="absolute bottom-6 left-10 md:left-16 flex gap-2 z-30">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${
                                        currentSlide === idx
                                            ? "w-8 bg-slate-900"
                                            : "w-2 bg-slate-400/40"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:hidden mt-6 grid grid-cols-2 gap-3">
                {categories.slice(0, 4).map((cat, idx) => (
                    <Link
                        key={idx}
                        to={`/products?category=${cat._id}`}
                        className="bg-white border border-slate-100 py-4 px-2 rounded-2xl text-[10px] text-center font-black uppercase tracking-[0.15em] text-slate-600 shadow-sm active:bg-slate-50"
                    >
                        {cat.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HeroSection;

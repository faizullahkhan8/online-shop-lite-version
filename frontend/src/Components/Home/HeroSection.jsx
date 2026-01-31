import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const BannerImage =
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1200";
const tshirt =
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200";
const sofas =
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200";

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

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
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-4 lg:p-6 shadow-sm">
                <div
                    className={`relative w-full h-[350px] md:h-[500px] rounded-[2rem] overflow-hidden transition-all duration-700 ${slides[currentSlide].bg}`}
                >
                    <div className="absolute inset-0 flex items-center px-8 md:px-16 z-20">
                        <div className="max-w-xl">
                            <p
                                className={`font-black uppercase tracking-[0.2em] text-[10px] md:text-xs mb-4 opacity-80 ${slides[currentSlide].accent}`}
                            >
                                {slides[currentSlide].title}
                            </p>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
                                {slides[currentSlide].headline}
                            </h2>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary transition-all shadow-xl active:scale-95"
                            >
                                {slides[currentSlide].subtitle}
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>

                    <img
                        src={slides[currentSlide].img}
                        alt="Hero"
                        className="absolute right-0 bottom-0 h-[75%] md:h-[90%] w-full md:w-1/2 object-contain object-right-bottom drop-shadow-2xl mix-blend-multiply opacity-90 transition-all duration-1000 p-4 md:p-12"
                    />

                    <div className="absolute bottom-8 left-8 md:left-16 flex gap-3 z-30">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-2 rounded-full transition-all duration-500 ${
                                    currentSlide === idx
                                        ? "w-10 bg-slate-900"
                                        : "w-2 bg-slate-400/40"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;

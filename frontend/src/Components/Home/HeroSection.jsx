import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useGetHeroSlides } from "../../api/hooks/hero.api.js";

const HeroSection = () => {
    const { getSlides, slides, loading } = useGetHeroSlides();
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        getSlides();
    }, [getSlides]);

    useEffect(() => {
        if (slides.length > 0) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [slides.length]);

    if (loading && slides.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="h-[350px] md:h-[500px] bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            </div>
        );
    }

    if (slides.length === 0) return null;

    const activeSlide = slides[currentSlide];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className={`relative overflow-hidden rounded-[2.5rem] ${activeSlide.bg}`}>
                {/* Soft overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                
                {/* Single combined container - FIXED HEIGHT */}
                <div className="relative grid md:grid-cols-2 gap-8 items-center h-[500px] px-8 md:px-16 py-12">
                    
                    {/* Text side - LEFT */}
                    <div className="relative h-full flex flex-col justify-center">
                        <div className="space-y-6 pb-16">
                            <p className={`font-bold uppercase tracking-widest text-xs ${activeSlide.accent}`}>
                                {activeSlide.title}
                            </p>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                                {activeSlide.headline}
                            </h2>
                            {activeSlide.subtitle && (
                                <p className="text-base md:text-lg text-slate-700 leading-relaxed max-w-md">
                                    {activeSlide.subtitle}
                                </p>
                            )}
                        </div>
                        
                        {/* Indicators - FIXED POSITION */}
                        <div className="absolute bottom-0 flex gap-3">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        currentSlide === idx
                                            ? "w-12 bg-slate-900"
                                            : "w-2 bg-slate-400/50 hover:bg-slate-400/80"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Image side - RIGHT - FIXED DIMENSIONS */}
                    <div className="flex items-center justify-center h-full overflow-hidden">
                        <img
                            src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${activeSlide.image}`}
                            alt="Hero"
                            className="w-full h-full object-contain drop-shadow-2xl transition-all duration-1000 hover:scale-105"
                        />
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
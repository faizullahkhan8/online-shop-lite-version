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
            <div className="container mx-auto px-4 lg:px-8 py-6">
                <div className="h-[300px] md:h-[400px] bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={28} />
                </div>
            </div>
        );
    }

    if (slides.length === 0) return null;

    const activeSlide = slides[currentSlide];

    return (
        <div className="container mx-auto px-4 lg:px-8 py-6">
            <div className={`relative overflow-hidden rounded-lg border border-gray-200 ${activeSlide.bg}`}>
                {/* Soft overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

                {/* Single combined container - FIXED HEIGHT */}
                <div className="relative grid md:grid-cols-2 gap-6 items-center h-[400px] px-6 md:px-12 py-8">

                    {/* Text side - LEFT */}
                    <div className="relative h-full flex flex-col justify-center">
                        <div className="space-y-4 pb-12">
                            <p className={`font-medium text-sm ${activeSlide.accent}`}>
                                {activeSlide.title}
                            </p>
                            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
                                {activeSlide.headline}
                            </h2>
                            {activeSlide.subtitle && (
                                <p className="text-sm md:text-base text-gray-700 leading-relaxed max-w-md">
                                    {activeSlide.subtitle}
                                </p>
                            )}
                        </div>

                        {/* Indicators - FIXED POSITION */}
                        <div className="absolute bottom-0 flex gap-2">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx
                                        ? "w-8 bg-blue-600"
                                        : "w-1.5 bg-gray-300 hover:bg-gray-400"
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
                            className="w-full h-full object-contain drop-shadow-lg transition-all duration-700 hover:scale-105"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HeroSection;
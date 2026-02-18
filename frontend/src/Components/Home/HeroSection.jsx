import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useGetHeroSlides } from "../../api/hooks/hero.api.js";
import Button from "../../UI/Button.jsx";

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
            <div className="container mx-auto px-4 lg:px-12 py-12">
                <div className="h-[400px] md:h-[600px] bg-white border border-zinc-100 flex items-center justify-center">
                    <Loader2
                        className="animate-spin text-zinc-900"
                        size={24}
                        strokeWidth={1}
                    />
                </div>
            </div>
        );
    }

    if (slides.length === 0) return null;

    const activeSlide = slides[currentSlide];

    return (
        <div className="container mx-auto px-4 lg:px-12 py-12">
            <div className="relative overflow-hidden bg-gray-100 border border-zinc-100 rounded-2xl">
                <div className="relative grid md:grid-cols-2 gap-12 items-center min-h-[500px] lg:h-[650px] px-8 md:px-16 py-12">
                    <div className="relative h-full flex flex-col justify-center order-2 md:order-1">
                        <div className="space-y-8 pb-16">
                            <p className="text-md font-semibold tracking-[0.4em] uppercase text-zinc-900">
                                {activeSlide.title}
                            </p>

                            <h2 className="text-5xl lg:text-7xl font-light text-zinc-900 leading-[1.1] tracking-tighter">
                                {activeSlide.headline}
                            </h2>

                            {activeSlide.subtitle && (
                                <p className="text-sm uppercase tracking-widest text-zinc-500 leading-loose max-w-sm">
                                    {activeSlide.subtitle}
                                </p>
                            )}
                        </div>

                        <div className="absolute bottom-0 flex gap-4">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className="group py-4"
                                >
                                    <div
                                        className={`h-[1px] rounded-2xl transition-all duration-700 ${currentSlide === idx
                                            ? "w-12 bg-zinc-900"
                                            : "w-6 bg-zinc-200 group-hover:bg-zinc-400"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-center h-full overflow-hidden order-1 md:order-2">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="absolute inset-0 bg-zinc-50 rounded-full scale-75 opacity-50 blur-3xl" />
                            <img
                                src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${activeSlide.image}`}
                                alt="Hero"
                                className="relative w-full h-full object-contain grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 ease-out hover:scale-105"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;

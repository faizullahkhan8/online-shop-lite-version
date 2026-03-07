import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useHeroSlides } from "../../features/heros/hero.queries.js";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const { data, isPending } = useHeroSlides({ removeActives: true });
    const [currentSlide, setCurrentSlide] = useState(0);
    let Navigate = useNavigate();

    useEffect(() => {
        if (data?.slides?.length > 0) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % data?.slides?.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [data?.slides?.length]);

    if (isPending && data?.slides?.length === 0) {
        return (
            <div className="container mx-auto px-4 lg:px-12 py-12">
                <div className="h-[70vh] md:h-[85vh] lg:h-[95vh] bg-white border border-zinc-100 flex items-center justify-center">
                    <Loader2
                        className="animate-spin text-zinc-900"
                        size={24}
                        strokeWidth={1}
                    />
                </div>
            </div>
        );
    }

    if (data?.slides?.length === 0) return null;

    const activeSlide = data?.slides?.[currentSlide];

    return (
        <div className="h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[95vh] relative w-full overflow-hidden">
            {data?.slides?.map((slide, idx) => (
                <div
                    key={idx}
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{
                        opacity: currentSlide === idx ? 1 : 0,
                        backgroundImage: `url(${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${slide?.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transform:
                            currentSlide === idx ? "scale(1.05)" : "scale(1)",
                        transition:
                            "opacity 1000ms ease-in-out, transform 6000ms ease-in-out",
                    }}
                />
            ))}

            <div className="absolute inset-0 bg-linear-to-r from-black/70 sm:from-black/50 via-black/40 sm:via-black/20 to-transparent z-10" />

            <div className="absolute inset-0 z-20 flex items-center">
                <div className="px-6 sm:px-12 lg:px-20 max-w-screen-2xl mx-auto w-full mt-10 sm:mt-0">
                    <div
                        key={currentSlide}
                        className="max-w-[16rem] sm:max-w-sm md:max-w-md lg:max-w-3xl space-y-3 sm:space-y-4 md:space-y-5"
                        style={{
                            animation: "heroFadeUp 700ms ease-out forwards",
                        }}
                    >
                        <p className="text-xs sm:text-sm tracking-widest text-white font-sans font-semibold uppercase">
                            {activeSlide?.title}
                        </p>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.2] sm:leading-[1.1] tracking-tight font-heading">
                            {activeSlide?.headline}
                        </h2>

                        {activeSlide?.subtitle && (
                            <p className="text-xs font-body sm:text-sm font-normal tracking-wider sm:tracking-widest text-white leading-relaxed max-w-[500px]">
                                {activeSlide?.subtitle}
                            </p>
                        )}

                        <div className="pt-2 sm:pt-3">
                            <button
                                onClick={() => {
                                    Navigate("/products")
                                }}
                                className="bg-white text-gray-900 text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] font-sans font-medium px-6 py-2.5 sm:px-8 sm:py-3 hover:bg-gray-900 hover:text-white transition-colors duration-300">
                                Shop Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 z-20 flex justify-center gap-3 sm:gap-4">
                {data?.slides?.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className="group py-2 sm:py-3"
                    >
                        <div
                            className={`h-px rounded-full transition-all duration-700 ${currentSlide === idx
                                ? "w-8 sm:w-12 bg-white"
                                : "w-4 sm:w-6 bg-white/40 group-hover:bg-white/70"
                                }`}
                        />
                    </button>
                ))}
            </div>

            <style>{`
        @keyframes heroFadeUp {
            from {
                opacity: 0;
                transform: translateY(16px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `}</style>
        </div>
    );
};

export default HeroSection;
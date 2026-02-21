import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useHeroSlides } from "../../features/heros/hero.queries.js";

const HeroSection = () => {
    const { data, isPending } = useHeroSlides();
    const [currentSlide, setCurrentSlide] = useState(0);

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

    if (data?.slides?.length === 0) return null;

    const activeSlide = data?.slides?.[currentSlide];

    return (
        // <div className="container mx-auto px-4 lg:px-12 py-12">
        //     <div className="relative overflow-hidden bg-gray-100 border border-zinc-100 rounded-2xl">
        //         <div className="relative grid md:grid-cols-2 gap-12 items-center min-h-[500px] lg:h-[650px] px-8 md:px-16 py-12">
        //             <div className="relative h-full flex flex-col justify-center order-2 md:order-1">
        //                 <div className="space-y-8 pb-16">
        //                     <p className="text-md font-semibold tracking-[0.4em] uppercase text-zinc-900">
        //                         {activeSlide?.title}
        //                     </p>

        //                     <h2 className="text-5xl lg:text-7xl font-light text-zinc-900 leading-[1.1] tracking-tighter">
        //                         {activeSlide?.headline}
        //                     </h2>

        //                     {activeSlide?.subtitle && (
        //                         <p className="text-sm uppercase tracking-widest text-zinc-500 leading-loose max-w-sm">
        //                             {activeSlide?.subtitle}
        //                         </p>
        //                     )}
        //                 </div>

        //                 <div className="absolute bottom-0 flex gap-4">
        //                     {data?.slides?.map((_, idx) => (
        //                         <button
        //                             key={idx}
        //                             onClick={() => setCurrentSlide(idx)}
        //                             className="group py-4"
        //                         >
        //                             <div
        //                                 className={`h-[1px] rounded-2xl transition-all duration-700 ${currentSlide === idx
        //                                     ? "w-12 bg-zinc-900"
        //                                     : "w-6 bg-zinc-200 group-hover:bg-zinc-400"
        //                                     }`}
        //                             />
        //                         </button>
        //                     ))}
        //                 </div>
        //             </div>

        //             <div className="flex items-center justify-center h-full overflow-hidden order-1 md:order-2">
        //                 <div className="relative w-full h-full flex items-center justify-center">
        //                     <div className="absolute inset-0 bg-zinc-50 rounded-full scale-75 opacity-50 blur-3xl" />
        //                     <img
        //                         src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${activeSlide?.image}`}
        //                         alt="Hero"
        //                         className="relative w-full h-full object-contain grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 ease-out hover:scale-105"
        //                     />
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>

        <div className="h-[95vh] relative w-full  overflow-hidden">

            {/* Background Images — stacked, smooth fade + zoom */}
            {data?.slides?.map((slide, idx) => (
                <div
                    key={idx}
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{
                        opacity: currentSlide === idx ? 1 : 0,
                        backgroundImage: `url(${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${slide?.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transform: currentSlide === idx ? "scale(1.05)" : "scale(1)",
                        transition: "opacity 1000ms ease-in-out, transform 6000ms ease-in-out",
                    }}
                />
            ))}

            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-10" />

            {/* Content Layer */}
            <div className="absolute inset-0 z-20 flex items-center">
                <div className="px-8 sm:px-12 lg:px-20 max-w-screen-2xl mx-auto w-full">

                    {/* Text block — fade + slide up on change */}
                    <div
                        key={currentSlide}
                        className="max-w-lg space-y-5"
                        style={{
                            animation: "heroFadeUp 700ms ease-out forwards",
                        }}
                    >
                        {/* Small label */}
                        <p className="text-[10px] uppercase tracking-[0.35em] text-white/70 font-sans font-normal">
                            {activeSlide?.title}
                        </p>

                        {/* Main heading */}
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.1] tracking-tight font-sans">
                            {activeSlide?.headline}
                        </h2>

                        {/* Subtitle */}
                        {activeSlide?.subtitle && (
                            <p className="text-[11px] uppercase tracking-[0.15em] text-white/60 leading-relaxed font-sans font-normal max-w-xs">
                                {activeSlide?.subtitle}
                            </p>
                        )}

                        {/* CTA Button */}
                        <div className="pt-3">
                            <button className="bg-white text-gray-900 text-[10px] uppercase tracking-[0.25em] font-sans font-medium px-8 py-3 hover:bg-gray-900 hover:text-white transition-colors duration-300">
                                Shop Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Dots — same logic */}
            <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-4">
                {data?.slides?.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className="group py-3"
                    >
                        <div
                            className={`h-[1px] rounded-full transition-all duration-700 ${currentSlide === idx
                                ? "w-12 bg-white"
                                : "w-6 bg-white/40 group-hover:bg-white/70"
                                }`}
                        />
                    </button>
                ))}
            </div>

            {/* Keyframe animation — inline style tag */}
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

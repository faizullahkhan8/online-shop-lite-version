// import React, { useMemo, useEffect, useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const WhatsAppIcon = () => (
//     <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 32 32"
//         className="w-5 h-5 fill-gray-800 dark:fill-gray-100 group-hover:fill-white transition-colors duration-200"
//     >
//         <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.736 5.471 2.027 7.774L0 32l8.454-2.018A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.756-1.842l-.484-.287-5.016 1.197 1.234-4.874-.316-.5A13.226 13.226 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.354-1.162-2.719-1.294-.364-.133-.63-.199-.895.199-.265.398-1.029 1.294-1.261 1.56-.232.265-.465.298-.863.1-.398-.2-1.681-.619-3.2-1.974-1.183-1.054-1.981-2.356-2.213-2.754-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.697.2-.233.265-.399.398-.665.133-.265.066-.498-.033-.697-.1-.199-.895-2.156-1.227-2.952-.323-.775-.65-.67-.895-.682-.231-.01-.497-.013-.763-.013s-.697.1-1.062.498c-.364.398-1.393 1.361-1.393 3.318s1.427 3.85 1.626 4.116c.199.265 2.807 4.285 6.802 6.01.951.41 1.693.655 2.271.839.954.304 1.823.261 2.51.158.766-.114 2.354-.962 2.686-1.891.332-.928.332-1.724.232-1.891-.099-.166-.364-.265-.762-.464z" />
//     </svg>
// );

// const StickyActions = React.memo(() => {
//     const [pageLoaded, setPageLoaded] = useState(false);
//     const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
//     const btnRef = useRef(null);

//     useEffect(() => {
//         if (document.readyState === "complete") {
//             setTimeout(() => setPageLoaded(true), 800);
//         } else {
//             const handleLoad = () => setTimeout(() => setPageLoaded(true), 1200);
//             window.addEventListener("load", handleLoad);
//             return () => window.removeEventListener("load", handleLoad);
//         }
//     }, []);

//     // Variants: container handles staggered children
//     const containerVariants = useMemo(
//         () => ({
//             hidden: { opacity: 0, y: 30 },
//             visible: {
//                 opacity: 1,
//                 y: 0,
//                 transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.08 },
//             },
//             exit: { opacity: 0, y: 30, transition: { duration: 0.2 } },
//         }),
//         []
//     );

//     const itemVariants = useMemo(
//         () => ({
//             hidden: { opacity: 0, y: 12 },
//             visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
//         }),
//         []
//     );

//     // Mouse tilt logic for 3D effect
//     const handleMouseMove = (e) => {
//         const el = btnRef.current;
//         if (!el) return;
//         const rect = el.getBoundingClientRect();
//         const px = (e.clientX - rect.left) / rect.width; // 0..1
//         const py = (e.clientY - rect.top) / rect.height; // 0..1
//         // map to small rotation degrees
//         const ry = (px - 0.5) * 14; // rotateY
//         const rx = -(py - 0.5) * 10; // rotateX
//         setTilt({ rx, ry });
//     };

//     const handleMouseLeave = () => setTilt({ rx: 0, ry: 0 });

//     return (
//         <div className="fixed right-2 md:right-[16px] bottom-6 z-50 flex flex-col items-center gap-3">
//             <AnimatePresence>
//                 {pageLoaded && (
//                     <motion.div
//                         className="flex flex-col items-center gap-3 mt-2"
//                         variants={containerVariants}
//                         initial="hidden"
//                         animate="visible"
//                         exit="exit"
//                     >
//                         {/* WhatsApp button wrapper */}
//                         <motion.a
//                             href="https://wa.me/+923330555564"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             aria-label="WhatsApp"
//                             title="WhatsApp"
//                             ref={btnRef}
//                             onMouseMove={handleMouseMove}
//                             onMouseLeave={handleMouseLeave}
//                             variants={itemVariants}
//                             whileHover={{ scale: 1.08 }}
//                             whileTap={{ scale: 0.96 }}
//                             className={`
//                 group relative h-8 w-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
//                 bg-gray-100 dark:bg-green-400 shadow-lg
//                 transition-transform duration-200 transform
//                 hover:bg-gradient-to-tr from-green-400 to-green-600 hover:animate-pulse
//               `}
//                             style={{
//                                 // apply perspective + tilt
//                                 transform: `perspective(700px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
//                                 // add GPU acceleration
//                                 willChange: "transform",
//                             }}
//                         >
//                             {/* pulsing halo ring (subtle, infinite) */}
//                             <motion.span
//                                 aria-hidden
//                                 className="absolute inset-0 rounded-full pointer-events-none"
//                                 initial={{ scale: 0.9, opacity: 0.18 }}
//                                 animate={{
//                                     scale: [0.96, 1.22, 0.96],
//                                     opacity: [0.12, 0.22, 0.12],
//                                 }}
//                                 transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
//                                 style={{
//                                     boxShadow: "0 6px 18px rgba(16,185,129,0.12)",
//                                 }}
//                             />

//                             {/* decorative ripple when tapped - appears briefly */}
//                             <motion.span
//                                 className="absolute rounded-full pointer-events-none"
//                                 initial={{ scale: 0.9, opacity: 0 }}
//                                 whileTap={{ scale: 2.2, opacity: 0.18 }}
//                                 transition={{ duration: 0.32 }}
//                                 style={{
//                                     inset: 0,
//                                     background: "rgba(16,185,129,0.08)",
//                                 }}
//                             />

//                             {/* the icon */}
//                             <div className="relative z-10">
//                                 <WhatsAppIcon />
//                             </div>

//                             {/* tooltip */}
//                             <motion.span
//                                 className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium
//                   bg-black/80 text-white opacity-0 translate-x-2 pointer-events-none `}

//                                 initial={{ opacity: 0, x: 10 }}
//                                 whileHover={{ opacity: 1, x: 0 }}
//                                 transition={{ duration: 0.18 }}
//                                 aria-hidden="true"
//                                 style={{ zIndex: 20 }}
//                             >
//                                 WhatsApp
//                             </motion.span>
//                         </motion.a>

//                         {/* small label or secondary action example (keeps stagger effect) */}
//                         {/* <motion.div
//                             variants={itemVariants}
//                             className="text-xs text-gray-500 dark:text-gray-300 select-none"
//                             aria-hidden
//                         >
//                             <motion.span
//                                 initial={{ opacity: 0, y: 6 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: 0.16 }}
//                             >
//                                 Need help? Chat now
//                             </motion.span>
//                         </motion.div> */}
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// });

// export default StickyActions;

































import React, { useMemo, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WhatsAppIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-5 h-5 sm:w-6 sm:h-6 fill-white"
    >
        <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.736 5.471 2.027 7.774L0 32l8.454-2.018A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.756-1.842l-.484-.287-5.016 1.197 1.234-4.874-.316-.5A13.226 13.226 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.354-1.162-2.719-1.294-.364-.133-.63-.199-.895.199-.265.398-1.029 1.294-1.261 1.56-.232.265-.465.298-.863.1-.398-.2-1.681-.619-3.2-1.974-1.183-1.054-1.981-2.356-2.213-2.754-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.697.2-.233.265-.399.398-.665.133-.265.066-.498-.033-.697-.1-.199-.895-2.156-1.227-2.952-.323-.775-.65-.67-.895-.682-.231-.01-.497-.013-.763-.013s-.697.1-1.062.498c-.364.398-1.393 1.361-1.393 3.318s1.427 3.85 1.626 4.116c.199.265 2.807 4.285 6.802 6.01.951.41 1.693.655 2.271.839.954.304 1.823.261 2.51.158.766-.114 2.354-.962 2.686-1.891.332-.928.332-1.724.232-1.891-.099-.166-.364-.265-.762-.464z" />
    </svg>
);

const StickyActions = React.memo(() => {
    const [pageLoaded, setPageLoaded] = useState(false);
    const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
    const btnRef = useRef(null);

    useEffect(() => {
        if (document.readyState === "complete") {
            setTimeout(() => setPageLoaded(true), 800);
        } else {
            const handleLoad = () => setTimeout(() => setPageLoaded(true), 1200);
            window.addEventListener("load", handleLoad);
            return () => window.removeEventListener("load", handleLoad);
        }
    }, []);

    const containerVariants = useMemo(
        () => ({
            hidden: { opacity: 0, y: 40, scale: 0.8 },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.5, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.08 },
            },
            exit: { opacity: 0, y: 30, scale: 0.8, transition: { duration: 0.2 } },
        }),
        []
    );

    const itemVariants = useMemo(
        () => ({
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
        }),
        []
    );

    const handleMouseMove = (e) => {
        const el = btnRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        setTilt({ rx: -(py - 0.5) * 10, ry: (px - 0.5) * 14 });
    };

    const handleMouseLeave = () => setTilt({ rx: 0, ry: 0 });

    return (
        <div className="fixed right-3 sm:right-4 md:right-5 bottom-6 sm:bottom-8 z-50 flex flex-col items-center gap-3">
            <AnimatePresence>
                {pageLoaded && (
                    <motion.div
                        className="flex flex-col items-center gap-3"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <style>{`
    @keyframes wa-float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
    }
    .wa-float {
        animation: wa-float 3s ease-in-out infinite;
    }
    .wa-float:hover {
        animation-play-state: paused;
    }
    .wa-tooltip {
        opacity: 0;
        transform: translateX(6px);
        transition: opacity 0.18s ease, transform 0.18s ease;
        pointer-events: none;
    }
    .wa-btn:hover .wa-tooltip {
        opacity: 1;
        transform: translateX(0px);
    }
`}</style>
                        <motion.a
                            href="https://wa.me/+923330555564"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Chat on WhatsApp"
                            title="Chat on WhatsApp"
                            ref={btnRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            variants={itemVariants}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.93 }}
                            className="wa-btn wa-float group relative h-11 w-11 sm:h-13 sm:w-13 md:h-14 md:w-14 rounded-full flex items-center justify-center"
                            style={{
                                background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                                boxShadow: "0 4px 24px rgba(37,211,102,0.35), 0 1.5px 6px rgba(18,140,126,0.18)",
                                transform: `perspective(700px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                                willChange: "transform",
                            }}
                        >
                            {/* Outer soft glow ring — always visible, breathing */}
                            <motion.span
                                aria-hidden
                                className="absolute inset-0 rounded-full pointer-events-none"
                                animate={{
                                    scale: [1, 1.35, 1],
                                    opacity: [0.18, 0.32, 0.18],
                                }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                                style={{
                                    background: "radial-gradient(circle, rgba(37,211,102,0.25) 0%, transparent 70%)",
                                }}
                            />

                            {/* Second ripple ring — offset timing */}
                            <motion.span
                                aria-hidden
                                className="absolute inset-0 rounded-full pointer-events-none"
                                animate={{
                                    scale: [1, 1.55, 1],
                                    opacity: [0.10, 0.20, 0.10],
                                }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                                style={{
                                    background: "radial-gradient(circle, rgba(37,211,102,0.15) 0%, transparent 70%)",
                                }}
                            />

                            {/* Tap ripple */}
                            <motion.span
                                className="absolute inset-0 rounded-full pointer-events-none"
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileTap={{ scale: 2.0, opacity: 0.2 }}
                                transition={{ duration: 0.3 }}
                                style={{ background: "rgba(255,255,255,0.3)" }}
                            />

                            {/* Icon */}
                            <div className="relative z-10 flex items-center justify-center">
                                <WhatsAppIcon />
                            </div>

                            {/* Tooltip — desktop only */}
                            <span
                                className="wa-tooltip hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold"
                                style={{
                                    background: "linear-gradient(135deg, #25D366, #128C7E)",
                                    color: "#fff",
                                    boxShadow: "0 2px 10px rgba(37,211,102,0.25)",
                                    zIndex: 20,
                                }}
                                aria-hidden="true"
                            >
                                Chat on WhatsApp
                                <span
                                    className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-0 h-0"
                                    style={{
                                        borderTop: "5px solid transparent",
                                        borderBottom: "5px solid transparent",
                                        borderLeft: "5px solid #128C7E",
                                    }}
                                />
                            </span>
                        </motion.a>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

export default StickyActions;
import React, { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WhatsAppIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-5 h-5 fill-gray-800 dark:fill-gray-100 group-hover:fill-white transition-colors duration-200"
    >
        <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.736 5.471 2.027 7.774L0 32l8.454-2.018A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.756-1.842l-.484-.287-5.016 1.197 1.234-4.874-.316-.5A13.226 13.226 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.354-1.162-2.719-1.294-.364-.133-.63-.199-.895.199-.265.398-1.029 1.294-1.261 1.56-.232.265-.465.298-.863.1-.398-.2-1.681-.619-3.2-1.974-1.183-1.054-1.981-2.356-2.213-2.754-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.697.2-.233.265-.399.398-.665.133-.265.066-.498-.033-.697-.1-.199-.895-2.156-1.227-2.952-.323-.775-.65-.67-.895-.682-.231-.01-.497-.013-.763-.013s-.697.1-1.062.498c-.364.398-1.393 1.361-1.393 3.318s1.427 3.85 1.626 4.116c.199.265 2.807 4.285 6.802 6.01.951.41 1.693.655 2.271.839.954.304 1.823.261 2.51.158.766-.114 2.354-.962 2.686-1.891.332-.928.332-1.724.232-1.891-.099-.166-.364-.265-.762-.464z" />
    </svg>
);

const StickyActions = React.memo(() => {
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        if (document.readyState === "complete") {
            setTimeout(() => setPageLoaded(true), 1000);
        } else {
            const handleLoad = () => setTimeout(() => setPageLoaded(true), 1500);
            window.addEventListener("load", handleLoad);
            return () => window.removeEventListener("load", handleLoad);
        }
    }, []);

    const containerVariants = useMemo(
        () => ({
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }),
        []
    );

    const itemVariants = useMemo(
        () => ({
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
        }),
        []
    );

    return (
        <div className="fixed right-2 md:right-[16px] bottom-6 z-50 flex flex-col items-center gap-3">
            <AnimatePresence>
                {pageLoaded && (
                    <motion.div
                        className="flex flex-col items-center gap-3 mt-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: 30, transition: { duration: 0.2 } }}
                    >
                        <motion.a
                            href="https://wa.me/+923330555564"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                            title="WhatsApp"
                            variants={itemVariants}
                            className="
                        group relative h-8 w-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
                        bg-gray-100 dark:bg-gray-800 shadow-sm
                        transition-transform duration-200 transform
                        hover:scale-110 hover:bg-gradient-to-tr from-green-400 to-green-600
                        "
                        >
                            <WhatsAppIcon />
                            <span
                                className="
                                    absolute right-full mr-2 top-1/2 -translate-y-1/2
                                    whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium
                                    bg-black/70 text-white opacity-0 group-hover:opacity-100
                                    translate-x-1 group-hover:translate-x-0
                                    transition-all duration-200
                                "
                                aria-hidden="true"
                            >
                                WhatsApp
                            </span>
                        </motion.a>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
});

export default StickyActions;
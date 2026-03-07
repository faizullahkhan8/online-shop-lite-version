import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

/**
 * HeroBanner — reusable page hero
 *
 * Props:
 *   tagline   {string}  — small label above heading   (default: "Natural Healthcare & Wellness")
 *   heading   {string}  — main h1 text                (default: "Natural Solutions for Healthy Living")
 *   subtext   {string}  — small description below line (default: "Safe, organic formulations…")
 *   className {string}  — extra classes on root div   (optional)
 */
const HeroBanner = ({
    tagline = "Natural Healthcare & Wellness",
    heading = "Natural Solutions for Healthy Living",
    subtext = "Safe, organic formulations crafted for balanced weight and overall wellness.",
    className = "",
}) => {
    return (
        <div
            className={`relative mt-10 w-full bg-[#f4f8f2] border-b border-[#e8f0e4] overflow-hidden ${className}`}
        >
            {/* Background blobs */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#d6eacc] opacity-40 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-8 w-48 h-48 rounded-full bg-[#e8f4e0] opacity-50 blur-2xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-14 md:py-16 flex flex-col items-center text-center">

                {/* Tagline */}
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.4em] text-[#7aaf68] mb-3"
                >
                    <Leaf size={10} /> {tagline}
                </motion.span>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.08 }}
                    className="text-2xl md:text-3xl font-light tracking-[0.25em] uppercase text-[#1a2e1a] mb-3"
                >
                    {heading}
                </motion.h1>

                {/* Divider line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
                    className="w-10 h-px bg-[#b5d4a6] mb-3 origin-center"
                />

                {/* Subtext */}
                {subtext && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs text-stone-400 tracking-widest"
                    >
                        {subtext}
                    </motion.p>
                )}
            </div>
        </div>
    );
};

export default HeroBanner;
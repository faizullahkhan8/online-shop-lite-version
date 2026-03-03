/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
    Facebook,
    Twitter,
    Instagram,
    Mail,
    ArrowRight,
    Leaf,
    Sparkles,
    ChevronDown,
    Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCollections } from "../../features/collections/collection.queries";

/* ─── Animation Variants ─── */
const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay },
    }),
};

const accordionVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
        height: "auto",
        opacity: 1,
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
        height: 0,
        opacity: 0,
        transition: { duration: 1, ease: [0.4, 0, 1, 1] },
    },
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const linkItem = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
};

/* ─── Component ─── */
const Footer = () => {
    const { data, isLoading } = useCollections({ isActive: true });

    const [openSection, setOpenSection] = useState(null);
    const [emailFocused, setEmailFocused] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [footerSections, setFooterSections] = useState([
        {
            title: "Sanctuary",
            links: [
                { name: "About", href: "/about-us" },
                { name: "Products", href: "/products" },
                { name: "Track Order", href: "/track-order" },
            ],
        },
    ]);

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    useEffect(() => {
        if (data && data?.collections) {
            setFooterSections([
                {
                    title: "Sanctuary",
                    links: [
                        { name: "About", href: "/about-us" },
                        { name: "Products", href: "/products" },
                        { name: "Collections", href: "/collections" },
                        { name: "Track Order", href: "/track-order" },
                    ],
                },
                {
                    title: "Collections",
                    links: data.collections.map((collection) => ({
                        name: collection?.name,
                        href: `/products?collection=${collection?._id}`,
                    })),
                },
            ]);
        }
    }, [data]);

    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
    };

    const handleSubmit = () => {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <footer
            ref={ref}
            className="relative w-full bg-[#F1F8ED] text-[#2d3a2d] border-t border-stone-100 overflow-hidden"
        >
            {/* Ambient Background */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.6 } : {}}
                transition={{ duration: 1.2 }}
                className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-200 h-75 bg-[#f2f7ef] rounded-[100%] blur-[120px] -z-10"
            />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 md:pt-20 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                    {/* ── Brand + Social Container (right side on desktop) ── */}
                    <motion.div
                        custom={0}
                        variants={fadeUp}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="lg:col-span-4 lg:order-first flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
                    >
                        {/* Brand */}
                        <Link to="/" className="group">
                            <div className="space-y-1">
                                <motion.h2 className="text-2xl font-light tracking-[0.4em] uppercase text-[#1a2e1a] transition-colors duration-300 group-hover:text-[#7aaf68]">
                                    Askar
                                </motion.h2>
                                <p className="text-[10px] tracking-[0.3em] uppercase text-[#7aaf68] font-medium flex items-center justify-center lg:justify-end gap-2">
                                    <motion.span
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2.5,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <Leaf size={12} />
                                    </motion.span>
                                    Essence of Purity
                                </p>
                            </div>
                        </Link>

                        <motion.p
                            custom={0.1}
                            variants={fadeUp}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            className="text-stone-500 text-sm leading-relaxed font-light max-w-xs"
                        >
                            Crafting a bridge between ancient botanical wisdom
                            and modern dermatological science.
                        </motion.p>

                        {/* Social Icons */}
                        <motion.div
                            className="flex gap-3 flex-wrap justify-center lg:justify-start"
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.08,
                                        delayChildren: 0.3,
                                    },
                                },
                            }}
                        >
                            {[
                                {
                                    icon: <Instagram size={16} />,
                                    label: "Instagram",
                                    href: "#",
                                },
                                {
                                    icon: <Facebook size={16} />,
                                    label: "Facebook",
                                    href: "#",
                                },
                                {
                                    icon: <Twitter size={16} />,
                                    label: "Twitter",
                                    href: "#",
                                },
                                {
                                    icon: (
                                        // TikTok SVG — not in lucide
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-4 h-4 fill-current"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
                                        </svg>
                                    ),
                                    label: "TikTok",
                                    href: "#",
                                },
                                {
                                    icon: <Phone size={16} />,
                                    label: "Phone",
                                    href: "tel:+923330555564",
                                },
                            ].map((item, i) => (
                                <motion.a
                                    key={i}
                                    href={item.href}
                                    aria-label={item.label}
                                    title={item.label}
                                    variants={{
                                        hidden: { opacity: 0, y: 8 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: { duration: 0.4 },
                                        },
                                    }}
                                    whileHover={{ y: -3, color: "#7aaf68" }}
                                    className="w-9 h-9 rounded-full bg-white/60 border border-stone-200 flex items-center justify-center text-stone-400 hover:border-[#7aaf68] hover:bg-[#f0f7ed] transition-colors duration-300"
                                >
                                    {item.icon}
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* ── Navigation ── */}
                    <motion.div
                        custom={0.15}
                        variants={fadeUp}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="lg:col-span-8 lg:order-last flex flex-1 justify-center flex-col md:flex-row gap-4 lg:gap-12 "
                    >
                        {footerSections.map((section, idx) => (
                            <div
                                key={idx}
                                className="border-b flex flex-col  border-stone-100 lg:border-none"
                            >
                                <button
                                    onClick={() => toggleSection(idx)}
                                    className="w-full flex justify-between items-center py-4 lg:py-0 lg:mb-6 group"
                                >
                                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1a2e1a]">
                                        {section.title}
                                    </h4>
                                    <motion.span
                                        animate={{
                                            rotate:
                                                openSection === idx ? 180 : 0,
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeInOut",
                                        }}
                                        className="lg:hidden"
                                    >
                                        <ChevronDown size={16} />
                                    </motion.span>
                                </button>

                                {/* Mobile accordion */}
                                <AnimatePresence initial={false}>
                                    <div className="lg:hidden">
                                        {openSection === idx && (
                                            <motion.ul
                                                key="mobile"
                                                variants={accordionVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="overflow-hidden space-y-4 pb-4"
                                            >
                                                {section.links.map(
                                                    (link, lIdx) => (
                                                        <motion.li
                                                            key={lIdx}
                                                            variants={linkItem}
                                                        >
                                                            <Link
                                                                to={link.href}
                                                                className="text-sm text-stone-500 hover:text-[#7aaf68] transition-colors font-light"
                                                            >
                                                                {link.name}
                                                            </Link>
                                                        </motion.li>
                                                    ),
                                                )}
                                            </motion.ul>
                                        )}
                                    </div>
                                </AnimatePresence>

                                {/* Desktop */}
                                <motion.ul
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate={isInView ? "visible" : "hidden"}
                                    className="hidden lg:block space-y-4"
                                >
                                    {section.links.map((link, lIdx) => (
                                        <motion.li
                                            key={lIdx}
                                            variants={linkItem}
                                        >
                                            <Link
                                                to={link.href}
                                                className="text-sm text-stone-500 hover:text-[#7aaf68] transition-colors font-light relative group"
                                            >
                                                <span>{link.name}</span>
                                                <motion.span
                                                    className="absolute -bottom-0.5 left-0 h-px bg-[#7aaf68]"
                                                    initial={{ width: 0 }}
                                                    whileHover={{
                                                        width: "100%",
                                                    }}
                                                    transition={{
                                                        duration: 0.25,
                                                    }}
                                                />
                                            </Link>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* ── Bottom Bar ── */}
                <motion.div
                    custom={0.45}
                    variants={fadeUp}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="mt-16 pt-8 border-t border-stone-100 flex justify-center items-center"
                >
                    <p className="text-stone-400 text-[10px] uppercase tracking-[0.2em] font-light">
                        © 2026 Askar Wellness.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;

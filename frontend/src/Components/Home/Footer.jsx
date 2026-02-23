/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";

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
    const [openSection, setOpenSection] = useState(null);
    const [emailFocused, setEmailFocused] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    const footerSections = [
        {
            title: "Sanctuary",
            links: [
                { name: "Our Story", href: "/about-us" },
                { name: "The Lab", href: "/products" },
                { name: "Collections", href: "/collections" },
                { name: "Track Ritual", href: "/track-order" },
            ],
        },
        {
            title: "Support",
            links: [
                { name: "Shipping", href: "#" },
                { name: "Returns", href: "#" },
                { name: "FAQ", href: "#" },
                { name: "Contact", href: "#" },
            ],
        },
    ];

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
                    {/* ── Brand Section ── */}
                    <motion.div
                        custom={0}
                        variants={fadeUp}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
                    >
                        <Link to="/" className="group">
                            <div className="space-y-1">
                                <motion.h2
                                    whileHover={{ letterSpacing: "0.5em" }}
                                    transition={{
                                        duration: 0.4,
                                        ease: "easeOut",
                                    }}
                                    className="text-2xl font-light tracking-[0.4em] uppercase text-[#1a2e1a]"
                                >
                                    Askar
                                </motion.h2>
                                <p className="text-[10px] tracking-[0.3em] uppercase text-[#7aaf68] font-medium flex items-center justify-center lg:justify-start gap-2">
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
                            className="text-stone-500 text-sm leading-relaxed font-light max-w-xs md:max-w-sm"
                        >
                            Crafting a bridge between ancient botanical wisdom
                            and modern dermatological science.
                        </motion.p>

                        <motion.div
                            className="flex gap-6"
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.1,
                                        delayChildren: 0.3,
                                    },
                                },
                            }}
                        >
                            {[
                                <Instagram size={18} />,
                                <Facebook size={18} />,
                                <Twitter size={18} />,
                            ].map((icon, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    variants={{
                                        hidden: { opacity: 0, y: 8 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: { duration: 0.4 },
                                        },
                                    }}
                                    whileHover={{ y: -3, color: "#7aaf68" }}
                                    className="text-stone-400 transition-colors duration-300"
                                >
                                    {icon}
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
                        className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8"
                    >
                        {footerSections.map((section, idx) => (
                            <div
                                key={idx}
                                className="border-b border-stone-100 lg:border-none"
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

                                {/* Desktop – always visible with stagger */}
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

                    {/* ── Newsletter ── */}
                    <motion.div
                        custom={0.3}
                        variants={fadeUp}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="lg:col-span-4 mt-4 lg:mt-0"
                    >
                        <motion.div
                            whileHover={{
                                boxShadow: "0 8px 32px rgba(122,175,104,0.10)",
                            }}
                            transition={{ duration: 0.4 }}
                            className="bg-[#f8faf7] p-6 md:p-8 rounded-3xl border border-[#eef3eb]"
                        >
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">
                                Join The Inner Circle
                            </h4>
                            <p className="text-xs text-stone-500 font-light mb-6">
                                10% off your first ritual. No spam, just
                                botanicals.
                            </p>

                            <div className="relative">
                                <motion.input
                                    type="email"
                                    placeholder="Your email"
                                    onFocus={() => setEmailFocused(true)}
                                    onBlur={() => setEmailFocused(false)}
                                    animate={{
                                        borderColor: emailFocused
                                            ? "#7aaf68"
                                            : "#e7e5e4",
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full bg-white border py-3 px-4 rounded-xl text-sm outline-none"
                                    style={{ borderWidth: 1 }}
                                />
                                <motion.button
                                    onClick={handleSubmit}
                                    whileHover={{
                                        scale: 1.08,
                                        backgroundColor: "#2e4a2e",
                                    }}
                                    whileTap={{ scale: 0.94 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1a2e1a] text-white rounded-lg flex items-center justify-center overflow-hidden"
                                >
                                    <AnimatePresence mode="wait">
                                        {submitted ? (
                                            <motion.span
                                                key="check"
                                                initial={{
                                                    scale: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    scale: 1,
                                                    opacity: 1,
                                                }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="text-[#7aaf68] text-xs font-bold"
                                            >
                                                ✓
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="arrow"
                                                initial={{ x: -8, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: 8, opacity: 0 }}
                                            >
                                                <ArrowRight size={18} />
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* ── Bottom Bar ── */}
                <motion.div
                    custom={0.45}
                    variants={fadeUp}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="mt-16 pt-8 border-t border-stone-100 flex flex-col-reverse md:flex-row justify-between items-center gap-8"
                >
                    <p className="text-stone-400 text-[10px] uppercase tracking-[0.2em] font-light">
                        © 2026 Askar Wellness.
                    </p>
                    <div className="flex gap-6 text-[10px] uppercase tracking-widest text-stone-500 font-medium">
                        {["Privacy", "Terms"].map((label, i) => (
                            <motion.a
                                key={i}
                                href="#"
                                whileHover={{ color: "#7aaf68" }}
                                transition={{ duration: 0.2 }}
                            >
                                {label}
                            </motion.a>
                        ))}
                        <div className="hidden md:block w-px h-3 bg-stone-200" />
                        <motion.span
                            className="flex items-center gap-1"
                            whileHover={{ color: "#7aaf68" }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.span
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 3,
                                    ease: "easeInOut",
                                }}
                            >
                                <Sparkles size={10} />
                            </motion.span>
                            Beauty Bio
                        </motion.span>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;

// import { useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
// import Breadcrumb from "../Components/Breadcrumb.jsx";
// import TestAvatar from "../assets/images/avatar.jpg";

// const AboutUs = () => {
//     const breadcrumbItems = [
//         { label: "Home", path: "/" },
//         { label: "About Us" },
//     ];
//     const businessEmail = "faizullahofficial0@gmail.com";

//     const [formData, setFormData] = useState({
//         name: "",
//         message: "",
//     });

//     const gmailUrl = useMemo(() => {
//         const subject = encodeURIComponent(`Contact Inquiry: ${formData.name}`);
//         const body = encodeURIComponent(
//             `Name: ${formData.name}\n` +
//             `---------------------------\n` +
//             `Message:\n${formData.message}`,
//         );

//         return (
//             `https://mail.google.com/mail/?view=cm&fs=1` +
//             `&to=${businessEmail}&su=${subject}&body=${body}`
//         );
//     }, [businessEmail, formData.name, formData.message]);

//     const handleSendEmail = (e) => {
//         e.preventDefault();
//         window.open(gmailUrl, "_blank", "noopener,noreferrer");
//     };

//     return (
//         <div className="min-h-screen bg-white">
//             <div className="container mx-auto px-4 lg:px-12 py-12">
//                 <Breadcrumb items={breadcrumbItems} />
//                 <div className="max-w-4xl">
//                     <h1 className="text-2xl font-bold uppercase tracking-[0.3em] text-zinc-700 mb-4">
//                         Our Story
//                     </h1>
//                     <p className="text-zinc-700 text-sm leading-relaxed mb-10 tracking-wide">At <span className="font-bold">Askar.pk</span>, we believe that good health should be simple, natural, and trustworthy.
//                         We offer 100% natural and organic healthcare products designed to support healthy weight gain and effective weight management. Our approach is honest and balanced focusing on safe formulations made with pure, organic ingredients that work in harmony with your body.
//                         Every product at <span className="font-bold">Askar.pk</span> is created with care, quality, and your well-being in mind. No harsh chemicals, no false claims just natural support for a healthier and more confident you.
//                         <span className="font-bold"> Askar.pk</span> natural care for a balanced, healthier life.</p>
//                 </div>
//             </div>

//             <section className="py-14 bg-[#fafafa] border-y border-zinc-100">
//                 <div className="container mx-auto px-4 lg:px-12">
//                     <div className="grid lg:grid-cols-2 gap-12 items-center">
//                         <div className="aspect-4/4 bg-[#f5f5f5] overflow-hidden relative group cursor-pointer">
//                             <img
//                                 src={TestAvatar}
//                                 alt="Faiz Ullah Khan"
//                                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 rounded-2xl"
//                             />
//                             <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2">
//                                 <span className="text-sm uppercase tracking-[0.2em] font-medium">Founder</span>
//                             </div>
//                         </div>

//                         <div className="lg:pl-12">
//                             <h2 className="text-2xl uppercase tracking-[0.2em] font-bold text-zinc-900 mb-6">
//                                 Faiz Ullah Khan
//                             </h2>
//                             <p className="text-zinc-700 text-sm leading-relaxed mb-10 tracking-wide">
//                                 A visionary entrepreneur dedicated to revolutionizing the e-commerce experience. With a focus on editorial presentation and premium logistics, Faiz founded E-Shop to serve as a bridge between high-fashion standards and accessible retail.
//                             </p>

//                             <div className="space-y-8">
//                                 <div className="flex items-center gap-6">
//                                     <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center text-zinc-900 border border-zinc-100">
//                                         <Mail size={16} strokeWidth={1.5} />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm uppercase tracking-widest text-zinc-700 mb-1">Inquiries</p>
//                                         <p className="text-md font-medium tracking-wider text-zinc-900">{businessEmail}</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-6">
//                                     <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center text-zinc-900 border border-zinc-100">
//                                         <Phone size={16} strokeWidth={1.5} />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm uppercase tracking-widest text-zinc-700 mb-1">Direct Contact 1</p>
//                                         <p className="text-md font-medium uppercase tracking-wider text-zinc-900">+92 333 976 4520</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-6">
//                                     <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center text-zinc-900 border border-zinc-100">
//                                         <Phone size={16} strokeWidth={1.5} />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm uppercase tracking-widest text-zinc-700 mb-1">Direct Contact 2</p>
//                                         <p className="text-md font-medium uppercase tracking-wider text-zinc-900">+92 310 099 3568</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-6">
//                                     <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center text-zinc-900 border border-zinc-100">
//                                         <Phone size={16} strokeWidth={1.5} />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm uppercase tracking-widest text-zinc-700 mb-1">Direct Contact 3</p>
//                                         <p className="text-md font-medium uppercase tracking-wider text-zinc-900">+92 333 929 7965</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             <section className="py-24 border-y border-zinc-100">
//                 <div className="container mx-auto px-4 lg:px-12 text-center">

//                     <h3 className="text-3xl font-light text-zinc-900 mb-10">Discover our latest editorial collections.</h3>
//                     <Link
//                         to="/collections"
//                         className="inline-flex items-center rounded-2xl gap-4 bg-zinc-900 text-white px-10 py-4 text-md uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all"
//                     >
//                         Browse Collections
//                         <ArrowRight size={14} />
//                     </Link>
//                 </div>
//             </section>

//             <section className="py-14 bg-[#fafafa] border border-zinc-100">
//                 <div className="container mx-auto px-4 lg:px-12">
//                     <div className="flex flex-col">
//                         <div className="lg:col-span-4">
//                             <h2 className="text-2xl uppercase tracking-[0.2em] font-bold text-zinc-900 mb-4">
//                                 Contact Us
//                             </h2>
//                         </div>

//                         <div className="lg:col-span-8 bg-white p-10 lg:p-16 border rounded-2xl border-zinc-100 shadow-sm">
//                             <h3 className="text-md uppercase tracking-[0.2em] font-medium text-zinc-900 mb-10">
//                                 Send a Message
//                             </h3>
//                             <form onSubmit={handleSendEmail} className="space-y-12">
//                                 <div className="relative border-b border-zinc-200 pb-2 focus-within:border-zinc-900 transition-colors">
//                                     <label className="text-sm uppercase tracking-widest text-zinc-700 block mb-2">Name</label>
//                                     <input
//                                         type="text"
//                                         required
//                                         value={formData.name}
//                                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                         placeholder="GUEST NAME"
//                                         className="w-full bg-transparent outline-none text-[12px] uppercase tracking-widest text-zinc-900 placeholder-zinc-400"
//                                     />
//                                 </div>

//                                 <div className="relative border-b border-zinc-200 pb-2 focus-within:border-zinc-900 transition-colors">
//                                     <label className="text-sm uppercase tracking-widest text-zinc-700 block mb-2">Message</label>
//                                     <textarea
//                                         required
//                                         rows={4}
//                                         value={formData.message}
//                                         onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//                                         placeholder="HOW CAN WE ASSIST YOU?"
//                                         className="w-full bg-transparent outline-none text-[12px] uppercase tracking-widest text-zinc-900 placeholder-zinc-400 resize-none"
//                                     />
//                                 </div>

//                                 <button
//                                     type="submit"
//                                     className="w-full py-4 rounded-2xl bg-zinc-900 text-white text-sm uppercase tracking-[0.3em] font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-3"
//                                 >
//                                     Submit via Gmail
//                                     <ArrowRight size={14} />
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// };

// export default AboutUs;

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone, Leaf } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Breadcrumb from "../Components/Breadcrumb.jsx";
import TestAvatar from "../assets/images/avatar.jpg";

/* ─── Variants ─── */
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (d = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: d },
    }),
};

const AboutUs = () => {
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "About Us" },
    ];
    const businessEmail = "faizullahofficial0@gmail.com";

    const [formData, setFormData] = useState({ name: "", message: "" });

    const gmailUrl = useMemo(() => {
        const subject = encodeURIComponent(`Contact Inquiry: ${formData.name}`);
        const body = encodeURIComponent(
            `Name: ${formData.name}\n` +
                `---------------------------\n` +
                `Message:\n${formData.message}`,
        );
        return (
            `https://mail.google.com/mail/?view=cm&fs=1` +
            `&to=${businessEmail}&su=${subject}&body=${body}`
        );
    }, [businessEmail, formData.name, formData.message]);

    const handleSendEmail = (e) => {
        e.preventDefault();
        window.open(gmailUrl, "_blank", "noopener,noreferrer");
    };

    /* InView refs */
    const heroRef = useRef(null);
    const founderRef = useRef(null);
    const ctaRef = useRef(null);
    const contactRef = useRef(null);

    const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
    const founderInView = useInView(founderRef, {
        once: true,
        margin: "-60px",
    });
    const ctaInView = useInView(ctaRef, { once: true, margin: "-60px" });
    const contactInView = useInView(contactRef, {
        once: true,
        margin: "-60px",
    });

    const contactItems = [
        { label: "Inquiries", icon: <Mail size={15} />, value: businessEmail },
        {
            label: "Direct Contact 1",
            icon: <Phone size={15} />,
            value: "+92 333 976 4520",
        },
        {
            label: "Direct Contact 2",
            icon: <Phone size={15} />,
            value: "+92 310 099 3568",
        },
        {
            label: "Direct Contact 3",
            icon: <Phone size={15} />,
            value: "+92 333 929 7965",
        },
    ];

    return (
        <div className="min-h-screen bg-[#fdfdfb]">
            {/* ── Hero Banner ── */}
            <div className="relative w-full bg-[#f4f8f2] border-b border-[#e8f0e4] overflow-hidden">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#d6eacc] opacity-40 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-8 w-48 h-48 rounded-full bg-[#e8f4e0] opacity-50 blur-2xl pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-14 md:py-16 flex flex-col items-center text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-3"
                    >
                        <Leaf size={10} /> Pure Botanicals
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        className="text-2xl md:text-3xl font-light tracking-[0.25em] uppercase text-[#1a2e1a] mb-3"
                    >
                        Our Story
                    </motion.h1>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                            duration: 0.55,
                            ease: "easeOut",
                            delay: 0.2,
                        }}
                        className="w-10 h-px bg-[#b5d4a6] origin-center"
                    />
                </div>
            </div>

            {/* ── Story Text ── */}
            <section
                ref={heroRef}
                className="max-w-7xl mx-auto px-6 lg:px-12 py-14"
            >
                <Breadcrumb items={breadcrumbItems} />
                <motion.div
                    custom={0.1}
                    variants={fadeUp}
                    initial="hidden"
                    animate={heroInView ? "visible" : "hidden"}
                    className="max-w-3xl mt-8"
                >
                    <p className="text-stone-600 text-sm leading-loose tracking-wide">
                        At{" "}
                        <span className="font-semibold text-[#1a2e1a]">
                            Askar.pk
                        </span>
                        , we believe that good health should be simple, natural,
                        and trustworthy. We offer 100% natural and organic
                        healthcare products designed to support healthy weight
                        gain and effective weight management. Our approach is
                        honest and balanced focusing on safe formulations made
                        with pure, organic ingredients that work in harmony with
                        your body. Every product at{" "}
                        <span className="font-semibold text-[#1a2e1a]">
                            Askar.pk
                        </span>{" "}
                        is created with care, quality, and your well-being in
                        mind. No harsh chemicals, no false claims just natural
                        support for a healthier and more confident you.
                        <span className="font-semibold text-[#1a2e1a]">
                            {" "}
                            Askar.pk
                        </span>{" "}
                        natural care for a balanced, healthier life.
                    </p>
                </motion.div>
            </section>

            {/* ── Founder Section ── */}
            <section
                ref={founderRef}
                className="py-16 bg-[#f4f8f2] border-y border-[#e8f0e4]"
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Image */}
                        <motion.div
                            custom={0}
                            variants={fadeUp}
                            initial="hidden"
                            animate={founderInView ? "visible" : "hidden"}
                            className="aspect-square bg-[#eef6ea] overflow-hidden relative group cursor-pointer rounded-3xl"
                        >
                            <img
                                src={TestAvatar}
                                alt="Faiz Ullah Khan"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 rounded-3xl"
                            />
                            <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#e8f0e4]">
                                <span className="text-[10px] uppercase tracking-[0.25em] text-[#1a2e1a] font-medium">
                                    Founder
                                </span>
                            </div>
                        </motion.div>

                        {/* Info */}
                        <motion.div
                            custom={0.1}
                            variants={fadeUp}
                            initial="hidden"
                            animate={founderInView ? "visible" : "hidden"}
                            className="lg:pl-8"
                        >
                            <span className="text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-3 block">
                                Meet the Visionary
                            </span>
                            <h2 className="text-2xl font-light uppercase tracking-[0.2em] text-[#1a2e1a] mb-5">
                                Faiz Ullah Khan
                            </h2>
                            <div className="w-8 h-px bg-[#b5d4a6] mb-6" />
                            <p className="text-stone-500 text-sm leading-loose tracking-wide mb-10">
                                A visionary entrepreneur dedicated to
                                revolutionizing the e-commerce experience. With
                                a focus on editorial presentation and premium
                                logistics, Faiz founded E-Shop to serve as a
                                bridge between high-fashion standards and
                                accessible retail.
                            </p>

                            <div className="space-y-5">
                                {contactItems.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        custom={0.1 + i * 0.07}
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate={
                                            founderInView ? "visible" : "hidden"
                                        }
                                        className="flex items-center gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-2xl bg-white border border-[#dcebd5] flex items-center justify-center text-[#7aaf68] shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-0.5">
                                                {item.label}
                                            </p>
                                            <p className="text-sm font-medium tracking-wider text-[#1a2e1a]">
                                                {item.value}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section ref={ctaRef} className="py-24 border-b border-[#e8f0e4]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
                    <motion.span
                        custom={0}
                        variants={fadeUp}
                        initial="hidden"
                        animate={ctaInView ? "visible" : "hidden"}
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-4 block"
                    >
                        <Leaf size={10} /> Curated For You
                    </motion.span>
                    <motion.h3
                        custom={0.1}
                        variants={fadeUp}
                        initial="hidden"
                        animate={ctaInView ? "visible" : "hidden"}
                        className="text-2xl md:text-3xl font-light text-[#1a2e1a] tracking-wide mb-3"
                    >
                        Discover our latest editorial collections.
                    </motion.h3>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={ctaInView ? { scaleX: 1 } : {}}
                        transition={{
                            duration: 0.55,
                            ease: "easeOut",
                            delay: 0.2,
                        }}
                        className="w-10 h-px bg-[#b5d4a6] mx-auto mb-8 origin-center"
                    />
                    <motion.div
                        custom={0.25}
                        variants={fadeUp}
                        initial="hidden"
                        animate={ctaInView ? "visible" : "hidden"}
                    >
                        <Link
                            to="/collections"
                            className="inline-flex items-center gap-4 bg-[#1a2e1a] text-white px-10 py-4 rounded-2xl text-[10px] uppercase tracking-[0.25em] hover:bg-[#2e4a2e] transition-colors"
                        >
                            Browse Collections
                            <ArrowRight size={13} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ── Contact Form ── */}
            <section
                ref={contactRef}
                className="py-16 bg-[#f4f8f2] border-b border-[#e8f0e4]"
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Left label */}
                        <motion.div
                            custom={0}
                            variants={fadeUp}
                            initial="hidden"
                            animate={contactInView ? "visible" : "hidden"}
                            className="lg:col-span-4 flex flex-col justify-start pt-2"
                        >
                            <span className="text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-3 block">
                                Reach Out
                            </span>
                            <h2 className="text-2xl font-light uppercase tracking-[0.2em] text-[#1a2e1a] mb-4">
                                Contact Us
                            </h2>
                            <div className="w-8 h-px bg-[#b5d4a6] mb-5" />
                            <p className="text-xs text-stone-400 leading-loose tracking-wide">
                                Have a question about our products or your
                                order? We're here to help. Drop us a message and
                                we'll get back to you.
                            </p>
                        </motion.div>

                        {/* Form */}
                        <motion.div
                            custom={0.12}
                            variants={fadeUp}
                            initial="hidden"
                            animate={contactInView ? "visible" : "hidden"}
                            className="lg:col-span-8 bg-white p-8 lg:p-12 border border-[#e8f0e4] rounded-3xl"
                        >
                            <h3 className="text-xs uppercase tracking-[0.25em] font-medium text-[#1a2e1a] mb-8">
                                Send a Message
                            </h3>

                            <form
                                onSubmit={handleSendEmail}
                                className="space-y-10"
                            >
                                <div className="relative border-b border-[#dcebd5] pb-2 focus-within:border-[#7aaf68] transition-colors">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-stone-400 block mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="GUEST NAME"
                                        className="w-full bg-transparent outline-none text-[11px] uppercase tracking-widest text-[#1a2e1a] placeholder-stone-300"
                                    />
                                </div>

                                <div className="relative border-b border-[#dcebd5] pb-2 focus-within:border-[#7aaf68] transition-colors">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-stone-400 block mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                message: e.target.value,
                                            })
                                        }
                                        placeholder="HOW CAN WE ASSIST YOU?"
                                        className="w-full bg-transparent outline-none text-[11px] uppercase tracking-widest text-[#1a2e1a] placeholder-stone-300 resize-none"
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    whileHover={{
                                        scale: 1.02,
                                        backgroundColor: "#2e4a2e",
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full py-4 rounded-2xl bg-[#1a2e1a] text-white text-[10px] uppercase tracking-[0.3em] font-medium transition-colors flex items-center justify-center gap-3"
                                >
                                    Submit via Gmail
                                    <ArrowRight size={13} />
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;

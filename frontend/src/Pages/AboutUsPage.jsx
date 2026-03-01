
// import { useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import { ArrowRight, Mail, MapPin, Phone, Leaf, ShieldCheck, Heart } from "lucide-react";
// import { motion, useInView } from "framer-motion";
// import { useRef } from "react";
// import Breadcrumb from "../Components/Breadcrumb.jsx";
// import TestAvatar from "../assets/images/avatar.jpg";








// /* ─── Variants ─── */
// const fadeUp = {
//     hidden: { opacity: 0, y: 24 },
//     visible: (d = 0) => ({
//         opacity: 1,
//         y: 0,
//         transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: d },
//     }),
// };














// const AboutUs = () => {
//     const breadcrumbItems = [
//         { label: "Home", path: "/" },
//         { label: "About Us" },
//     ];
//     const businessEmail = "faizullahofficial0@gmail.com";

//     const [formData, setFormData] = useState({ name: "", message: "" });

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

//     /* InView refs */
//     const heroRef = useRef(null);
//     const founderRef = useRef(null);
//     const ctaRef = useRef(null);
//     const contactRef = useRef(null);

//     const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
//     const founderInView = useInView(founderRef, {
//         once: true,
//         margin: "-60px",
//     });
//     const ctaInView = useInView(ctaRef, { once: true, margin: "-60px" });
//     const contactInView = useInView(contactRef, {
//         once: true,
//         margin: "-60px",
//     });

//     const contactItems = [
//         { label: "Inquiries", icon: <Mail size={15} />, value: businessEmail },
//         {
//             label: "Direct Contact 1",
//             icon: <Phone size={15} />,
//             value: "+92 333 976 4520",
//         },
//         {
//             label: "Direct Contact 2",
//             icon: <Phone size={15} />,
//             value: "+92 310 099 3568",
//         },
//         {
//             label: "Direct Contact 3",
//             icon: <Phone size={15} />,
//             value: "+92 333 929 7965",
//         },
//     ];

//     return (
//         // <div className="min-h-screen bg-[#fdfdfb]">
//         //     {/* ── Hero Banner ── */}
//         //     <div className="relative w-full bg-[#f4f8f2] border-b border-[#e8f0e4] overflow-hidden">
//         //         <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#d6eacc] opacity-40 blur-3xl pointer-events-none" />
//         //         <div className="absolute bottom-0 left-8 w-48 h-48 rounded-full bg-[#e8f4e0] opacity-50 blur-2xl pointer-events-none" />
//         //         <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-14 md:py-16 flex flex-col items-center text-center">
//         //             <motion.span
//         //                 initial={{ opacity: 0, y: 10 }}
//         //                 animate={{ opacity: 1, y: 0 }}
//         //                 transition={{ duration: 0.5 }}
//         //                 className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-3"
//         //             >
//         //                 <Leaf size={10} /> Pure Botanicals
//         //             </motion.span>
//         //             <motion.h1
//         //                 initial={{ opacity: 0, y: 14 }}
//         //                 animate={{ opacity: 1, y: 0 }}
//         //                 transition={{ duration: 0.55, delay: 0.08 }}
//         //                 className="text-2xl md:text-3xl font-light tracking-[0.25em] uppercase text-[#1a2e1a] mb-3"
//         //             >
//         //                 Our Story
//         //             </motion.h1>
//         //             <motion.div
//         //                 initial={{ scaleX: 0 }}
//         //                 animate={{ scaleX: 1 }}
//         //                 transition={{
//         //                     duration: 0.55,
//         //                     ease: "easeOut",
//         //                     delay: 0.2,
//         //                 }}
//         //                 className="w-10 h-px bg-[#b5d4a6] origin-center"
//         //             />
//         //         </div>
//         //     </div>

//         //     {/* ── Story Text ── */}
//         //     <section
//         //         ref={heroRef}
//         //         className="max-w-7xl mx-auto px-6 lg:px-12 py-14"
//         //     >
//         //         <Breadcrumb items={breadcrumbItems} />
//         //         <motion.div
//         //             custom={0.1}
//         //             variants={fadeUp}
//         //             initial="hidden"
//         //             animate={heroInView ? "visible" : "hidden"}
//         //             className="max-w-3xl mt-8"
//         //         >
//         //             <p className="text-stone-600 text-sm leading-loose tracking-wide">
//         //                 At{" "}
//         //                 <span className="font-semibold text-[#1a2e1a]">
//         //                     Askar.pk
//         //                 </span>
//         //                 , we believe that good health should be simple, natural,
//         //                 and trustworthy. We offer 100% natural and organic
//         //                 healthcare products designed to support healthy weight
//         //                 gain and effective weight management. Our approach is
//         //                 honest and balanced focusing on safe formulations made
//         //                 with pure, organic ingredients that work in harmony with
//         //                 your body. Every product at{" "}
//         //                 <span className="font-semibold text-[#1a2e1a]">
//         //                     Askar.pk
//         //                 </span>{" "}
//         //                 is created with care, quality, and your well-being in
//         //                 mind. No harsh chemicals, no false claims just natural
//         //                 support for a healthier and more confident you.
//         //                 <span className="font-semibold text-[#1a2e1a]">
//         //                     {" "}
//         //                     Askar.pk
//         //                 </span>{" "}
//         //                 natural care for a balanced, healthier life.
//         //             </p>
//         //         </motion.div>
//         //     </section>

//         //     {/* ── Founder Section ── */}
//         //     <section
//         //         ref={founderRef}
//         //         className="py-16 bg-[#f4f8f2] border-y border-[#e8f0e4]"
//         //     >
//         //         <div className="max-w-7xl mx-auto px-6 lg:px-12">
//         //             <div className="grid lg:grid-cols-2 gap-12 items-center">
//         //                 {/* Image */}
//         //                 <motion.div
//         //                     custom={0}
//         //                     variants={fadeUp}
//         //                     initial="hidden"
//         //                     animate={founderInView ? "visible" : "hidden"}
//         //                     className="aspect-square bg-[#eef6ea] overflow-hidden relative group cursor-pointer rounded-3xl"
//         //                 >
//         //                     <img
//         //                         src={TestAvatar}
//         //                         alt="Faiz Ullah Khan"
//         //                         className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 rounded-3xl"
//         //                     />
//         //                     <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#e8f0e4]">
//         //                         <span className="text-[10px] uppercase tracking-[0.25em] text-[#1a2e1a] font-medium">
//         //                             Founder
//         //                         </span>
//         //                     </div>
//         //                 </motion.div>

//         //                 {/* Info */}
//         //                 <motion.div
//         //                     custom={0.1}
//         //                     variants={fadeUp}
//         //                     initial="hidden"
//         //                     animate={founderInView ? "visible" : "hidden"}
//         //                     className="lg:pl-8"
//         //                 >
//         //                     <span className="text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-3 block">
//         //                         Meet the Visionary
//         //                     </span>
//         //                     <h2 className="text-2xl font-light uppercase tracking-[0.2em] text-[#1a2e1a] mb-5">
//         //                         Faiz Ullah Khan
//         //                     </h2>
//         //                     <div className="w-8 h-px bg-[#b5d4a6] mb-6" />
//         //                     <p className="text-stone-500 text-sm leading-loose tracking-wide mb-10">
//         //                         A visionary entrepreneur dedicated to
//         //                         revolutionizing the e-commerce experience. With
//         //                         a focus on editorial presentation and premium
//         //                         logistics, Faiz founded E-Shop to serve as a
//         //                         bridge between high-fashion standards and
//         //                         accessible retail.
//         //                     </p>

//         //                     <div className="space-y-5">
//         //                         {contactItems.map((item, i) => (
//         //                             <motion.div
//         //                                 key={i}
//         //                                 custom={0.1 + i * 0.07}
//         //                                 variants={fadeUp}
//         //                                 initial="hidden"
//         //                                 animate={
//         //                                     founderInView ? "visible" : "hidden"
//         //                                 }
//         //                                 className="flex items-center gap-4"
//         //                             >
//         //                                 <div className="w-10 h-10 rounded-2xl bg-white border border-[#dcebd5] flex items-center justify-center text-[#7aaf68] shrink-0">
//         //                                     {item.icon}
//         //                                 </div>
//         //                                 <div>
//         //                                     <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-0.5">
//         //                                         {item.label}
//         //                                     </p>
//         //                                     <p className="text-sm font-medium tracking-wider text-[#1a2e1a]">
//         //                                         {item.value}
//         //                                     </p>
//         //                                 </div>
//         //                             </motion.div>
//         //                         ))}
//         //                     </div>
//         //                 </motion.div>
//         //             </div>
//         //         </div>
//         //     </section>

//         //     {/* ── CTA Banner ── */}
//         //     <section ref={ctaRef} className="py-24 border-b border-[#e8f0e4]">
//         //         <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
//         //             <motion.span
//         //                 custom={0}
//         //                 variants={fadeUp}
//         //                 initial="hidden"
//         //                 animate={ctaInView ? "visible" : "hidden"}
//         //                 className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-4 block"
//         //             >
//         //                 <Leaf size={10} /> Curated For You
//         //             </motion.span>
//         //             <motion.h3
//         //                 custom={0.1}
//         //                 variants={fadeUp}
//         //                 initial="hidden"
//         //                 animate={ctaInView ? "visible" : "hidden"}
//         //                 className="text-2xl md:text-3xl font-light text-[#1a2e1a] tracking-wide mb-3"
//         //             >
//         //                 Discover our latest editorial collections.
//         //             </motion.h3>
//         //             <motion.div
//         //                 initial={{ scaleX: 0 }}
//         //                 animate={ctaInView ? { scaleX: 1 } : {}}
//         //                 transition={{
//         //                     duration: 0.55,
//         //                     ease: "easeOut",
//         //                     delay: 0.2,
//         //                 }}
//         //                 className="w-10 h-px bg-[#b5d4a6] mx-auto mb-8 origin-center"
//         //             />
//         //             <motion.div
//         //                 custom={0.25}
//         //                 variants={fadeUp}
//         //                 initial="hidden"
//         //                 animate={ctaInView ? "visible" : "hidden"}
//         //             >
//         //                 <Link
//         //                     to="/collections"
//         //                     className="inline-flex items-center gap-4 bg-[#1a2e1a] text-white px-10 py-4 rounded-2xl text-[10px] uppercase tracking-[0.25em] hover:bg-[#2e4a2e] transition-colors"
//         //                 >
//         //                     Browse Collections
//         //                     <ArrowRight size={13} />
//         //                 </Link>
//         //             </motion.div>
//         //         </div>
//         //     </section>

//         //     {/* ── Contact Form ── */}
//         //     <section
//         //         ref={contactRef}
//         //         className="py-16 bg-[#f4f8f2] border-b border-[#e8f0e4]"
//         //     >
//         //         <div className="max-w-7xl mx-auto px-6 lg:px-12">
//         //             <div className="grid lg:grid-cols-12 gap-12">
//         //                 {/* Left label */}
//         //                 <motion.div
//         //                     custom={0}
//         //                     variants={fadeUp}
//         //                     initial="hidden"
//         //                     animate={contactInView ? "visible" : "hidden"}
//         //                     className="lg:col-span-4 flex flex-col justify-start pt-2"
//         //                 >
//         //                     <span className="text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-3 block">
//         //                         Reach Out
//         //                     </span>
//         //                     <h2 className="text-2xl font-light uppercase tracking-[0.2em] text-[#1a2e1a] mb-4">
//         //                         Contact Us
//         //                     </h2>
//         //                     <div className="w-8 h-px bg-[#b5d4a6] mb-5" />
//         //                     <p className="text-xs text-stone-400 leading-loose tracking-wide">
//         //                         Have a question about our products or your
//         //                         order? We're here to help. Drop us a message and
//         //                         we'll get back to you.
//         //                     </p>
//         //                 </motion.div>

//         //                 {/* Form */}
//         //                 <motion.div
//         //                     custom={0.12}
//         //                     variants={fadeUp}
//         //                     initial="hidden"
//         //                     animate={contactInView ? "visible" : "hidden"}
//         //                     className="lg:col-span-8 bg-white p-8 lg:p-12 border border-[#e8f0e4] rounded-3xl"
//         //                 >
//         //                     <h3 className="text-xs uppercase tracking-[0.25em] font-medium text-[#1a2e1a] mb-8">
//         //                         Send a Message
//         //                     </h3>

//         //                     <form
//         //                         onSubmit={handleSendEmail}
//         //                         className="space-y-10"
//         //                     >
//         //                         <div className="relative border-b border-[#dcebd5] pb-2 focus-within:border-[#7aaf68] transition-colors">
//         //                             <label className="text-[10px] uppercase tracking-[0.3em] text-stone-400 block mb-2">
//         //                                 Name
//         //                             </label>
//         //                             <input
//         //                                 type="text"
//         //                                 required
//         //                                 value={formData.name}
//         //                                 onChange={(e) =>
//         //                                     setFormData({
//         //                                         ...formData,
//         //                                         name: e.target.value,
//         //                                     })
//         //                                 }
//         //                                 placeholder="GUEST NAME"
//         //                                 className="w-full bg-transparent outline-none text-[11px] uppercase tracking-widest text-[#1a2e1a] placeholder-stone-300"
//         //                             />
//         //                         </div>

//         //                         <div className="relative border-b border-[#dcebd5] pb-2 focus-within:border-[#7aaf68] transition-colors">
//         //                             <label className="text-[10px] uppercase tracking-[0.3em] text-stone-400 block mb-2">
//         //                                 Message
//         //                             </label>
//         //                             <textarea
//         //                                 required
//         //                                 rows={4}
//         //                                 value={formData.message}
//         //                                 onChange={(e) =>
//         //                                     setFormData({
//         //                                         ...formData,
//         //                                         message: e.target.value,
//         //                                     })
//         //                                 }
//         //                                 placeholder="HOW CAN WE ASSIST YOU?"
//         //                                 className="w-full bg-transparent outline-none text-[11px] uppercase tracking-widest text-[#1a2e1a] placeholder-stone-300 resize-none"
//         //                             />
//         //                         </div>

//         //                         <motion.button
//         //                             type="submit"
//         //                             whileHover={{
//         //                                 scale: 1.02,
//         //                                 backgroundColor: "#2e4a2e",
//         //                             }}
//         //                             whileTap={{ scale: 0.98 }}
//         //                             transition={{ duration: 0.2 }}
//         //                             className="w-full py-4 rounded-2xl bg-[#1a2e1a] text-white text-[10px] uppercase tracking-[0.3em] font-medium transition-colors flex items-center justify-center gap-3"
//         //                         >
//         //                             Submit via Gmail
//         //                             <ArrowRight size={13} />
//         //                         </motion.button>
//         //                     </form>
//         //                 </motion.div>
//         //             </div>
//         //         </div>
//         //     </section>
//         // </div>













//         <div className="min-h-screen bg-[#fdfdfb]">

//             {/* ── Hero Banner ── */}
//             <div className="relative w-full bg-[#f4f8f2] border-b border-[#e8f0e4] overflow-hidden">
//                 <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#d6eacc] opacity-40 blur-3xl pointer-events-none" />
//                 <div className="absolute bottom-0 left-8 w-48 h-48 rounded-full bg-[#e8f4e0] opacity-50 blur-2xl pointer-events-none" />
//                 <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-14 md:py-16 flex flex-col items-center text-center">
//                     <motion.span
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                         className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-3"
//                     >
//                         <Leaf size={10} /> Natural Healthcare & Wellness
//                     </motion.span>

//                     <motion.h1
//                         initial={{ opacity: 0, y: 14 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.55, delay: 0.08 }}
//                         className="text-2xl md:text-3xl font-light tracking-[0.25em] uppercase text-[#1a2e1a] mb-3"
//                     >
//                         Natural Solutions for Healthy Living
//                     </motion.h1>

//                     <motion.div
//                         initial={{ scaleX: 0 }}
//                         animate={{ scaleX: 1 }}
//                         transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
//                         className="w-10 h-px bg-[#b5d4a6] mb-3 origin-center"
//                     />

//                     <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.3 }}
//                         className="text-xs text-stone-400 tracking-widest"
//                     >
//                         Safe, organic formulations crafted for balanced weight and overall wellness.
//                     </motion.p>
//                 </div>
//             </div>

//             {/* ── About Section ── */}
//             <section ref={aboutRef} className="max-w-5xl mx-auto px-6 lg:px-12 py-20 md:py-28">
//                 <motion.div
//                     custom={0.05}
//                     variants={fadeUp}
//                     initial="hidden"
//                     animate={aboutInView ? "visible" : "hidden"}
//                     className="flex flex-col items-center text-center mb-14"
//                 >
//                     <span className="text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-4 block">
//                         About Askar
//                     </span>
//                     <h2 className="text-2xl md:text-3xl font-light uppercase tracking-[0.2em] text-[#1a2e1a] mb-4">
//                         Our Commitment to Natural Wellness
//                     </h2>
//                     <div className="w-8 h-px bg-[#b5d4a6]" />
//                 </motion.div>

//                 <div className="grid md:grid-cols-3 gap-10">
//                     {[
//                         {
//                             title: "Who We Serve",
//                             body: "We support individuals looking for safe, effective solutions for healthy weight management and overall wellbeing — without compromising on what goes into their body.",
//                         },
//                         {
//                             title: "What Makes Us Different",
//                             body: "Every product is formulated using certified natural ingredients — free from harsh chemicals, synthetic additives, and misleading claims. Tested for purity, designed to work with your body.",
//                         },
//                         {
//                             title: "Our Brand Promise",
//                             body: "We believe healthcare should be honest and transparent. At Askar.pk, our promise is simple: genuine care, quality you can see, and products you can trust.",
//                         },
//                     ].map((item, i) => (
//                         <motion.div
//                             key={i}
//                             custom={0.1 + i * 0.08}
//                             variants={fadeUp}
//                             initial="hidden"
//                             animate={aboutInView ? "visible" : "hidden"}
//                             className="flex flex-col gap-3"
//                         >
//                             <div className="w-6 h-px bg-[#b5d4a6]" />
//                             <h3 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#1a2e1a]">
//                                 {item.title}
//                             </h3>
//                             <p className="text-stone-500 text-sm leading-loose">
//                                 {item.body}
//                             </p>
//                         </motion.div>
//                     ))}
//                 </div>
//             </section>

//             {/* ── Value Cards Section ── */}
//             <section ref={cardsRef} className="bg-[#f4f8f2] border-y border-[#e8f0e4] py-16 md:py-20">
//                 <div className="max-w-5xl mx-auto px-6 lg:px-12">

//                     <motion.div
//                         custom={0}
//                         variants={fadeUp}
//                         initial="hidden"
//                         animate={cardsInView ? "visible" : "hidden"}
//                         className="flex flex-col items-center text-center mb-12"
//                     >
//                         <span className="text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-4 block">
//                             Our Standards
//                         </span>
//                         <h2 className="text-xl md:text-2xl font-light uppercase tracking-[0.2em] text-[#1a2e1a] mb-4">
//                             Why Choose Askar.pk
//                         </h2>
//                         <div className="w-8 h-px bg-[#b5d4a6]" />
//                     </motion.div>

//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//                         {valueCards.map((val, i) => (
//                             <motion.div
//                                 key={i}
//                                 custom={0.08 + i * 0.08}
//                                 variants={fadeUp}
//                                 initial="hidden"
//                                 animate={cardsInView ? "visible" : "hidden"}
//                                 className="bg-white border border-[#dcebd5] rounded-2xl p-6 flex flex-col gap-3"
//                             >
//                                 <div className="w-9 h-9 rounded-xl bg-[#f4f8f2] border border-[#dcebd5] flex items-center justify-center text-[#7aaf68]">
//                                     {val.icon}
//                                 </div>
//                                 <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#1a2e1a]">
//                                     {val.label}
//                                 </p>
//                                 <p className="text-[12px] text-stone-400 leading-relaxed">
//                                     {val.desc}
//                                 </p>
//                             </motion.div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* ── Customer Support ── */}
//             <section ref={supportRef} className="max-w-5xl mx-auto px-6 lg:px-12 py-20 md:py-28">

//                 <motion.div
//                     custom={0}
//                     variants={fadeUp}
//                     initial="hidden"
//                     animate={supportInView ? "visible" : "hidden"}
//                     className="flex flex-col items-center text-center mb-14"
//                 >
//                     <span className="text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-4 block">
//                         Customer Support
//                     </span>
//                     <h2 className="text-2xl md:text-3xl font-light uppercase tracking-[0.2em] text-[#1a2e1a] mb-4">
//                         We're Here to Help
//                     </h2>
//                     <div className="w-8 h-px bg-[#b5d4a6]" />
//                 </motion.div>

//                 <div className="grid md:grid-cols-2 gap-12 items-start">

//                     {/* Contact Items */}
//                     <motion.div
//                         custom={0.08}
//                         variants={fadeUp}
//                         initial="hidden"
//                         animate={supportInView ? "visible" : "hidden"}
//                         className="space-y-5"
//                     >
//                         {contactItems.map((item, i) => (
//                             <div key={i} className="flex items-center gap-4">
//                                 <div className="w-10 h-10 rounded-2xl bg-[#f4f8f2] border border-[#dcebd5] flex items-center justify-center text-[#7aaf68] shrink-0">
//                                     {item.icon}
//                                 </div>
//                                 <div>
//                                     <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-0.5">
//                                         {item.label}
//                                     </p>
//                                     <p className="text-sm font-medium tracking-wide text-[#1a2e1a]">
//                                         {item.value}
//                                     </p>
//                                 </div>
//                             </div>
//                         ))}
//                     </motion.div>

//                     {/* WhatsApp CTA */}
//                     <motion.div
//                         custom={0.16}
//                         variants={fadeUp}
//                         initial="hidden"
//                         animate={supportInView ? "visible" : "hidden"}
//                         className="flex flex-col gap-5"
//                     >
//                         <p className="text-xs text-stone-400 leading-loose">
//                             Prefer a quicker response? Reach us on WhatsApp — our team typically replies within a few hours during business hours.
//                         </p>
//                         <motion.a
//                             href="https://wa.me/+923330555564"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             whileHover={{ scale: 1.02 }}
//                             whileTap={{ scale: 0.97 }}
//                             className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl text-white text-[10px] uppercase tracking-[0.25em] font-medium w-fit"
//                             style={{
//                                 background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
//                                 boxShadow: "0 4px 20px rgba(37,211,102,0.22)",
//                             }}
//                         >
//                             <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white shrink-0">
//                                 <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.736 5.471 2.027 7.774L0 32l8.454-2.018A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.756-1.842l-.484-.287-5.016 1.197 1.234-4.874-.316-.5A13.226 13.226 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.354-1.162-2.719-1.294-.364-.133-.63-.199-.895.199-.265.398-1.029 1.294-1.261 1.56-.232.265-.465.298-.863.1-.398-.2-1.681-.619-3.2-1.974-1.183-1.054-1.981-2.356-2.213-2.754-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.697.2-.233.265-.399.398-.665.133-.265.066-.498-.033-.697-.1-.199-.895-2.156-1.227-2.952-.323-.775-.65-.67-.895-.682-.231-.01-.497-.013-.763-.013s-.697.1-1.062.498c-.364.398-1.393 1.361-1.393 3.318s1.427 3.85 1.626 4.116c.199.265 2.807 4.285 6.802 6.01.951.41 1.693.655 2.271.839.954.304 1.823.261 2.51.158.766-.114 2.354-.962 2.686-1.891.332-.928.332-1.724.232-1.891-.099-.166-.364-.265-.762-.464z" />
//                             </svg>
//                             Chat on WhatsApp
//                         </motion.a>
//                     </motion.div>
//                 </div>
//             </section>

//             {/* ── Contact Form ── */}
//             <section ref={contactRef} className="bg-[#f4f8f2] border-t border-[#e8f0e4] py-16 md:py-24">
//                 <div className="max-w-2xl mx-auto px-6 lg:px-12">

//                     <motion.div
//                         custom={0}
//                         variants={fadeUp}
//                         initial="hidden"
//                         animate={contactInView ? "visible" : "hidden"}
//                         className="flex flex-col items-center text-center mb-12"
//                     >
//                         <span className="text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-4 block">
//                             Customer Inquiry
//                         </span>
//                         <h2 className="text-2xl font-light uppercase tracking-[0.2em] text-[#1a2e1a] mb-4">
//                             Send Us a Message
//                         </h2>
//                         <div className="w-8 h-px bg-[#b5d4a6] mb-5" />
//                         <p className="text-xs text-stone-400 leading-loose tracking-wide max-w-xs">
//                             Have questions about our products, ingredients, or your order? Our support team is ready to assist you.
//                         </p>
//                     </motion.div>

//                     <motion.div
//                         custom={0.1}
//                         variants={fadeUp}
//                         initial="hidden"
//                         animate={contactInView ? "visible" : "hidden"}
//                         className="bg-white border border-[#e8f0e4] rounded-3xl p-8 lg:p-12"
//                     >
//                         <form onSubmit={handleSendEmail} className="space-y-10">

//                             <div className="relative border-b border-[#dcebd5] pb-2 focus-within:border-[#7aaf68] transition-colors">
//                                 <label className="text-[10px] uppercase tracking-[0.3em] text-stone-400 block mb-2">
//                                     Full Name
//                                 </label>
//                                 <input
//                                     type="text"
//                                     required
//                                     placeholder="Your Full Name"
//                                     className="w-full bg-transparent outline-none text-[11px] tracking-wider text-[#1a2e1a] placeholder-stone-300"
//                                 />
//                             </div>

//                             <div className="relative border-b border-[#dcebd5] pb-2 focus-within:border-[#7aaf68] transition-colors">
//                                 <label className="text-[10px] uppercase tracking-[0.3em] text-stone-400 block mb-2">
//                                     Email Address
//                                 </label>
//                                 <input
//                                     type="email"
//                                     required
//                                     placeholder="your@email.com"
//                                     className="w-full bg-transparent outline-none text-[11px] tracking-wider text-[#1a2e1a] placeholder-stone-300"
//                                 />
//                             </div>

//                             <div className="relative border-b border-[#dcebd5] pb-2 focus-within:border-[#7aaf68] transition-colors">
//                                 <label className="text-[10px] uppercase tracking-[0.3em] text-stone-400 block mb-2">
//                                     Message
//                                 </label>
//                                 <textarea
//                                     required
//                                     rows={4}
//                                     placeholder="How can we assist you?"
//                                     className="w-full bg-transparent outline-none text-[11px] tracking-wider text-[#1a2e1a] placeholder-stone-300 resize-none"
//                                 />
//                             </div>

//                             <motion.button
//                                 type="submit"
//                                 whileHover={{ scale: 1.02, backgroundColor: "#2e4a2e" }}
//                                 whileTap={{ scale: 0.98 }}
//                                 transition={{ duration: 0.2 }}
//                                 className="w-full py-4 rounded-2xl bg-[#1a2e1a] text-white text-[10px] uppercase tracking-[0.3em] font-medium transition-colors flex items-center justify-center gap-3"
//                             >
//                                 Send Message
//                                 <ArrowRight size={13} />
//                             </motion.button>
//                         </form>
//                     </motion.div>

//                     <motion.p
//                         custom={0.18}
//                         variants={fadeUp}
//                         initial="hidden"
//                         animate={contactInView ? "visible" : "hidden"}
//                         className="text-center text-[10px] text-stone-400 tracking-widest mt-6 uppercase"
//                     >
//                         We typically respond within 24 hours.
//                     </motion.p>

//                 </div>
//             </section>

//         </div>
//     );







// };

// export default AboutUs;





































import { useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, Leaf, ShieldCheck, Heart } from "lucide-react";
import { motion, useInView } from "framer-motion";
import Breadcrumb from "../Components/Breadcrumb.jsx";
import TestAvatar from "../assets/images/avatar.jpg";
import HeroBanner from "../Components/HeroBanner.jsx";

/* ─── Variants ─── */
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (d = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: d },
    }),
};

/* ─── Static Data ─── */
const valueCards = [
    {
        icon: <Leaf size={15} />,
        label: "Certified Natural Ingredients",
        desc: "Sourced from trusted natural farms and tested for quality.",
    },
    {
        icon: <ShieldCheck size={15} />,
        label: "Clean & Safe Formulas",
        desc: "Gentle on your body — no harsh chemicals or synthetic fillers.",
    },
    {
        icon: <Heart size={15} />,
        label: "Ethically Crafted",
        desc: "Made with care, integrity, and your wellbeing in mind.",
    },
];

const AboutUs = () => {
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "About Us" },
    ];

    const businessEmail = "askardotpkoffice@gmail.com";

    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const gmailUrl = useMemo(() => {
        const subject = encodeURIComponent(`Contact Inquiry: ${formData.name}`);
        const body = encodeURIComponent(
            `Name: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `---------------------------\n` +
            `Message:\n${formData.message}`
        );
        return (
            `https://mail.google.com/mail/?view=cm&fs=1` +
            `&to=${businessEmail}&su=${subject}&body=${body}`
        );
    }, [businessEmail, formData.name, formData.email, formData.message]);

    const handleSendEmail = (e) => {
        e.preventDefault();
        window.open(gmailUrl, "_blank", "noopener,noreferrer");
    };

    /* ─── InView Refs ─── */
    const aboutRef = useRef(null);
    const cardsRef = useRef(null);
    const supportRef = useRef(null);
    const contactRef = useRef(null);

    const aboutInView = useInView(aboutRef, { once: true, margin: "-60px" });
    const cardsInView = useInView(cardsRef, { once: true, margin: "-60px" });
    const supportInView = useInView(supportRef, { once: true, margin: "-60px" });
    const contactInView = useInView(contactRef, { once: true, margin: "-60px" });

    const contactItems = [
        { label: "Inquiries", icon: <Mail size={15} />, value: businessEmail },
        { label: "Direct Contact 1", icon: <Phone size={15} />, value: "+92 333 976 4520" },
        { label: "Direct Contact 2", icon: <Phone size={15} />, value: "+92 310 099 3568" },
        { label: "Direct Contact 3", icon: <Phone size={15} />, value: "+92 333 929 7965" },
    ];

    return (
        <div className="min-h-screen bg-[#fdfdfb]">

            {/* ── Hero Banner ── */}
            {/* <div className="relative mt-10 w-full bg-[#f4f8f2] border-b border-[#e8f0e4] overflow-hidden">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#d6eacc] opacity-40 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-8 w-48 h-48 rounded-full bg-[#e8f4e0] opacity-50 blur-2xl pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-14 md:py-16 flex flex-col items-center text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-3"
                    >
                        <Leaf size={10} /> Natural Healthcare & Wellness
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        className="text-2xl md:text-3xl font-light tracking-[0.25em] uppercase text-[#1a2e1a] mb-3"
                    >
                        Natural Solutions for Healthy Living
                    </motion.h1>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
                        className="w-10 h-px bg-[#b5d4a6] mb-3 origin-center"
                    />

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs text-stone-400 tracking-widest"
                    >
                        Safe, organic formulations crafted for balanced weight and overall wellness.
                    </motion.p>
                </div>
            </div> */}

            <HeroBanner
                tagline="Natural Healthcare & Wellness"
                heading=" Natural Solutions for Healthy Living"
                subtext="Safe, organic formulations crafted for balanced weight and overall wellness."
            />

            {/* ── About Section ── */}
            <section ref={aboutRef} className="max-w-5xl mx-auto px-6 lg:px-12 py-20 md:py-28">
                <Breadcrumb items={breadcrumbItems} />

                <motion.div
                    custom={0.05}
                    variants={fadeUp}
                    initial="hidden"
                    animate={aboutInView ? "visible" : "hidden"}
                    className="flex flex-col items-center text-center mt-14 mb-14"
                >
                    <span className="text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-4 block">
                        About Askar
                    </span>
                    <h2 className="text-2xl md:text-3xl font-light uppercase tracking-[0.2em] text-[#1a2e1a] mb-4">
                        Our Commitment to Natural Wellness
                    </h2>
                    <div className="w-8 h-px bg-[#b5d4a6]" />
                </motion.div>

                <div className="grid md:grid-cols-3 gap-10">
                    {[
                        {
                            title: "Who We Serve",
                            body: "We support individuals looking for safe, effective solutions for healthy weight management and overall wellbeing — without compromising on what goes into their body.",
                        },
                        {
                            title: "What Makes Us Different",
                            body: "Every product is formulated using certified natural ingredients — free from harsh chemicals, synthetic additives, and misleading claims. Tested for purity, designed to work with your body.",
                        },
                        {
                            title: "Our Brand Promise",
                            body: "We believe healthcare should be honest and transparent. At Askar.pk, our promise is simple: genuine care, quality you can see, and products you can trust.",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            custom={0.1 + i * 0.08}
                            variants={fadeUp}
                            initial="hidden"
                            animate={aboutInView ? "visible" : "hidden"}
                            className="flex flex-col gap-3"
                        >
                            <div className="w-6 h-px bg-[#b5d4a6]" />
                            <h3 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#1a2e1a]">
                                {item.title}
                            </h3>
                            <p className="text-stone-500 text-sm leading-loose">
                                {item.body}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Value Cards Section ── */}
            <section ref={cardsRef} className="bg-[#f4f8f2] border-y border-[#e8f0e4] py-16 md:py-20">
                <div className="max-w-5xl mx-auto px-6 lg:px-12">

                    <motion.div
                        custom={0}
                        variants={fadeUp}
                        initial="hidden"
                        animate={cardsInView ? "visible" : "hidden"}
                        className="flex flex-col items-center text-center mb-12"
                    >
                        <span className="text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-4 block">
                            Our Standards
                        </span>
                        <h2 className="text-xl md:text-2xl font-light uppercase tracking-[0.2em] text-[#1a2e1a] mb-4">
                            Why Choose Askar.pk
                        </h2>
                        <div className="w-8 h-px bg-[#b5d4a6]" />
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {valueCards.map((val, i) => (
                            <motion.div
                                key={i}
                                custom={0.08 + i * 0.08}
                                variants={fadeUp}
                                initial="hidden"
                                animate={cardsInView ? "visible" : "hidden"}
                                className="bg-white border border-[#dcebd5] rounded-2xl p-6 flex flex-col gap-3"
                            >
                                <div className="w-9 h-9 rounded-xl bg-[#f4f8f2] border border-[#dcebd5] flex items-center justify-center text-[#7aaf68]">
                                    {val.icon}
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#1a2e1a]">
                                    {val.label}
                                </p>
                                <p className="text-[12px] text-stone-400 leading-relaxed">
                                    {val.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Customer Support ── */}
            <section ref={supportRef} className="max-w-5xl mx-auto px-6 lg:px-12 py-20 md:py-28">

                <motion.div
                    custom={0}
                    variants={fadeUp}
                    initial="hidden"
                    animate={supportInView ? "visible" : "hidden"}
                    className="flex flex-col items-center text-center mb-14"
                >
                    <span className="text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-4 block">
                        Customer Support
                    </span>
                    <h2 className="text-2xl md:text-3xl font-light uppercase tracking-[0.2em] text-[#1a2e1a] mb-4">
                        We're Here to Help
                    </h2>
                    <div className="w-8 h-px bg-[#b5d4a6]" />
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-start">

                    {/* Contact Items */}
                    <motion.div
                        custom={0.08}
                        variants={fadeUp}
                        initial="hidden"
                        animate={supportInView ? "visible" : "hidden"}
                        className="space-y-5"
                    >
                        {contactItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#f4f8f2] border border-[#dcebd5] flex items-center justify-center text-[#7aaf68] shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-0.5">
                                        {item.label}
                                    </p>
                                    <p className="text-sm font-medium tracking-wide text-[#1a2e1a]">
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* WhatsApp CTA */}
                    <motion.div
                        custom={0.16}
                        variants={fadeUp}
                        initial="hidden"
                        animate={supportInView ? "visible" : "hidden"}
                        className="flex flex-col gap-5"
                    >
                        <p className="text-xs text-stone-400 leading-loose">
                            Prefer a quicker response? Reach us on WhatsApp — our team typically replies within a few hours during business hours.
                        </p>
                        <motion.a
                            href="https://wa.me/+923330555564"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl text-white text-[10px] uppercase tracking-[0.25em] font-medium w-fit"
                            style={{
                                background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                                boxShadow: "0 4px 20px rgba(37,211,102,0.22)",
                            }}
                        >
                            <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white shrink-0">
                                <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.736 5.471 2.027 7.774L0 32l8.454-2.018A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.756-1.842l-.484-.287-5.016 1.197 1.234-4.874-.316-.5A13.226 13.226 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.354-1.162-2.719-1.294-.364-.133-.63-.199-.895.199-.265.398-1.029 1.294-1.261 1.56-.232.265-.465.298-.863.1-.398-.2-1.681-.619-3.2-1.974-1.183-1.054-1.981-2.356-2.213-2.754-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.697.2-.233.265-.399.398-.665.133-.265.066-.498-.033-.697-.1-.199-.895-2.156-1.227-2.952-.323-.775-.65-.67-.895-.682-.231-.01-.497-.013-.763-.013s-.697.1-1.062.498c-.364.398-1.393 1.361-1.393 3.318s1.427 3.85 1.626 4.116c.199.265 2.807 4.285 6.802 6.01.951.41 1.693.655 2.271.839.954.304 1.823.261 2.51.158.766-.114 2.354-.962 2.686-1.891.332-.928.332-1.724.232-1.891-.099-.166-.364-.265-.762-.464z" />
                            </svg>
                            Chat on WhatsApp
                        </motion.a>
                    </motion.div>
                </div>
            </section>

            {/* ── Contact Form ── */}
            {/* <section ref={contactRef} className="bg-[#f4f8f2] border-t border-[#e8f0e4] py-16 md:py-24">
                <div className="max-w-2xl mx-auto px-6 lg:px-12">

                    <motion.div
                        custom={0}
                        variants={fadeUp}
                        initial="hidden"
                        animate={contactInView ? "visible" : "hidden"}
                        className="flex flex-col items-center text-center mb-12"
                    >
                        <span className="text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-4 block">
                            Customer Inquiry
                        </span>
                        <h2 className="text-2xl font-light uppercase tracking-[0.2em] text-[#1a2e1a] mb-4">
                            Send Us a Message
                        </h2>
                        <div className="w-8 h-px bg-[#b5d4a6] mb-5" />
                        <p className="text-xs text-stone-400 leading-loose tracking-wide max-w-xs">
                            Have questions about our products, ingredients, or your order? Our support team is ready to assist you.
                        </p>
                    </motion.div>

                    <motion.div
                        custom={0.1}
                        variants={fadeUp}
                        initial="hidden"
                        animate={contactInView ? "visible" : "hidden"}
                        className="bg-white border border-[#e8f0e4] rounded-3xl p-8 lg:p-12"
                    >
                        <form onSubmit={handleSendEmail} className="space-y-10">

                            <div className="relative border-b border-[#dcebd5] pb-2 focus-within:border-[#7aaf68] transition-colors">
                                <label className="text-[10px] uppercase tracking-[0.3em] text-stone-400 block mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Your Full Name"
                                    className="w-full bg-transparent outline-none text-[11px] tracking-wider text-[#1a2e1a] placeholder-stone-300"
                                />
                            </div>

                            <div className="relative border-b border-[#dcebd5] pb-2 focus-within:border-[#7aaf68] transition-colors">
                                <label className="text-[10px] uppercase tracking-[0.3em] text-stone-400 block mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your@email.com"
                                    className="w-full bg-transparent outline-none text-[11px] tracking-wider text-[#1a2e1a] placeholder-stone-300"
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
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="How can we assist you?"
                                    className="w-full bg-transparent outline-none text-[11px] tracking-wider text-[#1a2e1a] placeholder-stone-300 resize-none"
                                />
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02, backgroundColor: "#2e4a2e" }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className="w-full py-4 rounded-2xl bg-[#1a2e1a] text-white text-[10px] uppercase tracking-[0.3em] font-medium transition-colors flex items-center justify-center gap-3"
                            >
                                Send Message
                                <ArrowRight size={13} />
                            </motion.button>
                        </form>
                    </motion.div>

                    <motion.p
                        custom={0.18}
                        variants={fadeUp}
                        initial="hidden"
                        animate={contactInView ? "visible" : "hidden"}
                        className="text-center text-[10px] text-stone-400 tracking-widest mt-6 uppercase"
                    >
                        We typically respond within 24 hours.
                    </motion.p>

                </div>
            </section> */}

        </div>
    );
};

export default AboutUs;
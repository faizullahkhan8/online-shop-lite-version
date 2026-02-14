import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import TestAvatar from "../assets/images/avatar.jpg";

const AboutUs = () => {
    const businessEmail = "faizullahofficial0@gmail.com";

    const [formData, setFormData] = useState({
        name: "",
        message: "",
    });

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

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 lg:px-12 py-16">
                <div className="max-w-4xl">
                    <h1 className="text-sm uppercase tracking-[0.3em] text-zinc-400 mb-4">
                        Our Story
                    </h1>
                    <h2 className="text-4xl lg:text-5xl font-light text-zinc-900 leading-tight mb-8">
                        The Studio Edition. <br />
                        Refining the Editorial <br />
                        Shopping Experience.
                    </h2>
                    <p className="text-zinc-500 max-w-xl text-sm leading-relaxed tracking-wide">
                        E-Shop is a curated marketplace designed for those who appreciate the intersection of high-fashion aesthetics and seamless digital commerce. We believe in quality over quantity, and service over transactions.
                    </p>
                </div>
            </div>

            <section className="py-20 bg-[#fafafa]">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="aspect-[3/4] bg-[#f5f5f5] overflow-hidden relative group cursor-pointer">
                            <img
                                src={TestAvatar}
                                alt="Faiz Ullah Khan"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2">
                                <span className="text-[9px] uppercase tracking-[0.2em] font-medium">Founder</span>
                            </div>
                        </div>

                        <div className="lg:pl-12">
                            <h2 className="text-md uppercase tracking-[0.2em] font-medium text-zinc-900 mb-6">
                                Faiz Ullah Khan
                            </h2>
                            <p className="text-zinc-500 text-sm leading-relaxed mb-10 tracking-wide">
                                A visionary entrepreneur dedicated to revolutionizing the e-commerce experience. With a focus on editorial presentation and premium logistics, Faiz founded E-Shop to serve as a bridge between high-fashion standards and accessible retail.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center text-zinc-900 border border-zinc-100">
                                        <Mail size={16} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-zinc-400 mb-1">Inquiries</p>
                                        <p className="text-md font-medium uppercase tracking-wider text-zinc-900">{businessEmail}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center text-zinc-900 border border-zinc-100">
                                        <Phone size={16} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-zinc-400 mb-1">Direct</p>
                                        <p className="text-md font-medium uppercase tracking-wider text-zinc-900">+92 332 8753452</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 border-y border-zinc-100">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="grid md:grid-cols-2 gap-20">
                        <div>
                            <h3 className="text-md uppercase tracking-[0.25em] font-medium text-zinc-900 mb-6">
                                The Mission
                            </h3>
                            <p className="text-zinc-500 leading-relaxed text-sm tracking-wide">
                                To provide our clientele with a curated shopping environment that mirrors the sophistication of a high-fashion lookbook, backed by exceptional reliability and personalized service.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-md uppercase tracking-[0.25em] font-medium text-zinc-900 mb-6">
                                The Vision
                            </h3>
                            <p className="text-zinc-500 leading-relaxed text-sm tracking-wide">
                                To become the definitive global archive for premium retail, where every interaction is measured by innovation, aesthetic integrity, and a customer-centric philosophy.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24">
                <div className="container mx-auto px-4 lg:px-12 text-center">
                    <h2 className="text-md uppercase tracking-[0.3em] text-zinc-400 mb-6">Explore the Archive</h2>
                    <h3 className="text-3xl font-light text-zinc-900 mb-10">Discover our latest editorial collections.</h3>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-4 bg-zinc-900 text-white px-10 py-4 text-md uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all"
                    >
                        Browse Collections
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </section>

            <section className="py-24 bg-[#fafafa] border-t border-zinc-100">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="grid lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-md uppercase tracking-[0.2em] font-medium text-zinc-900 mb-8 pb-4 border-b border-zinc-200">
                                Contact & Support
                            </h2>
                            <div className="space-y-10">
                                <div className="flex gap-6">
                                    <MapPin size={18} strokeWidth={1} className="text-zinc-400" />
                                    <span className="text-md uppercase tracking-wider text-zinc-600 leading-loose">
                                        Fazal Shah Mitha Khel<br />
                                        Bannu, KP Pakistan
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 bg-white p-10 lg:p-16 border border-zinc-100 shadow-sm">
                            <h3 className="text-md uppercase tracking-[0.2em] font-medium text-zinc-900 mb-10">
                                Send a Message
                            </h3>
                            <form onSubmit={handleSendEmail} className="space-y-12">
                                <div className="relative border-b border-zinc-200 pb-2 focus-within:border-zinc-900 transition-colors">
                                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="GUEST NAME"
                                        className="w-full bg-transparent outline-none text-[12px] uppercase tracking-[0.1em] text-zinc-900 placeholder-zinc-200"
                                    />
                                </div>

                                <div className="relative border-b border-zinc-200 pb-2 focus-within:border-zinc-900 transition-colors">
                                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-2">Message</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="HOW CAN WE ASSIST YOU?"
                                        className="w-full bg-transparent outline-none text-[12px] uppercase tracking-[0.1em] text-zinc-900 placeholder-zinc-200 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-zinc-900 text-white text-sm uppercase tracking-[0.3em] font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-3"
                                >
                                    Submit via Gmail
                                    <ArrowRight size={14} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
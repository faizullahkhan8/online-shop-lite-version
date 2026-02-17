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
                    <h1 className="text-sm uppercase tracking-[0.3em] text-zinc-500 mb-4">
                        Our Story
                    </h1>
                    At Askar.pk, we believe that good health should be simple, natural, and trustworthy.
                    We offer 100% natural and organic healthcare products designed to support healthy weight gain and effective weight management. Our approach is honest and balanced focusing on safe formulations made with pure, organic ingredients that work in harmony with your body.
                    Every product at Askar.pk is created with care, quality, and your well-being in mind. No harsh chemicals, no false claims just natural support for a healthier and more confident you.
                    Askar.pk natural care for a balanced, healthier life.
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
                                <span className="text-sm uppercase tracking-[0.2em] font-medium">Founder</span>
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
                                        <p className="text-sm uppercase tracking-widest text-zinc-500 mb-1">Inquiries</p>
                                        <p className="text-md font-medium tracking-wider text-zinc-900">{businessEmail}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center text-zinc-900 border border-zinc-100">
                                        <Phone size={16} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-sm uppercase tracking-widest text-zinc-500 mb-1">Direct Contact 1</p>
                                        <p className="text-md font-medium uppercase tracking-wider text-zinc-900">+92 333 976 4520</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center text-zinc-900 border border-zinc-100">
                                        <Phone size={16} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-sm uppercase tracking-widest text-zinc-500 mb-1">Direct Contact 2</p>
                                        <p className="text-md font-medium uppercase tracking-wider text-zinc-900">+92 310 099 3568</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center text-zinc-900 border border-zinc-100">
                                        <Phone size={16} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-sm uppercase tracking-widest text-zinc-500 mb-1">Direct Contact 3</p>
                                        <p className="text-md font-medium uppercase tracking-wider text-zinc-900">+92 333 929 7965</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24">
                <div className="container mx-auto px-4 lg:px-12 text-center">
                    <h2 className="text-md uppercase tracking-[0.3em] text-zinc-500 mb-6">Explore the Archive</h2>
                    <h3 className="text-3xl font-light text-zinc-900 mb-10">Discover our latest editorial collections.</h3>
                    <Link
                        to="/collections"
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
                                    <MapPin size={18} strokeWidth={1} className="text-zinc-500" />
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
                                    <label className="text-sm uppercase tracking-widest text-zinc-500 block mb-2">Name</label>
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
                                    <label className="text-sm uppercase tracking-widest text-zinc-500 block mb-2">Message</label>
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
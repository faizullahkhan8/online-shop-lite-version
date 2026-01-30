import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Youtube,
    ChevronUp,
    ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    const footerSections = [
        {
            title: "About",
            links: ["About Us", "Find store", "Categories", "Blogs"],
        },
        {
            title: "Partnership",
            links: [
                "Trade Assurance",
                "Supplier Verification",
                "Logistics",
                "Production",
            ],
        },
        {
            title: "Information",
            links: ["Help Center", "Money Refund", "Shipping", "Contact us"],
        },
        {
            title: "For users",
            links: ["Login", "Register", "Settings", "My Orders"],
        },
    ];

    const socialIcons = [
        {
            icon: <Facebook size={18} />,
            label: "Facebook",
            color: "hover:bg-blue-600",
        },
        {
            icon: <Twitter size={18} />,
            label: "Twitter",
            color: "hover:bg-sky-400",
        },
        {
            icon: <Linkedin size={18} />,
            label: "LinkedIn",
            color: "hover:bg-blue-700",
        },
        {
            icon: <Instagram size={18} />,
            label: "Instagram",
            color: "hover:bg-pink-600",
        },
        {
            icon: <Youtube size={18} />,
            label: "YouTube",
            color: "hover:bg-red-600",
        },
    ];

    return (
        <footer className="w-full bg-white pt-16">
            <div className="container mx-auto px-4 lg:px-8 pb-12">
                <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">
                    <div className="max-w-xs space-y-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                                <ShieldCheck className="text-white" size={28} />
                            </div>
                            <span className="text-xl font-black text-slate-900 tracking-tighter">
                                E-Store<span className="text-primary">.</span>
                            </span>
                        </Link>

                        <p className="text-slate-500 text-sm leading-relaxed font-medium">
                            Providing the most reliable global sourcing platform
                            for businesses and individuals since 2026.
                        </p>

                        <div className="flex gap-3">
                            {socialIcons.map((item, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    aria-label={item.label}
                                    className={`w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center transition-all duration-300 hover:text-white hover:-translate-y-1 ${item.color}`}
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 grow">
                        {footerSections.map((section, idx) => (
                            <div key={idx}>
                                <h4 className="text-slate-900 font-black mb-6 text-xs uppercase tracking-[0.2em]">
                                    {section.title}
                                </h4>
                                <ul className="space-y-4">
                                    {section.links.map((link, lIdx) => (
                                        <li key={lIdx}>
                                            <a
                                                href="#"
                                                className="text-sm font-bold text-slate-400 hover:text-primary transition-colors inline-block"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 min-w-[140px]">
                        <h4 className="text-slate-900 font-black mb-2 text-xs uppercase tracking-[0.2em]">
                            Get the App
                        </h4>
                        <a
                            href="#"
                            className="transition-transform hover:scale-105 active:scale-95"
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                alt="App Store"
                                className="h-10 w-auto"
                            />
                        </a>
                        <a
                            href="#"
                            className="transition-transform hover:scale-105 active:scale-95"
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                alt="Google Play"
                                className="h-10 w-auto"
                            />
                        </a>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-100 py-8">
                <div className="container mx-auto px-4 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
                        © 2026 E-Store By Faiz. All Rights Reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-primary transition-all group">
                            <img
                                src="https://flagcdn.com/us.svg"
                                alt="US Flag"
                                className="w-5 h-3.5 object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all"
                            />
                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">
                                English (US)
                            </span>
                            <ChevronUp size={14} className="text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Youtube,
    ChevronDown,
    Globe,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    const footerSections = [
        {
            title: "About",
            links: ["Our Story", "Ateliers", "Categories", "Editorial"],
        },
        {
            title: "Partnership",
            links: [
                "Trade Assurance",
                "Verification",
                "Logistics",
                "Production",
            ],
        },
        {
            title: "Support",
            links: ["Help Center", "Returns", "Shipping", "Contact"],
        },
        {
            title: "Account",
            links: ["Login", "Register", "Settings", "Orders"],
        },
    ];

    const socialIcons = [
        { icon: <Facebook size={14} />, label: "Facebook" },
        { icon: <Twitter size={14} />, label: "Twitter" },
        { icon: <Linkedin size={14} />, label: "LinkedIn" },
        { icon: <Instagram size={14} />, label: "Instagram" },
        { icon: <Youtube size={14} />, label: "YouTube" },
    ];

    return (
        <footer className="w-full bg-white pt-24 border-t border-zinc-100">
            <div className="container mx-auto px-4 lg:px-12 pb-20">
                <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24">
                    <div className="max-w-xs space-y-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
                                <Globe className="text-white" size={20} strokeWidth={1} />
                            </div>
                            <div>
                                <p className="text-md font-semibold tracking-widest uppercase text-zinc-900">
                                    Archive
                                </p>
                                <p className="text-sm tracking-[0.2em] uppercase text-zinc-400">
                                    Curated by Khan
                                </p>
                            </div>
                        </Link>

                        <p className="text-zinc-500 text-sm leading-relaxed tracking-wide font-light">
                            A global platform dedicated to the preservation of high-end artifacts and
                            essential sourcing for the modern professional since 2026.
                        </p>

                        <div className="flex gap-4">
                            {socialIcons.map((item, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    aria-label={item.label}
                                    className="w-8 h-8 border border-zinc-100 text-zinc-400 rounded-full flex items-center justify-center transition-all hover:border-zinc-900 hover:text-zinc-900"
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 grow">
                        {footerSections.map((section, idx) => (
                            <div key={idx}>
                                <h4 className="text-zinc-900 font-semibold mb-6 text-sm uppercase tracking-[0.2em]">
                                    {section.title}
                                </h4>
                                <ul className="space-y-4">
                                    {section.links.map((link, lIdx) => (
                                        <li key={lIdx}>
                                            <a
                                                href="#"
                                                className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors inline-block tracking-wide font-light"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-zinc-50 py-8 border-t border-zinc-100">
                <div className="container mx-auto px-4 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-zinc-400 text-sm uppercase tracking-[0.1em] font-light">
                        © 2026 E-Archive. All Rights Reserved.
                    </p>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 cursor-pointer group">
                            <img
                                src="https://flagcdn.com/us.svg"
                                alt="US"
                                className="w-4 h-3 object-cover grayscale group-hover:grayscale-0 transition-all"
                            />
                            <span className="text-sm text-zinc-500 group-hover:text-zinc-900 transition-colors uppercase tracking-widest font-medium">
                                EN
                            </span>
                            <ChevronDown size={12} className="text-zinc-300 group-hover:text-zinc-900" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
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
            title: "Links",
            links: ["about-us", "products", "collections", "track-order"],
        },
    ];

    // const socialIcons = [
    //     { icon: <Facebook size={14} />, label: "Facebook" },
    //     { icon: <Twitter size={14} />, label: "Twitter" },
    //     { icon: <Linkedin size={14} />, label: "LinkedIn" },
    //     { icon: <Instagram size={14} />, label: "Instagram" },
    //     { icon: <Youtube size={14} />, label: "YouTube" },
    // ];

    return (
        <footer className="w-full bg-white pt-24 border-t border-zinc-100">
            <div className="container mx-auto px-4 lg:px-12 pb-20">
                <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24 pb-10">
                    <div className="max-w-xs space-y-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div>
                                <p className="text-md font-semibold tracking-widest uppercase text-zinc-900">
                                    Askar
                                </p>
                                <p className="text-sm tracking-[0.2em] uppercase text-zinc-400">
                                    Famous for Quaility
                                </p>
                            </div>
                        </Link>

                        <p className="text-zinc-500 text-sm leading-relaxed tracking-wide font-light">
                            At Askar.pk, we believe that good health should be simple, natural, and trustworthy.
                        </p>

                        {/* <div className="flex gap-4">
                            {socialIcons.map((item, index) => (
                                <a
                                    key={index}
                                    aria-label={item.label}
                                    className="w-8 h-8 border border-zinc-100 text-zinc-400 rounded-full flex items-center justify-center transition-all hover:border-zinc-900 hover:text-zinc-900"
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div> */}
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
                                                href={link}
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
                <div className="container mx-auto px-4 lg:px-12 flex sm:flex-row justify-center items-center gap-6">
                    <p className="text-zinc-400 text-sm uppercase tracking-widest font-light">
                        © 2026 E-Archive. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

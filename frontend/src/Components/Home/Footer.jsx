import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Youtube,
    ChevronDown,
    ShieldCheck,
    Globe,
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
            icon: <Facebook size={16} />,
            label: "Facebook",
            color: "hover:bg-blue-600",
        },
        {
            icon: <Twitter size={16} />,
            label: "Twitter",
            color: "hover:bg-sky-400",
        },
        {
            icon: <Linkedin size={16} />,
            label: "LinkedIn",
            color: "hover:bg-blue-700",
        },
        {
            icon: <Instagram size={16} />,
            label: "Instagram",
            color: "hover:bg-pink-600",
        },
        {
            icon: <Youtube size={16} />,
            label: "YouTube",
            color: "hover:bg-red-600",
        },
    ];

    return (
        <footer className="w-full bg-white pt-12 border-t border-gray-200">
            <div className="container mx-auto px-4 lg:px-8 pb-10!">
                <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16">
                    <div className="max-w-xs space-y-4">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                                    <Globe className="text-white" size={24} />
                                </div>
                                <div>
                                    <p className="font-semibold text-base text-gray-900">
                                        E-Shop
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        By Faiz Ullah Khan
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <p className="text-gray-600 text-sm leading-relaxed">
                            Providing the most reliable global sourcing platform
                            for businesses and individuals since 2026.
                        </p>

                        <div className="flex gap-2">
                            {socialIcons.map((item, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    aria-label={item.label}
                                    className={`w-9 h-9 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center transition-all hover:text-white ${item.color}`}
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 grow">
                        {footerSections.map((section, idx) => (
                            <div key={idx}>
                                <h4 className="text-gray-900 font-semibold mb-4 text-sm">
                                    {section.title}
                                </h4>
                                <ul className="space-y-2.5">
                                    {section.links.map((link, lIdx) => (
                                        <li key={lIdx}>
                                            <a
                                                href="#"
                                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors inline-block"
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

            <div className="bg-gray-50 border-t border-gray-200 py-6">
                <div className="container mx-auto px-4 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2026 E-Store By Faiz. All Rights Reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-500 transition-all group">
                            <img
                                src="https://flagcdn.com/us.svg"
                                alt="US Flag"
                                className="w-5 h-3.5 object-cover rounded-sm"
                            />
                            <span className="text-sm text-gray-700">
                                English (US)
                            </span>
                            <ChevronDown size={14} className="text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
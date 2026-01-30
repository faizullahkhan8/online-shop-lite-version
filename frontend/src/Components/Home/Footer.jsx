import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Youtube,
    ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";

// Footer Component
const Footer = () => {
    const footerSections = [
        {
            title: "About",
            links: ["About Us", "Find store", "Categories", "Blogs"],
        },
        {
            title: "Partnership",
            links: ["About Us", "Find store", "Categories", "Blogs"],
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
        { icon: <Facebook size={18} />, label: "Facebook" },
        { icon: <Twitter size={18} />, label: "Twitter" },
        { icon: <Linkedin size={18} />, label: "LinkedIn" },
        { icon: <Instagram size={18} />, label: "Instagram" },
        { icon: <Youtube size={18} />, label: "YouTube" },
    ];

    return (
        <footer className="w-full font-sans">
            <div className="bg-white py-8 sm:py-10 px-4 sm:px-6 md:px-8 lg:px-12 border-b border-gray-200">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between gap-8 lg:gap-10">
                    <div className="max-w-xs">
                        <div className="flex items-center gap-2 mb-4">
                            <Link
                                to="/"
                                className="flex items-center gap-2 flex-shrink-0 group"
                            >
                                <img
                                    src="./logo.png"
                                    alt="App Logo"
                                    className="h-18 w-18 object-contain rounded-md"
                                />
                                <span className="text-2xl font-bold text-primary-dark group-hover:text-primary transition-colors">
                                    E-Store by Faiz
                                </span>
                            </Link>
                        </div>
                        <p className="text-[#505050] text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                            Best information about the company goes here.
                        </p>
                        <div className="flex gap-2 sm:gap-3">
                            {socialIcons.map((item, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    aria-label={item.label}
                                    className="w-8 h-8 sm:w-9 sm:h-9 bg-[#BDC4CD] text-white rounded-full flex items-center justify-center hover:bg-[#8B96A5] hover:scale-110 transition-all"
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 grow lg:pl-10">
                        {footerSections.map((section, idx) => (
                            <div key={idx}>
                                <h4 className="text-[#1C1C1C] font-bold mb-3 sm:mb-4 text-sm sm:text-base">
                                    {section.title}
                                </h4>
                                <ul className="space-y-2">
                                    {section.links.map((link, lIdx) => (
                                        <li key={lIdx}>
                                            <a
                                                href="#"
                                                className="text-sm text-[#8B96A5] hover:text-[#127FFF] transition-colors"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2">
                        <h4 className="text-[#1C1C1C] font-bold mb-2 sm:mb-4 text-sm sm:text-base">
                            Get app
                        </h4>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                            alt="App Store"
                            className="h-9 sm:h-10 w-28 sm:w-32 cursor-pointer rounded-md hover:brightness-90 transition-all"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                            alt="Google Play"
                            className="h-9 sm:h-10 w-28 sm:w-32 cursor-pointer rounded-md hover:brightness-90 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-[#EFF2F4] py-4 sm:py-5 px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                    <p className="text-[#606060] text-xs sm:text-sm">
                        © 2026 Ecommerce.
                    </p>
                    <div className="flex items-center gap-2 text-[#606060] cursor-pointer hover:text-[#127FFF] transition-colors">
                        <img
                            src="https://flagcdn.com/us.svg"
                            alt="US Flag"
                            className="w-5 h-4 sm:w-6 sm:h-4 object-cover rounded-sm"
                        />
                        <span className="text-xs sm:text-sm">English</span>
                        <ChevronUp size={18} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

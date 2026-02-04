import { useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Instagram,
    Twitter,
    Linkedin,
    MapPin,
    Phone,
    Mail,
    ShieldCheck,
    Mailbox,
    Facebook,
} from "lucide-react";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        message: "",
    });

    const handleSendEmail = (e) => {
        e.preventDefault();
        const businessEmail = "faizullahofficial0@gmail.com";
        const subject = encodeURIComponent(`DIRECT_INQUIRY: ${formData.name}`);
        const body = encodeURIComponent(
            `SENDER: ${formData.name}\n` +
                `---------------------------\n` +
                `CONTENT:\n${formData.message}`,
        );

        const gmailUrl =
            `https://mail.google.com/mail/?view=cm&fs=1` +
            `&to=${businessEmail}&su=${subject}&body=${body}`;

        window.open(gmailUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white relative overflow-hidden">
            <main className="relative z-10 px-6 md:px-12 py-10 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight uppercase">
                        Get In Touch
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 border-b border-slate-50 pb-4">
                                Contact Information
                            </h3>
                            <div className="space-y-10">
                                <div className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                                            Location
                                        </span>
                                        <span className="text-sm font-bold text-slate-900">
                                            Fazal Shah Mitha Khel Bannu, KP
                                            Pakistan
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                                            WhatsApp
                                        </span>
                                        <span className="text-sm font-bold text-slate-900">
                                            +92 332 8753452
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                                            Email
                                        </span>
                                        <span className="text-sm font-bold text-slate-900 underline decoration-slate-200 underline-offset-4">
                                            faizullahofficial0@gmail.com
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border border-slate-100 bg-slate-900 py-4 px-6 rounded-2xl flex justify-between items-center text-white">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                                Social Accounts
                            </span>
                            <div className="flex gap-6">
                                <Instagram
                                    size={18}
                                    className="hover:text-blue-400 cursor-pointer transition-colors"
                                />
                                <Twitter
                                    size={18}
                                    className="hover:text-blue-400 cursor-pointer transition-colors"
                                />
                                <Facebook
                                    size={18}
                                    className="hover:text-blue-400 cursor-pointer transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/60 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem]" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20">
                                        <Mail
                                            className="text-white"
                                            size={24}
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                                            Contact Us From
                                        </h2>
                                    </div>
                                </div>

                                <form
                                    onSubmit={handleSendEmail}
                                    className="space-y-8"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                            Your Identity
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
                                            placeholder="FULL NAME"
                                            className="w-full h-12 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                            Message Content
                                        </label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    message: e.target.value,
                                                })
                                            }
                                            placeholder="HOW CAN WE ASSIST?"
                                            className="w-full px-6 py-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full h-12 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-4"
                                    >
                                        Transmit via Gmail
                                        <ArrowRight size={18} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="relative z-10 px-6 md:px-12 py-16 border-t border-slate-100 bg-white/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="text-2xl font-black tracking-tighter uppercase">
                            Registry.
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            © 2024 System Registry. SSL Encrypted.
                        </p>
                    </div>
                    <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <a
                            href="#"
                            className="hover:text-slate-900 transition-colors"
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            className="hover:text-slate-900 transition-colors"
                        >
                            Security
                        </a>
                        <a
                            href="#"
                            className="hover:text-slate-900 transition-colors"
                        >
                            Node Status
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ContactPage;

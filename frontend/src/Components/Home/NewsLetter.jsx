import React from "react";
import { Mail, Sparkles } from "lucide-react";
import Button from "../../UI/Button";

const Newsletter = () => {
    return (
        <section className="container mx-auto px-4 lg:px-8 mb-20">
            <div className="bg-slate-50 border border-slate-100 rounded-[3rem] py-16 px-6 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

                <div className="flex items-center gap-2 mb-4 bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">
                    <Sparkles size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Stay Updated
                    </span>
                </div>

                <h2 className="text-slate-900 text-2xl md:text-4xl font-black mb-4 tracking-tight text-center">
                    Subscribe to our{" "}
                    <span className="text-primary">newsletter</span>
                </h2>

                <p className="text-slate-500 text-sm md:text-base mb-10 max-w-md text-center font-medium leading-relaxed">
                    Get daily news on upcoming offers from many suppliers all
                    over the world, delivered straight to your inbox.
                </p>

                <form
                    className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg relative z-10"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className="relative w-full group">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        </span>

                        <input
                            type="email"
                            placeholder="Enter your email address"
                            required
                            className="
                                w-full h-14 pl-12 pr-4
                                bg-white border border-slate-100 rounded-2xl
                                text-sm font-bold text-slate-900 placeholder-slate-400
                                shadow-xl shadow-slate-200/50
                                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                transition-all
                            "
                        />
                    </div>

                    <Button className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-slate-900/20 hover:bg-primary transition-all active:scale-95 whitespace-nowrap">
                        Subscribe
                    </Button>
                </form>

                <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    We respect your privacy. Unsubscribe at any time.
                </p>
            </div>
        </section>
    );
};

export default Newsletter;

import React from "react";

const kitchenBg =
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1920";

const RequestQuoteSection = () => {
    return (
        <section className="container mx-auto px-4 lg:px-8 mb-12">
            <div className="relative rounded-[2.5rem] overflow-hidden min-h-[420px] flex items-center shadow-2xl shadow-blue-900/10">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                    style={{
                        backgroundImage: `linear-gradient(110deg, rgba(20, 71, 230, 0.9) 0%, rgba(20, 71, 230, 0.4) 100%), url(${kitchenBg})`,
                    }}
                />

                <div className="relative z-10 w-full px-8 py-12 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="lg:w-1/2 text-white text-center lg:text-left">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20">
                            Supplier Connect
                        </span>
                        <h2 className="text-3xl lg:text-5xl font-black leading-tight mb-6">
                            An easy way to send{" "}
                            <br className="hidden lg:block" /> requests to all
                            suppliers
                        </h2>
                        <p className="text-white/70 text-sm lg:text-base max-w-md font-medium">
                            Streamline your sourcing process. Send one inquiry
                            and receive multiple quotes from verified global
                            suppliers within hours.
                        </p>
                    </div>

                    <div className="w-full max-w-[480px] bg-white rounded-[2rem] shadow-2xl p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">
                            Send quote to suppliers
                        </h3>

                        <form
                            className="space-y-4"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">
                                    Item Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="What item do you need?"
                                    className="w-full h-12 px-5 text-sm font-medium border border-slate-100 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">
                                    Details
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Type more details (specs, colors, etc.)"
                                    className="w-full px-5 py-3 text-sm font-medium resize-none border border-slate-100 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2 space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full h-12 px-5 text-sm font-medium border border-slate-100 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="w-1/2 space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">
                                        Unit
                                    </label>
                                    <select className="w-full h-12 px-5 text-sm font-bold bg-slate-50/50 cursor-pointer border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all appearance-none">
                                        <option>Pcs</option>
                                        <option>Kg</option>
                                        <option>Liters</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full lg:w-fit mt-2 h-12 px-10 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
                            >
                                Send inquiry
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RequestQuoteSection;

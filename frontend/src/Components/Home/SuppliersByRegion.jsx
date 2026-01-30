import { memo } from "react";
import { SUPPLIER_COUNTRIES } from "../../constants";
import { Globe2 } from "lucide-react";

const SuppliersByRegion = () => {
    return (
        <section className="container mx-auto px-4 lg:px-8 mb-16">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-slate-100 rounded-xl text-primary">
                    <Globe2 size={20} />
                </div>
                <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                        Suppliers by{" "}
                        <span className="text-primary">Region</span>
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Global Sourcing Network
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {SUPPLIER_COUNTRIES.map((region) => (
                    <div
                        key={region.country}
                        className="bg-white border border-slate-100 rounded-2xl p-4 
                                   flex items-center gap-4 hover:shadow-xl hover:shadow-slate-200/50 
                                   hover:border-primary/20 transition-all duration-300 cursor-pointer group"
                    >
                        <div
                            className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl 
                                      group-hover:scale-110 group-hover:bg-primary/5 transition-all duration-500"
                        >
                            <span className="text-2xl filter drop-shadow-sm leading-none">
                                {region.flag}
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span
                                className="text-sm font-black text-slate-700 
                                           group-hover:text-primary transition-colors"
                            >
                                {region.country}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                Verified Hub
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

SuppliersByRegion.displayName = "SuppliersByRegion";

export default memo(SuppliersByRegion);

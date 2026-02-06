import { useEffect, useState } from "react";
import { Truck, Receipt, Save } from "lucide-react";
import Input from "../../UI/Input.jsx";
import Select from "../../UI/Select.jsx";
import { useGetSettings, useUpdateSettings } from "../../api/hooks/settings.api";

const TaxShippingSettings = () => {
    const { getSettings, loading: settingsLoading } = useGetSettings();
    const { updateSettings, loading: updateLoading } = useUpdateSettings();

    const [form, setForm] = useState({
        taxAmount: 0,
        shippingFee: 0,
        shippingMethod: "standard",
    });

    useEffect(() => {
        getSettings().then((res) => {
            if (res?.settings) {
                setForm({
                    taxAmount: Number(res.settings.taxAmount) || 0,
                    shippingFee: Number(res.settings.shippingFee) || 0,
                    shippingMethod: res.settings.shippingMethod || "standard",
                });
            }
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateSettings({
            taxAmount: Number(form.taxAmount) || 0,
            shippingFee: Number(form.shippingFee) || 0,
            shippingMethod: form.shippingMethod,
        });
    };

    return (
        <div className="max-w-[1100px] mx-auto space-y-8 animate-in fade-in duration-300">
            <header className="flex items-center justify-between gap-6 border-b border-slate-100 pb-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                        <div className="p-3 bg-primary rounded-2xl text-white shadow-xl shadow-primary/20">
                            <Receipt size={22} />
                        </div>
                        Tax & Shipping
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">
                        Default Checkout Configuration
                    </p>
                </div>
            </header>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8"
            >
                <section className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-50 pb-4">
                        <Receipt size={14} className="text-primary" /> Charges
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Tax Amount
                            </label>
                            <Input
                                type="number"
                                value={form.taxAmount}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        taxAmount: Number(e.target.value),
                                    }))
                                }
                                className="w-full"
                                disabled={settingsLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Shipping Fee
                            </label>
                            <Input
                                type="number"
                                value={form.shippingFee}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        shippingFee: Number(e.target.value),
                                    }))
                                }
                                className="w-full"
                                disabled={settingsLoading}
                            />
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-50 pb-4">
                        <Truck size={14} className="text-primary" /> Default
                        Shipping Method
                    </h3>
                    <Select
                        options={[
                            { label: "Standard Ground", value: "standard" },
                            { label: "Express Air", value: "express" },
                            { label: "In-Store Pickup", value: "pickup" },
                        ]}
                        value={form.shippingMethod}
                        onChange={(val) =>
                            setForm((p) => ({ ...p, shippingMethod: val }))
                        }
                        className="w-full max-w-none"
                    />
                </section>

                <button
                    type="submit"
                    disabled={updateLoading}
                    className="group w-full bg-slate-900 text-white rounded-3xl py-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-2xl shadow-slate-900/20 active:scale-[0.98] disabled:opacity-50"
                >
                    <Save
                        size={16}
                        className="group-hover:scale-110 transition-transform"
                    />
                    {updateLoading ? "Saving..." : "Save Settings"}
                </button>
            </form>
        </div>
    );
};

export default TaxShippingSettings;

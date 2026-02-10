import { useEffect, useState } from "react";
import { Truck, Receipt, Save, Loader2 } from "lucide-react";
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
        <div className="space-y-6">
            {/* Header */}
            <header className="flex items-center gap-3 pb-6 border-b border-gray-200">
                <div className="p-2.5 bg-blue-600 rounded-lg text-white shadow-sm">
                    <Receipt size={20} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Tax & Shipping Settings
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Configure default checkout settings
                    </p>
                </div>
            </header>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-6"
            >
                {/* Charges Section */}
                <section className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
                        <Receipt size={16} className="text-blue-600" />
                        Pricing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Tax Amount (Rs)
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                value={form.taxAmount}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        taxAmount: Number(e.target.value),
                                    }))
                                }
                                className="w-full"
                                disabled={settingsLoading}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Shipping Fee (Rs)
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                value={form.shippingFee}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        shippingFee: Number(e.target.value),
                                    }))
                                }
                                className="w-full"
                                disabled={settingsLoading}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </section>

                {/* Shipping Method Section */}
                <section className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
                        <Truck size={16} className="text-blue-600" />
                        Shipping Method
                    </h3>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Default Shipping Method
                        </label>
                        <Select
                            options={[
                                { label: "Standard Shipping", value: "standard" },
                                { label: "Express Shipping", value: "express" },
                                { label: "Store Pickup", value: "pickup" },
                            ]}
                            value={form.shippingMethod}
                            onChange={(val) =>
                                setForm((p) => ({ ...p, shippingMethod: val }))
                            }
                            className="w-full max-w-none"
                        />
                    </div>
                </section>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={updateLoading || settingsLoading}
                        className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {updateLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Settings
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaxShippingSettings;
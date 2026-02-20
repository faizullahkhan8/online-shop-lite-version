import { useState } from "react";
import { Receipt, Save, Loader2 } from "lucide-react";
import Input from "../../UI/Input.jsx";
import { useSettings, useUpdateSettings } from "../../features/settings.all.js";

const TaxShippingSettings = () => {
    const { data, loading: settingsLoading } = useSettings();
    const updateSettingMutation = useUpdateSettings();

    const [form, setForm] = useState({
        taxAmount: data?.settings?.taxAmount || 0,
        shippingFee: data?.settings?.shippingFee || 0,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateSettingMutation.mutateAsync({
            taxAmount: Number(form.taxAmount) || 0,
            shippingFee: Number(form.shippingFee) || 0,
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex items-center gap-3 pb-6 border-b border-gray-200">
                <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-sm">
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
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6"
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

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={
                            updateSettingMutation.isPending || settingsLoading
                        }
                        className="w-full bg-blue-600 text-white rounded-2xl py-3 font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {updateSettingMutation.isPending ? (
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

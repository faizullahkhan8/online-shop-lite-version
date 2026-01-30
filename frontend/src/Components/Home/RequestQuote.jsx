import React from "react";
import kitchenBg from "../../assets/images/kitchen-items-1.png";

const RequestQuoteSection = () => {
    return (
        <section className="relative max-w-7xl mx-auto rounded-md overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(90deg, rgba(13,110,253,0.95) 0%, rgba(18,127,255,0.6) 100%), url(${kitchenBg})`,
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 flex flex-col lg:flex-row items-center justify-between gap-12">
                {/* Left Content */}
                <div className="lg:w-1/2 text-white">
                    <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
                        An easy way to send <br /> requests to all suppliers
                    </h2>
                    <p className="text-white/80 text-base max-w-md">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore.
                    </p>
                </div>

                {/* Right Form */}
                <div className="w-full max-w-[440px] bg-white rounded-md shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-5">
                        Send quote to suppliers
                    </h3>

                    <form className="space-y-4">
                        <input
                            type="text"
                            placeholder="What item you need?"
                            className="w-full h-10 px-4 text-sm
                                       border border-gray-300 rounded-md
                                       focus:outline-none focus:ring-2 focus:ring-[#1447e6]"
                        />

                        <textarea
                            rows={3}
                            placeholder="Type more details"
                            className="w-full px-4 py-2 text-sm resize-none
                                       border border-gray-300 rounded-md
                                       focus:outline-none focus:ring-2 focus:ring-[#1447e6]"
                        />

                        <div className="flex gap-3">
                            <input
                                type="number"
                                placeholder="Quantity"
                                className="w-1/2 h-10 px-4 text-sm
                                           border border-gray-300 rounded-md
                                           focus:outline-none focus:ring-2 focus:ring-[#1447e6]"
                            />
                            <select
                                className="w-1/2 h-10 px-4 text-sm bg-white cursor-pointer
                                           border border-gray-300 rounded-md
                                           focus:outline-none focus:ring-2 focus:ring-[#1447e6]"
                            >
                                <option>Pcs</option>
                                <option>Kg</option>
                                <option>Liters</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="h-10 px-6 rounded-md
                                       bg-[#1447e6] text-white text-sm font-semibold
                                       hover:bg-blue-700 transition-colors"
                        >
                            Send inquiry
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default RequestQuoteSection;

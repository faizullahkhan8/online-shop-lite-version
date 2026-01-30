import React from "react";
import { Mail } from "lucide-react";
import Button from "../../UI/Button";

const Newsletter = () => {
    return (
        <div className="max-w-xl mx-auto text-center flex flex-col items-center">
            {/* Heading */}
            <h2 className="text-[#1C1C1C] text-xl md:text-2xl font-bold mb-2">
                Subscribe on our newsletter
            </h2>

            {/* Subtitle */}
            <p className="text-[#606060] text-sm md:text-base mb-8 max-w-md">
                Get daily news on upcoming offers from many suppliers all over
                the world
            </p>

            {/* Form */}
            <form
                className="flex flex-col sm:flex-row items-center gap-2 w-full"
                onSubmit={(e) => e.preventDefault()}
            >
                {/* Input */}
                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-[#8B96A5]" />
                    </span>

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className="
                                w-full h-11 pl-10 pr-3
                                bg-white border border-gray-300 rounded-md
                                text-sm placeholder-[#8B96A5]
                                shadow-sm
                                focus:outline-none focus:ring-1 focus:ring-[#127FFF] focus:border-[#127FFF]
                            "
                    />
                </div>

                {/* Button */}
                <Button>Subscribe</Button>
            </form>
        </div>
    );
};

export default Newsletter;

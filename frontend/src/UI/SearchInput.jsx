import React from "react";
import { Search, X } from "lucide-react";
import clsx from "clsx";

const SearchInput = ({
    value,
    onChange,
    placeholder = "Search...",
    disabled = false,
    className,
    onClear,
    ...props
}) => {
    const handleClear = () => {
        if (onClear) onClear();
        else onChange({ target: { value: "" } });
    };

    return (
        // Added flex and items-center to help with vertical alignment
        <div className={clsx("relative w-full h-10 flex items-center")}>
            {/* Left Icon: Fixed at 12px (left-3) from the edge */}
            <div className="absolute left-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
            </div>

            {/* Input: W-full ensures it fills the container. pl-10 gives space for the Search icon */}
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={clsx(
                    "w-full h-full border-gray-300",
                    "pl-10 pr-10 text-sm outline-none transition-all duration-200",
                    "focus:border-blue-700 focus:ring-2 focus:ring-blue-600/20",
                    "disabled:bg-gray-100 disabled:cursor-not-allowed",
                    className
                )}
                {...props}
            />

            {/* Clear Icon: Fixed at 12px (right-3) from the edge */}
            {value && !disabled && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export default SearchInput;

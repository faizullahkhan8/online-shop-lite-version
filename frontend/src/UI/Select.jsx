import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const Select = ({
    options = [],
    value,
    onChange,
    placeholder = "All items",
    disabled = false,
    className,
}) => {
    const [open, setOpen] = useState(false);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className={clsx("relative h-full max-w-max min-w-50", className)}>
            {/* Trigger */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
                className={clsx(
                    "flex items-center justify-between h-full min-w-50",
                    "px-4 py-2 bg-white border-gray-300",
                    "text-sm outline-none",
                    "hover:bg-gray-50 transition-colors",
                    "disabled:bg-gray-100 disabled:cursor-not-allowed"
                )}
            >
                <span className="truncate mr-2 text-gray-800 text-md">
                    {selectedOption?.label || placeholder}
                </span>

                <ChevronDown
                    size={16}
                    className={clsx(
                        "text-gray-500 transition-transform duration-200",
                        open && "rotate-180"
                    )}
                />
            </button>

            {/* Dropdown */}
            {open && !disabled && (
                <div
                    className={clsx(
                        "absolute z-50 mt-1 left-0",
                        "w-50 max-h-75",
                        "bg-white border border-gray-200 rounded-md",
                        "shadow-lg py-1 overflow-y-auto"
                    )}
                >
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}
                            className={clsx(
                                "px-4 py-2 text-sm cursor-pointer transition-colors",
                                "hover:bg-blue-50 hover:text-blue-700",
                                value === option.value
                                    ? "bg-blue-50 text-blue-700 font-medium"
                                    : "text-gray-700"
                            )}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Select;

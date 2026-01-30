import clsx from "clsx";

const VARIANTS = {
    primary: "bg-blue-700 text-white hover:bg-blue-800 focus:ring-[#1447e6]",
    secondary:
        "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-600",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
    outline:
        "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
};

const SIZES = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
};

const Button = ({
    children,
    variant = "primary",
    size = "md",
    type = "button",
    disabled = false,
    loading = false,
    className,
    onClick,
}) => {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={clsx(
                "inline-flex items-center justify-center gap-2 cursor-pointer",
                "rounded-md font-medium transition-all",
                "focus:outline-none focus:ring-2 focus:ring-offset-1",
                VARIANTS[variant],
                SIZES[size],
                (disabled || loading) && "opacity-60 cursor-not-allowed",
                className
            )}
        >
            {loading && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {children}
        </button>
    );
};

export default Button;

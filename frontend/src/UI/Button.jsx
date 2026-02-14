import clsx from "clsx";

const VARIANTS = {
    // This "studio" variant matches your provided code block
    studio: "group relative overflow-hidden border border-zinc-200 bg-white text-zinc-900 hover:border-zinc-900",
    primary: "bg-zinc-900 text-white hover:bg-zinc-800",
    outline: "border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white",
    ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100",
};

const SIZES = {
    sm: "px-8 py-3 text-[10px] tracking-[0.2em]",
    md: "px-12 py-4 text-[11px] tracking-[0.3em]",
    lg: "px-16 py-5 text-sm tracking-[0.4em]",
};

const Button = ({
    children,
    variant = "studio",
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
                "inline-flex items-center justify-center transition-all duration-500 uppercase font-medium",
                VARIANTS[variant],
                SIZES[size],
                (disabled || loading) && "opacity-60 cursor-not-allowed",
                className
            )}
        >
            {/* The sliding background effect */}
            {variant === "studio" && (
                <div className="absolute inset-0 bg-zinc-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            )}

            {/* The Label */}
            <span className={clsx(
                "relative z-10 flex items-center gap-2 transition-colors duration-500",
                variant === "studio" && "group-hover:text-white"
            )}>
                {loading && (
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                )}
                {children}
            </span>
        </button>
    );
};

export default Button;
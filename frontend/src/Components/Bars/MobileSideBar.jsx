import {
    X,
    Home,
    List,
    Package,
    User,
    ShoppingCart,
    LayoutDashboard,
    ChevronRight,
    LogOut,
    TruckIcon,
    Zap,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const MobileSideBar = ({
    isMenuOpen,
    setIsMenuOpen,
    isAuthenticated,
    cartCount,
}) => {
    const { user } = useSelector((state) => state.auth);

    return (
        <>
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-500"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[70] md:hidden transform transition-transform duration-500 ease-out flex flex-col ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between p-6 border-b border-zinc-50">
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold tracking-[0.2em] uppercase text-zinc-900 leading-none">
                            Askar
                        </span>
                        <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-400 mt-1">
                            Famous for <br /> Quaility
                        </span>
                    </div>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 text-zinc-900 hover:rotate-90 transition-transform duration-500"
                    >
                        <X size={20} strokeWidth={1.2} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="mt-2 space-y-1">
                        <p className="px-8 text-xs uppercase tracking-[0.3em] text-zinc-400 mb-4">
                            Collections
                        </p>

                        <NavItem
                            setIsMenuOpen={setIsMenuOpen}
                            to="/"
                            icon={<Home size={18} strokeWidth={1.2} />}
                            label="Home"
                        />
                        <NavItem
                            setIsMenuOpen={setIsMenuOpen}
                            to="/collections"
                            icon={<List size={18} strokeWidth={1.2} />}
                            label="Collections"
                        />
                        <NavItem
                            setIsMenuOpen={setIsMenuOpen}
                            to="/products"
                            icon={<Package size={18} strokeWidth={1.2} />}
                            label="All Products"
                        />
                        <NavItem
                            setIsMenuOpen={setIsMenuOpen}
                            to="/about-us"
                            icon={<User size={18} strokeWidth={1.2} />}
                            label="About Us"
                        />
                        <NavItem
                            setIsMenuOpen={setIsMenuOpen}
                            to="/track-order"
                            icon={<TruckIcon size={18} strokeWidth={1.2} />}
                            label="Track Order"
                        />
                        <div className="pt-4 mt-4 border-t border-zinc-50">
                            {/* Cart hidden for buy-now flow */}
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-zinc-50">
                    <p className="text-[8px] uppercase tracking-[0.25em] text-zinc-300 text-center">
                        © E-Shop Studio Edition
                    </p>
                </div>
            </div>
        </>
    );
};

const NavItem = ({
    to,
    icon,
    label,
    badge,
    color = "text-zinc-400",
    setIsMenuOpen,
}) => (
    <Link
        to={to}
        onClick={() => setIsMenuOpen(false)}
        className="flex items-center gap-4 px-8 py-4 hover:bg-zinc-50 transition-all group"
    >
        <div className={`${color} group-hover:text-zinc-900 transition-colors`}>
            {icon}
        </div>
        <span className="text-md uppercase tracking-[0.15em] font-medium text-zinc-600 group-hover:text-zinc-900 flex-1">
            {label}
        </span>
        {badge > 0 ? (
            <span className="bg-zinc-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {badge}
            </span>
        ) : (
            <ChevronRight
                size={14}
                strokeWidth={1}
                className="text-zinc-200 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all"
            />
        )}
    </Link>
);

export default MobileSideBar;

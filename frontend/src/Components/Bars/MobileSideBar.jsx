import {
    X,
    Home,
    List,
    Package,
    Globe,
    Headphones,
    Building,
    User,
    Heart,
    ShoppingCart,
    LayoutDashboard,
    ChevronRight,
    LogOut,
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
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden transition-all duration-500 opacity-100"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[70] md:hidden transform transition-all duration-500 ease-out shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col ${
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between p-5 border-b border-slate-50">
                    <div className="flex items-center gap-2">
                        <img src="./logo.png" alt="Logo" className="h-7 w-7" />
                        <span className="font-black text-slate-900 text-lg tracking-tighter">
                            NAVIGATION
                        </span>
                    </div>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="p-6">
                        {isAuthenticated ? (
                            <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-xl shadow-slate-200">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                        <User
                                            size={24}
                                            className="text-white"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
                                            Welcome back
                                        </p>
                                        <p className="font-bold text-base truncate">
                                            {user?.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex-1 bg-white/10 hover:bg-white/20 text-center py-2 rounded-xl text-xs font-bold transition-colors"
                                    >
                                        Profile
                                    </Link>
                                    <button className="px-3 bg-red-500/20 hover:bg-red-500/40 text-red-200 py-2 rounded-xl transition-colors">
                                        <LogOut size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-primary rounded-3xl p-6 text-white shadow-xl shadow-primary/30">
                                <h3 className="font-black text-xl mb-2">
                                    Start Shopping
                                </h3>
                                <p className="text-white/80 text-xs mb-4 leading-relaxed">
                                    Login to track orders and manage your
                                    favorites.
                                </p>
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block w-full bg-white text-primary text-center py-3 rounded-2xl text-sm font-black uppercase tracking-wider shadow-lg"
                                >
                                    Login / Register
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="mt-2">
                        <p className="px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                            Menu
                        </p>

                        {user?.role === "admin" && (
                            <NavItem
                                setIsMenuOpen={setIsMenuOpen}
                                to="/admin-dashboard"
                                icon={<LayoutDashboard size={20} />}
                                label="Admin Panel"
                                color="text-indigo-500"
                            />
                        )}

                        <NavItem
                            setIsMenuOpen={setIsMenuOpen}
                            to="/"
                            icon={<Home size={20} />}
                            label="Home"
                        />
                        <NavItem
                            setIsMenuOpen={setIsMenuOpen}
                            to="/products"
                            icon={<List size={20} />}
                            label="Categories"
                        />
                        <NavItem
                            setIsMenuOpen={setIsMenuOpen}
                            to="/wishlist"
                            icon={<Heart size={20} />}
                            label="Favorites"
                        />
                        <NavItem
                            setIsMenuOpen={setIsMenuOpen}
                            to="/orders"
                            icon={<Package size={20} />}
                            label="My Orders"
                        />
                        <NavItem
                            setIsMenuOpen={setIsMenuOpen}
                            to="/cart"
                            icon={<ShoppingCart size={20} />}
                            label="My Cart"
                            badge={cartCount}
                        />
                    </div>

                    <div className="mt-6 border-t border-slate-50 pt-6 pb-10">
                        <p className="px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                            Support
                        </p>
                        <NavItem
                            setIsMenuOpen={setIsMenuOpen}
                            to="/contact"
                            icon={<Headphones size={20} />}
                            label="Help Center"
                        />
                        <NavItem
                            setIsMenuOpen={setIsMenuOpen}
                            to="/about"
                            icon={<Building size={20} />}
                            label="About Us"
                        />
                    </div>
                </div>

                <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                            © 2026 E-Store
                        </span>
                        <div className="flex gap-4">
                            <Globe size={16} />
                            <span className="text-[10px] font-bold uppercase">
                                EN
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileSideBar;

const NavItem = ({
    to,
    icon,
    label,
    badge,
    color = "text-slate-600",
    setIsMenuOpen,
}) => (
    <Link
        to={to}
        onClick={() => setIsMenuOpen(false)}
        className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-all active:bg-slate-100 group"
    >
        <div
            className={`p-2 rounded-xl bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-all ${color}`}
        >
            {icon}
        </div>
        <span className="font-bold text-slate-700 text-sm flex-1 uppercase tracking-wide">
            {label}
        </span>
        {badge > 0 ? (
            <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg">
                {badge}
            </span>
        ) : (
            <ChevronRight
                size={16}
                className="text-slate-300 group-hover:translate-x-1 transition-transform"
            />
        )}
    </Link>
);

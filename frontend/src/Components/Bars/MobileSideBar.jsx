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
                    className="fixed inset-0 bg-black/40 z-[60] md:hidden transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[70] md:hidden transform transition-transform duration-300 shadow-xl flex flex-col ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <img src="./logo.png" alt="Logo" className="h-6 w-6" />
                        <span className="font-semibold text-gray-900 text-base">
                            Menu
                        </span>
                    </div>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="p-4">
                        {isAuthenticated ? (
                            <div className="bg-gray-900 rounded-lg p-4 text-white">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                        <User
                                            size={20}
                                            className="text-white"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-white/60">
                                            Welcome back
                                        </p>
                                        <p className="font-semibold text-sm truncate">
                                            {user?.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex-1 bg-white/10 hover:bg-white/20 text-center py-2 rounded-lg text-xs font-medium transition-colors"
                                    >
                                        Profile
                                    </Link>
                                    <button className="px-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 py-2 rounded-lg transition-colors">
                                        <LogOut size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-blue-600 rounded-lg p-4 text-white">
                                <h3 className="font-semibold text-lg mb-1">
                                    Start Shopping
                                </h3>
                                <p className="text-white/80 text-xs mb-3 leading-relaxed">
                                    Login to track orders and manage your
                                    favorites.
                                </p>
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block w-full bg-white text-blue-600 text-center py-2 rounded-lg text-sm font-medium"
                                >
                                    Login / Register
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="mt-2">
                        <p className="px-4 text-xs font-medium text-gray-500 mb-2">
                            Menu
                        </p>

                        {user?.role === "admin" && (
                            <NavItem
                                setIsMenuOpen={setIsMenuOpen}
                                to="/admin-dashboard"
                                icon={<LayoutDashboard size={20} />}
                                label="Admin Panel"
                                color="text-indigo-600"
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

                    <div className="mt-4 border-t border-gray-100 pt-4 pb-8">
                        <p className="px-4 text-xs font-medium text-gray-500 mb-2">
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

                <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between text-gray-500">
                        <span className="text-xs">
                            © 2026 E-Store
                        </span>
                        <div className="flex gap-2 items-center">
                            <Globe size={14} />
                            <span className="text-xs">
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
    color = "text-gray-600",
    setIsMenuOpen,
}) => (
    <Link
        to={to}
        onClick={() => setIsMenuOpen(false)}
        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
    >
        <div
            className={`p-1.5 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors ${color}`}
        >
            {icon}
        </div>
        <span className="font-medium text-gray-700 text-sm flex-1">
            {label}
        </span>
        {badge > 0 ? (
            <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                {badge}
            </span>
        ) : (
            <ChevronRight
                size={16}
                className="text-gray-300 group-hover:translate-x-0.5 transition-transform"
            />
        )}
    </Link>
);
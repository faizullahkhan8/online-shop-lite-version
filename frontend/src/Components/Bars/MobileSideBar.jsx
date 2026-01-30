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
            {/* Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white z-50 md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Sidebar Content */}
                <div className="flex flex-col h-full">
                    {/* Close Button */}
                    <div className="flex justify-end p-4 border-b border-gray-200">
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto">
                        {/* User Section */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User size={24} className="text-gray-400" />
                                </div>
                                <div>
                                    {isAuthenticated ? (
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {user?.name}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                }}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    ) : (
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-gray-900 font-medium"
                                        >
                                            Sign in | Register
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Main Navigation */}
                        <div className="py-2">
                            {user?.role === "admin" && (
                                <Link
                                    to="/admin-dashboard"
                                    className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                                >
                                    <LayoutDashboard
                                        size={20}
                                        className="text-gray-400"
                                    />
                                    <span className="text-sm">
                                        Admin Dashboard
                                    </span>
                                </Link>
                            )}
                            <Link
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                            >
                                <Home size={20} className="text-gray-400" />
                                <span className="font-medium">Home</span>
                            </Link>

                            <Link
                                to="/products"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                            >
                                <List size={20} className="text-gray-400" />
                                <span className="font-medium">Categories</span>
                            </Link>

                            <Link
                                to="/wishlist"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                            >
                                <Heart size={20} className="text-gray-400" />
                                <span className="font-medium">Favorites</span>
                            </Link>

                            <Link
                                to="/orders"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                            >
                                <Package size={20} className="text-gray-400" />
                                <span className="font-medium">My orders</span>
                            </Link>

                            <Link
                                to="/cart"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                            >
                                <ShoppingCart
                                    size={20}
                                    className="text-gray-400"
                                />
                                <span className="font-medium">My cart</span>
                                {cartCount > 0 && (
                                    <span className="ml-auto bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileSideBar;

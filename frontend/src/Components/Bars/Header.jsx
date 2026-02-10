import {
    Search,
    User,
    ShoppingCart,
    Heart,
    Menu,
    LogOut,
    LayoutDashboard,
    ChevronDown,
    Package,
    Globe,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutUser } from "../../api/hooks/user.api";
import { logout } from "../../store/slices/authSlice";

import MobileSideBar from "./MobileSideBar";

const NavIcon = ({ to, icon, label, badge }) => (
    <Link
        to={to}
        className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors relative group"
    >
        <div className="relative p-1.5 rounded-lg group-hover:bg-blue-50 transition-colors">
            {icon}
            {badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {badge}
                </span>
            )}
        </div>
        <span className="text-xs font-medium hidden lg:block">
            {label}
        </span>
    </Link>
);

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userDropDownOpen, setUserDropDownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const cartItems = useSelector((state) => state.cart.items);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const role = user?.role;
    const dispatch = useDispatch();
    const { logoutUser } = useLogoutUser();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery?.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate("/products");
        }
    };

    const handleSignOut = async () => {
        const response = await logoutUser();
        if (response.success) {
            dispatch(logout());
            setUserDropDownOpen(false);
            navigate("/");
        }
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Promotions", path: "/promotions" },
        { name: "Contact Us", path: "/contact-us" },
        { name: "About Us", path: "/about-us" },
    ];

    return (
        <header className="bg-white z-50 shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between gap-4 md:gap-8 h-16">
                    <Link
                        to="/"
                        className="flex items-center gap-2 shrink-0 group"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                                <Globe className="text-white" size={24} />
                            </div>
                            <div>
                                <p className="font-semibold text-base text-gray-900">
                                    E-Shop
                                </p>
                                <p className="text-xs text-gray-500">By Faiz Ullah Khan</p>
                            </div>
                        </div>
                    </Link>

                    <div className="hidden md:flex flex-1 max-w-xl">
                        <div className="flex w-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                            <div className="flex items-center pl-3 text-gray-400">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSearch(e);
                                }}
                                placeholder="Search products..."
                                className="flex-1 px-3 py-2 outline-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-blue-600 text-white px-6 py-2 font-medium text-sm hover:bg-blue-700 transition-colors"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4 lg:gap-6 relative">
                        <NavIcon
                            to="/wishlist"
                            icon={<Heart size={20} />}
                            label="Wishlist"
                        />
                        <NavIcon
                            to="/orders"
                            icon={<Package size={20} />}
                            label="Orders"
                        />
                        <NavIcon
                            to="/cart"
                            icon={<ShoppingCart size={20} />}
                            label="Cart"
                            badge={cartCount}
                        />

                        <div className="h-6 w-px bg-gray-200 mx-1"></div>

                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    className="flex items-center gap-2 p-1 pr-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-gray-50 transition-all"
                                    onClick={() =>
                                        setUserDropDownOpen(!userDropDownOpen)
                                    }
                                >
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
                                        <User size={18} />
                                    </div>
                                    <ChevronDown
                                        size={14}
                                        className={`text-gray-400 transition-transform ${userDropDownOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {userDropDownOpen && (
                                    <>
                                        <div
                                            onClick={() =>
                                                setUserDropDownOpen(false)
                                            }
                                            className="fixed inset-0 z-40"
                                        ></div>
                                        <div className="absolute top-full right-0 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200 p-2 z-50">
                                            <div className="px-3 py-2 border-b border-gray-100 mb-1">
                                                <p className="text-xs text-gray-500 font-medium">
                                                    Account
                                                </p>
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {user?.name || "User"}
                                                </p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                className="flex gap-2 items-center hover:bg-gray-50 p-2 rounded-lg cursor-pointer text-gray-700 hover:text-blue-600 transition-colors"
                                                onClick={() =>
                                                    setUserDropDownOpen(false)
                                                }
                                            >
                                                <User size={18} />
                                                <span className="text-sm font-medium">
                                                    Profile Settings
                                                </span>
                                            </Link>
                                            {role === "admin" && (
                                                <Link
                                                    to="/admin-dashboard"
                                                    className="flex gap-2 items-center hover:bg-gray-50 p-2 rounded-lg cursor-pointer text-gray-700 hover:text-blue-600 transition-colors"
                                                    onClick={() =>
                                                        setUserDropDownOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    <LayoutDashboard
                                                        size={18}
                                                    />
                                                    <span className="text-sm font-medium">
                                                        Admin Panel
                                                    </span>
                                                </Link>
                                            )}
                                            <div className="my-1 border-t border-gray-100"></div>
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex gap-2 items-center hover:bg-red-50 p-2 rounded-lg cursor-pointer text-red-600 transition-colors"
                                            >
                                                <LogOut size={18} />
                                                <span className="text-sm font-medium">
                                                    Sign Out
                                                </span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-3"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    <button
                        className="md:hidden p-2 rounded-lg bg-gray-50 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            <div className="md:hidden px-4 pb-3">
                <div className="flex w-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:bg-white focus-within:border-blue-500 transition-all">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="flex-1 px-3 py-2 outline-none bg-transparent text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className="px-3 text-gray-400"
                    >
                        <Search size={18} />
                    </button>
                </div>
            </div>

            <MobileSideBar
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                isAuthenticated={isAuthenticated}
                cartCount={cartCount}
            />

            <div className="container mx-auto px-4 lg:px-8 py-2!">
                <nav className="flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors ${location.pathname === link.path
                                ? "text-blue-600"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Header;
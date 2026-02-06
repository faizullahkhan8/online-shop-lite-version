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
        className="flex flex-col items-center gap-1.5 text-slate-600 hover:text-primary transition-all duration-300 relative group"
    >
        <div className="relative p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
            {icon}
            {badge > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-lg animate-in zoom-in duration-300">
                    {badge}
                </span>
            )}
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider hidden lg:block opacity-80 group-hover:opacity-100">
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
        { name: "Contact Us", path: "/contact-us" },
        { name: "About Us", path: "/about-us" },
    ];

    return (
        <header className="bg-white/80 backdrop-blur-md z-50 shadow-sm border-b border-slate-300">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between gap-4 md:gap-10 h-20">
                    <Link
                        to="/"
                        className="flex items-center gap-3 shrink-0 group transition-transform active:scale-95"
                    >
                        <div className="flex items-center gap-2 animate-in fade-in duration-300">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                                <Globe className="text-white" size={28} />
                            </div>
                            <div>
                                <p className="font-black text-lg uppercase tracking-tighter text-slate-900">
                                    E-Shop
                                </p>
                                <p className="text-xs">By Faiz Ullah Khan</p>
                            </div>
                        </div>
                    </Link>

                    <div className="hidden md:flex flex-1 max-w-2xl group">
                        <div className="flex w-full bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300">
                            <div className="flex items-center pl-4 text-slate-400">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSearch(e);
                                }}
                                placeholder="Search premium products..."
                                className="flex-1 px-4 py-3 outline-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="hidden lg:block border-l border-slate-200 my-2"></div>

                            <button
                                onClick={handleSearch}
                                className="bg-primary text-white px-8 py-3 font-bold text-sm hover:bg-primary-dark transition-all active:scale-95 shadow-lg shadow-primary/20"
                            >
                                SEARCH
                            </button>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 lg:gap-6 relative">
                        <NavIcon
                            to="/wishlist"
                            icon={<Heart size={22} />}
                            label="Wishlist"
                        />
                        <NavIcon
                            to="/orders"
                            icon={<Package size={22} />}
                            label="Orders"
                        />
                        <NavIcon
                            to="/cart"
                            icon={<ShoppingCart size={22} />}
                            label="Cart"
                            badge={cartCount}
                        />

                        <div className="h-8 w-px bg-slate-200 mx-2"></div>

                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    className="flex items-center gap-2 p-1 pr-3 rounded-full border border-slate-100 hover:border-primary/30 hover:bg-slate-50 transition-all duration-300 shadow-sm"
                                    onClick={() =>
                                        setUserDropDownOpen(!userDropDownOpen)
                                    }
                                >
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                                        <User size={20} />
                                    </div>
                                    <ChevronDown
                                        size={14}
                                        className={`text-slate-400 transition-transform duration-300 ${userDropDownOpen ? "rotate-180" : ""}`}
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
                                        <div className="absolute top-[120%] right-0 w-56 rounded-2xl bg-white shadow-2xl shadow-slate-200/50 border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-100">
                                            <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    Account
                                                </p>
                                                <p className="text-sm font-bold text-slate-700 truncate">
                                                    {user?.name || "User"}
                                                </p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                className="flex gap-3 items-center hover:bg-slate-50 p-3 rounded-xl cursor-pointer text-slate-600 hover:text-primary transition-colors"
                                                onClick={() =>
                                                    setUserDropDownOpen(false)
                                                }
                                            >
                                                <User size={18} />
                                                <span className="text-sm font-semibold">
                                                    Profile Settings
                                                </span>
                                            </Link>
                                            {role === "admin" && (
                                                <Link
                                                    to="/admin-dashboard"
                                                    className="flex gap-3 items-center hover:bg-slate-50 p-3 rounded-xl cursor-pointer text-slate-600 hover:text-primary transition-colors"
                                                    onClick={() =>
                                                        setUserDropDownOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    <LayoutDashboard
                                                        size={18}
                                                    />
                                                    <span className="text-sm font-semibold">
                                                        Admin Panel
                                                    </span>
                                                </Link>
                                            )}
                                            <div className="my-1 border-t border-slate-50"></div>
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex gap-3 items-center hover:bg-red-50 p-3 rounded-xl cursor-pointer text-red-500 transition-colors"
                                            >
                                                <LogOut size={18} />
                                                <span className="text-sm font-semibold">
                                                    Sign Out
                                                </span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="text-sm font-bold text-slate-600 hover:text-primary transition-colors px-2"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
                                >
                                    Join Now
                                </Link>
                            </div>
                        )}
                    </div>

                    <button
                        className="md:hidden p-2 rounded-xl bg-slate-50 text-slate-600 hover:text-primary hover:bg-primary/10 transition-all"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            <div className="md:hidden px-4 pb-4">
                <div className="flex w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-primary transition-all">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="flex-1 px-4 py-2.5 outline-none bg-transparent text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className="px-4 text-slate-400"
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

            <div className="container mx-auto px-4 lg:px-8 py-3!">
                <nav className="flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm uppercase transition-all font-semibold duration-100 ${
                                location.pathname === link.path
                                    ? "text-slate-900 border-b-2 border-slate-900 pb-1"
                                    : "text-slate-400 hover:text-slate-900"
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

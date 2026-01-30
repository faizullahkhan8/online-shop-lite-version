import {
    Search,
    User,
    ShoppingCart,
    Heart,
    Menu,
    LogOut,
    LayoutDashboard,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutUser } from "../../api/hooks/user.api";
import { logout } from "../../store/slices/authSlice";

import MobileSideBar from "./MobileSideBar";
import NavigationBar from "./NavigationBar.jsx";

const NavIcon = ({ to, icon, label, badge }) => (
    <Link
        to={to}
        className="flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors relative group"
    >
        <div className="relative">
            {icon}
            {badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                    {badge}
                </span>
            )}
        </div>
        <span className="text-xs hidden md:block group-hover:text-primary transition-colors">
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

    useEffect(() => {
        if (searchQuery !== undefined) {
            if (searchQuery) {
                navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            } else if (searchQuery === "") {
                // If user cleared search manually
                // Optional: navigate('/products') to clear filter
            }
        }
    }, [searchQuery]);

    const handleSignOut = async () => {
        const response = await logoutUser();
        if (response.success) {
            dispatch(logout());
            setUserDropDownOpen(false);
            navigate("/");
        }
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            {/* Main Header */}
            <div className="container py-4 flex items-center justify-between gap-8 h-20">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 flex-shrink-0 group"
                >
                    <img
                        src="./logo.png"
                        alt="App Logo"
                        className="h-10 w-10 object-contain rounded-md"
                    />
                    <span className="text-2xl font-bold text-primary-dark group-hover:text-primary transition-colors">
                        E-Store by Faiz
                    </span>
                </Link>

                {/* Search Bar - Desktop */}
                <div className="hidden md:flex flex-1 max-w-2xl">
                    <div className="flex w-full border border-primary rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:shadow-md transition-all">
                        <input
                            type="text"
                            placeholder="Search for products, brands, and more..."
                            className="flex-1 px-4 py-2.5 outline-none text-gray-700 placeholder:text-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="border-l border-gray-200 relative">
                            <select className="appearance-none bg-gray-50 px-4 py-2.5 pr-8 outline-none text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors h-full font-medium">
                                <option>All category</option>
                                <option>Electronics</option>
                                <option>Clothes</option>
                                <option>Home & Garden</option>
                                <option>Sports</option>
                            </select>
                        </div>
                        <button className="bg-primary text-white px-6 py-2.5 font-medium hover:bg-primary-dark transition-all active:scale-95">
                            Search
                        </button>
                    </div>
                </div>

                {/* User Actions - Desktop */}
                <div className="hidden md:flex items-center gap-3 relative">
                    <NavIcon
                        to="/wishlist"
                        icon={<Heart size={18} />}
                        label="Wishlist"
                    />
                    <NavIcon
                        to="/orders"
                        icon={<ShoppingCart size={18} />}
                        label="Orders"
                    />
                    <NavIcon
                        to="/cart"
                        icon={<ShoppingCart size={18} />}
                        label="My Cart"
                        badge={cartCount}
                    />
                    {isAuthenticated ? (
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border border-gray-200 hover:border-primary transition-colors bg-gray-100"
                            onClick={() =>
                                setUserDropDownOpen(!userDropDownOpen)
                            }
                        >
                            <User className="text-gray-500" />
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link
                                to="/login"
                                className="bg-primary text-white p-1 font-xs hover:bg-primary-dark transition-all rounded-md"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-primary text-white p-1 font-xs hover:bg-primary-dark transition-all rounded-md"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                    {userDropDownOpen && (
                        <>
                            <div
                                onClick={() => setUserDropDownOpen(false)}
                                className="w-full h-screen fixed top-0
                             left-0 inset-0                             "
                            ></div>
                            <div className="flex flex-col gap-2 absolute top-full right-0 w-max rounded-md bg-white shadow-md p-2 border border-gray-200 z-50">
                                <Link
                                    to="/profile"
                                    className="flex gap-4 items-center hover:bg-gray-100 p-1 rounded-md cursor-pointer"
                                >
                                    <User size={16} />
                                    <span className="text-sm">Profile</span>
                                </Link>
                                {role === "admin" && (
                                    <Link
                                        to="/admin-dashboard"
                                        className="flex gap-4 items-center hover:bg-gray-100 p-1 rounded-md cursor-pointer"
                                    >
                                        <LayoutDashboard size={16} />
                                        <span className="text-sm">
                                            Admin Dashboard
                                        </span>
                                    </Link>
                                )}
                                <div
                                    onClick={handleSignOut}
                                    className="flex gap-4 items-center hover:bg-gray-100 p-1 rounded-md cursor-pointer text-red-500"
                                >
                                    <LogOut size={16} />
                                    <span className="text-sm">Logout</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-600 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Search Bar */}
            <div className="md:hidden container py-2 h-16">
                <div className="flex w-full border border-gray-300 rounded-lg overflow-hidden focus-within:border-primary transition-colors">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="flex-1 px-4 py-2 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="bg-gray-100 px-4 py-2 hover:bg-gray-200 transition-colors">
                        <Search size={20} className="text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Enhanced Navigation Bar */}
            <NavigationBar />

            {/* Mobile Sidebar Navigation */}
            <MobileSideBar
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                isAuthenticated={isAuthenticated}
                cartCount={cartCount}
            />
        </header>
    );
};

export default Header;

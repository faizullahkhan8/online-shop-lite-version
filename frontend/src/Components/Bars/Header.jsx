import {
    Search,
    User,
    Menu,
    ChevronDown,
    X,
    Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutUser } from "../../api/hooks/user.api";
import { logout } from "../../store/slices/authSlice";
import { useGetAllCollections } from "../../api/hooks/collection.api";

const Header = () => {
    const [userDropDownOpen, setUserDropDownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCollectionOpen, setIsCollectionOpen] = useState(false);
    const [collections, setCollections] = useState([]);

    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { logoutUser } = useLogoutUser();
    const { getAllCollections, loading } = useGetAllCollections();

    const role = user?.role;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery?.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
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

    useEffect(() => {
        (async () => {
            const response = await getAllCollections();
            if (response.success) {
                setCollections(response.collections);
            }
        })()
    }, [])

    if (loading) {
        return <Loader2 size={24} />
    }

    return (
        <header className="bg-gray-100 z-50 border-b border-zinc-100 sticky top-0">
            <div className="container mx-auto px-4 lg:px-12">
                <div className="flex items-center justify-between h-20">

                    <div className="hidden lg:flex items-center gap-12 flex-1">
                        <nav className="flex items-center gap-8">
                            <Link
                                to="/"
                                className={`text-md uppercase tracking-[0.2em] font-medium transition-colors ${location.pathname === "/" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-900"}`}
                            >
                                Home
                            </Link>

                            <div
                                className="relative py-8"
                                onMouseEnter={() => setIsCollectionOpen(true)}
                                onMouseLeave={() => setIsCollectionOpen(false)}
                            >
                                <button
                                    onClick={() => navigate("/collections")}
                                    className={`flex items-center gap-2 text-md uppercase tracking-[0.2em] font-medium transition-colors ${isCollectionOpen ? "text-zinc-900" : "text-zinc-400"}`}
                                >
                                    Collections
                                    <ChevronDown size={10} className={`transition-transform duration-300 ${isCollectionOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isCollectionOpen && (
                                    <div className="absolute top-full left-0 w-[600px] bg-white border border-zinc-100 shadow-2xl p-8 z-[100] grid grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {collections?.map((link) => (
                                            <li key={link.name}>
                                                <Link
                                                    to={link.path}
                                                    className="text-sm uppercase tracking-[0.15em] text-zinc-400 hover:text-zinc-900 transition-colors block"
                                                    onClick={() => setIsCollectionOpen(false)}
                                                >
                                                    {link.name}
                                                </Link>
                                            </li>
                                        ))}

                                    </div>
                                )}
                            </div>

                            <Link
                                to="/track-order"
                                className={`text-md uppercase tracking-[0.2em] font-medium transition-colors ${location.pathname === "/track-order" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-900"}`}
                            >
                                Track order
                            </Link>
                        </nav>
                    </div>

                    <Link to="/" className="flex flex-col items-center flex-1 lg:flex-none">
                        <span className="text-xl font-semibold tracking-[0.3em] uppercase text-zinc-900 leading-none">
                            E-Shop
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-400 mt-1">
                            Studio Edition
                        </span>
                    </Link>

                    <div className="flex items-center justify-end gap-5 lg:gap-8 flex-1">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-zinc-900 hover:text-zinc-500 transition-colors"
                        >
                            <Search size={19} strokeWidth={1.5} />
                        </button>

                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    className="flex items-center gap-1 text-zinc-900"
                                    onClick={() => setUserDropDownOpen(!userDropDownOpen)}
                                >
                                    <User size={19} strokeWidth={1.5} />
                                    <ChevronDown size={12} className={`transition-transform duration-300 ${userDropDownOpen ? "rotate-180" : ""}`} />
                                </button>

                                {userDropDownOpen && (
                                    <>
                                        <div onClick={() => setUserDropDownOpen(false)} className="fixed inset-0 z-40"></div>
                                        <div className="absolute top-full right-0 mt-4 w-48 bg-white shadow-2xl border border-zinc-100 p-2 z-50">
                                            <div className="px-3 py-3 border-b border-zinc-50 mb-1">
                                                <p className="text-[9px] uppercase tracking-[0.15em] text-zinc-400 mb-1">Account</p>
                                                <p className="text-md font-medium text-zinc-900 truncate uppercase tracking-widest">
                                                    {user?.name}
                                                </p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                className="flex items-center px-3 py-2 text-sm uppercase tracking-[0.15em] text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                                                onClick={() => setUserDropDownOpen(false)}
                                            >
                                                Profile
                                            </Link>
                                            {role === "admin" && (
                                                <Link
                                                    to="/admin-dashboard"
                                                    className="flex items-center px-3 py-2 text-sm uppercase tracking-[0.15em] text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                                                    onClick={() => setUserDropDownOpen(false)}
                                                >
                                                    Dashboard
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full text-left px-3 py-2 text-sm uppercase tracking-[0.15em] text-red-500 hover:bg-red-50 transition-all"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="text-md uppercase tracking-[0.2em] font-medium text-zinc-900 border-b border-zinc-900 pb-0.5 hover:text-zinc-400 hover:border-zinc-400 transition-all">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {isSearchOpen && (
                <div className="absolute inset-0 bg-white z-[60] flex items-center px-4 lg:px-12 animate-in fade-in slide-in-from-top duration-500">
                    <form onSubmit={handleSearch} className="container mx-auto flex items-center gap-6">
                        <Search size={20} className="text-zinc-400" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="SEARCH COLLECTIONS..."
                            className="flex-1 bg-transparent border-none outline-none text-[12px] uppercase tracking-[0.25em] text-zinc-900 placeholder:text-zinc-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(false)}
                            className="p-2 hover:rotate-90 transition-transform duration-500"
                        >
                            <X size={20} strokeWidth={1.2} />
                        </button>
                    </form>
                </div>
            )}
        </header>
    );
};

export default Header;

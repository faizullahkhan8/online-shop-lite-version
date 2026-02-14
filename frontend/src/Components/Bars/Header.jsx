import { Search, User, Menu, ChevronDown, X, Loader2 } from "lucide-react";
import MobileSideBar from "./MobileSideBar";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { useGetAllCollections } from "../../api/hooks/collection.api";

const Header = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCollectionOpen, setIsCollectionOpen] = useState(false);
    const [collections, setCollections] = useState([]);

    const { isAuthenticated } = useSelector((state) => state.auth);
    const cartItems = useSelector((state) => state.cart?.items || []);
    const cartCount = cartItems.reduce(
        (acc, it) => acc + (it.quantity || 1),
        0,
    );
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { getAllCollections, loading } = useGetAllCollections();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery?.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    useEffect(() => {
        (async () => {
            const response = await getAllCollections();
            if (response.success) {
                setCollections(response.collections);
            }
        })();
    }, []);

    if (loading) {
        return <Loader2 size={24} />;
    }

    return (
        <header className="bg-gray-100 z-50 border-b border-zinc-100 sticky top-0">
            <div className="container mx-auto px-4 lg:px-12">
                <div className="flex items-center justify-between h-20">
                    <div className="hidden lg:flex items-center gap-12">
                        <Link
                            to="/"
                            className="flex flex-col items-center flex-1 lg:flex-none"
                        >
                            <span className="text-xl font-semibold tracking-[0.3em] uppercase text-zinc-900 leading-none">
                                E-Shop
                            </span>
                            <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-400 mt-1">
                                Studio Edition
                            </span>
                        </Link>
                        <nav className="flex items-center gap-8">
                            <Link
                                to="/"
                                className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors ${location.pathname === "/" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-900"}`}
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
                                    className={`flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium transition-colors ${isCollectionOpen ? "text-zinc-900" : "text-zinc-400"}`}
                                >
                                    Collections
                                    <ChevronDown
                                        size={10}
                                        className={`transition-transform duration-300 ${isCollectionOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {isCollectionOpen && (
                                    <div className="absolute top-full left-0 w-150 bg-white border border-zinc-100 shadow-2xl p-8 z-100 grid grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {collections?.map((link) => (
                                            <Link
                                                key={link.name}
                                                to={`/products?collection=${link._id}`}
                                                className="text-xs uppercase tracking-[0.15em] text-zinc-400 hover:text-zinc-900 transition-colors block"
                                                onClick={() =>
                                                    setIsCollectionOpen(false)
                                                }
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Link
                                to="/products"
                                className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors ${location.pathname === "/track-order" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-900"}`}
                            >
                                All Products
                            </Link>

                            <Link
                                to="/track-order"
                                className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors ${location.pathname === "/track-order" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-900"}`}
                            >
                                Track order
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center justify-end gap-5 lg:gap-8 flex-1">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="md:hidden text-zinc-900 hover:text-zinc-500 transition-colors"
                        >
                            <Menu size={20} strokeWidth={1.5} />
                        </button>

                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-zinc-900 hover:text-zinc-500 transition-colors"
                        >
                            <Search size={19} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>

            {isSearchOpen && (
                <div className="absolute inset-0 bg-white z-[60] flex items-center px-4 lg:px-12 animate-in fade-in slide-in-from-top duration-500">
                    <form
                        onSubmit={handleSearch}
                        className="container mx-auto flex items-center gap-6"
                    >
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

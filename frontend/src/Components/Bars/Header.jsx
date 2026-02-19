// import { Search, User, Menu, ChevronDown, X, Loader2 } from "lucide-react";
// import MobileSideBar from "./MobileSideBar";
// import { useEffect, useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";

// import { useGetAllCollections } from "../../api/hooks/collection.api";

// const Header = () => {
//     const [searchQuery, setSearchQuery] = useState("");
//     const [isSearchOpen, setIsSearchOpen] = useState(false);
//     const [isCollectionOpen, setIsCollectionOpen] = useState(false);
//     const [collections, setCollections] = useState([]);

//     const { isAuthenticated } = useSelector((state) => state.auth);
//     const cartItems = useSelector((state) => state.cart?.items || []);
//     const cartCount = cartItems.reduce(
//         (acc, it) => acc + (it.quantity || 1),
//         0,
//     );
//     const [isMenuOpen, setIsMenuOpen] = useState(false);

//     const navigate = useNavigate();
//     const location = useLocation();

//     const { getAllCollections, loading } = useGetAllCollections();

//     const handleSearch = (e) => {
//         e.preventDefault();
//         if (searchQuery?.trim()) {
//             navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
//             setIsSearchOpen(false);
//         }
//     };

//     useEffect(() => {
//         (async () => {
//             const response = await getAllCollections();
//             if (response.success) {
//                 setCollections(response.collections);
//             }
//         })();
//     }, []);

//     if (loading) {
//         return <Loader2 size={24} />;
//     }

//     return (
//         <header className="bg-gray-100 z-50 border-b border-zinc-100 sticky top-0">
//             <div className="container mx-auto px-4 lg:px-12">
//                 <div className="flex items-center justify-between h-20">
//                     <div className="hidden lg:flex items-center gap-12">
//                         <Link
//                             to="/"
//                             className="flex flex-col items-center flex-1 lg:flex-none"
//                         >
//                             <span className="text-xl font-semibold tracking-[0.3em] uppercase text-zinc-900 leading-none">
//                                 Askar
//                             </span>
//                             <span className="text-xs uppercase text-center tracking-[0.25em] text-zinc-500 mt-1">
//                                 Famous for <br /> Quaility
//                             </span>
//                         </Link>
//                         <nav className="flex items-center gap-8">
//                             <Link
//                                 to="/"
//                                 className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors ${location.pathname === "/" ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}
//                             >
//                                 Home
//                             </Link>

//                             <div
//                                 className="relative py-8"
//                                 onMouseEnter={() => setIsCollectionOpen(true)}
//                                 onMouseLeave={() => setIsCollectionOpen(false)}
//                             >
//                                 <button
//                                     onClick={() => navigate("/collections")}
//                                     className={`flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer ${isCollectionOpen ? "text-zinc-900" : "text-zinc-500"}`}
//                                 >
//                                     Collections
//                                     <ChevronDown
//                                         size={10}
//                                         className={`transition-transform duration-300 ${isCollectionOpen ? "rotate-180" : ""}`}
//                                     />
//                                 </button>

//                                 {isCollectionOpen && (
//                                     <div className="absolute top-full left-0 w-150 bg-white border border-zinc-100 rounded-2xl shadow-2xl p-8 z-100 grid grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
//                                         {collections?.map((link) => (
//                                             <Link
//                                                 key={link.name}
//                                                 to={`/products?collection=${link._id}`}
//                                                 className="text-xs uppercase tracking-[0.15em] text-zinc-500 hover:text-zinc-900 transition-colors block"
//                                                 onClick={() =>
//                                                     setIsCollectionOpen(false)
//                                                 }
//                                             >
//                                                 {link.name}
//                                             </Link>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                             <Link
//                                 to="/products"
//                                 className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors ${location.pathname === "/track-order" ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}
//                             >
//                                 All Products
//                             </Link>

//                             <Link
//                                 to="/track-order"
//                                 className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors ${location.pathname === "/track-order" ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}
//                             >
//                                 Track order
//                             </Link>
//                             <Link
//                                 to="/about-us"
//                                 className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors ${location.pathname === "/about-us" ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}
//                             >
//                                 About Us
//                             </Link>
//                         </nav>
//                     </div>

//                     <div className="flex items-center justify-end gap-5 lg:gap-8 flex-1">
//                         <button
//                             onClick={() => setIsSearchOpen(true)}
//                             className="text-zinc-900 hover:text-zinc-700 transition-colors"
//                         >
//                             <Search size={19} strokeWidth={1.5} />
//                         </button>
//                         <button
//                             onClick={() => setIsMenuOpen(true)}
//                             className="md:hidden text-zinc-900 hover:text-zinc-700 transition-colors"
//                         >
//                             <Menu size={20} strokeWidth={1.5} />
//                         </button>

//                     </div>
//                 </div>
//             </div>

//             {isSearchOpen && (
//                 <div className="absolute inset-0 bg-white z-[60] flex items-center px-4 lg:px-12 animate-in fade-in slide-in-from-top duration-500">
//                     <form
//                         onSubmit={handleSearch}
//                         className="container mx-auto flex items-center gap-6"
//                     >
//                         <Search size={20} className="text-zinc-500" />
//                         <input
//                             autoFocus
//                             type="text"
//                             placeholder="SEARCH COLLECTIONS..."
//                             className="flex-1 bg-transparent border-none outline-none text-[12px] uppercase tracking-[0.25em] text-zinc-900 placeholder:text-zinc-300"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                         <button
//                             type="button"
//                             onClick={() => setIsSearchOpen(false)}
//                             className="p-2 hover:rotate-90 transition-transform duration-500"
//                         >
//                             <X size={20} strokeWidth={1.2} />
//                         </button>
//                     </form>
//                 </div>
//             )}
//             <MobileSideBar
//                 isMenuOpen={isMenuOpen}
//                 setIsMenuOpen={setIsMenuOpen}
//                 isAuthenticated={isAuthenticated}
//                 cartCount={cartCount}
//             />
//         </header>
//     );
// };

// export default Header;

import { Search, User, Menu, ChevronDown, X, Loader2 } from "lucide-react";
import MobileSideBar from "./MobileSideBar";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCollections } from "../../features/collections/collection.queries";

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

    const { data, isLoading } = useCollections();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery?.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    // Close search on route change
    useEffect(() => {
        setIsSearchOpen(false);
    }, [location]);

    // Close collection dropdown on outside click
    useEffect(() => {
        const handleClickOutside = () => setIsCollectionOpen(false);
        if (isCollectionOpen) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isCollectionOpen]);

    if (isLoading) {
        return (
            <div className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 bg-white flex items-center justify-center border-b border-zinc-100">
                <Loader2 className="animate-spin text-zinc-500 w-5 h-5" />
            </div>
        );
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#fafafa] border-b border-zinc-100">
            {/* Main header row */}
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 h-20 sm:h-20 lg:h-20 max-w-screen-2xl mx-auto">
                {/* Left: Hamburger (mobile only) */}
                <button
                    onClick={() => {
                        setIsMenuOpen(true);
                        console.log("The button is clicked. ");
                    }}
                    className="md:hidden z-50 text-zinc-900 hover:text-zinc-700 transition-colors p-1 -ml-1 flex-shrink-0"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Center on mobile / Left on desktop: Logo */}
                <div className="absolute left-1/2 -translate-x-1/2 md:static md:left-auto md:translate-x-0 md:flex-shrink-0">
                    <Link
                        to="/"
                        className="block text-center leading-tight"
                        aria-label="Home"
                    >
                        <span className="block text-sm sm:text-sm font-bold tracking-widest uppercase text-zinc-900 whitespace-nowrap">
                            Askar
                        </span>
                        <span className="block text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-zinc-500 whitespace-nowrap">
                            Famous for Quality
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-10">
                    {/* Collections dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsCollectionOpen(true)}
                        onMouseLeave={() => setIsCollectionOpen(false)}
                    >
                        <button
                            onClick={() => navigate("/collections")}
                            className={`flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer whitespace-nowrap ${isCollectionOpen
                                ? "text-zinc-900"
                                : "text-zinc-500"
                                }`}
                        >
                            Collections
                            <ChevronDown
                                className={`w-3 h-3 transition-transform duration-200 ${isCollectionOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {isCollectionOpen && (
                            <div className="absolute top-full left-0 w-48 lg:w-56 bg-white shadow-lg border border-zinc-100 rounded-sm z-50 py-1">
                                {data?.collections?.map((collection) => (
                                    <Link
                                        key={collection._id || collection.name}
                                        to={`/products?collection=${collection?._id}`}
                                        className="block px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                                        onClick={() =>
                                            setIsCollectionOpen(false)
                                        }
                                    >
                                        {collection.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        to="/products"
                        className="text-xs uppercase tracking-[0.2em] font-medium text-zinc-500 hover:text-zinc-900 transition-colors whitespace-nowrap"
                    >
                        All Products
                    </Link>
                    <Link
                        to="/track-order"
                        className="text-xs uppercase tracking-[0.2em] font-medium text-zinc-500 hover:text-zinc-900 transition-colors whitespace-nowrap"
                    >
                        Track order
                    </Link>
                    <Link
                        to="/about-us"
                        className="text-xs uppercase tracking-[0.2em] font-medium text-zinc-500 hover:text-zinc-900 transition-colors whitespace-nowrap"
                    >
                        About Us
                    </Link>
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    {/* Search icon */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="text-zinc-900 hover:text-zinc-700 transition-colors p-1"
                        aria-label="Search"
                    >
                        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Cart (if you have a cart icon, add it here) */}
                    {/* User icon — desktop only or always visible */}
                    {/* <Link
                        to={isAuthenticated ? "/account" : "/login"}
                        className="text-zinc-900 hover:text-zinc-700 transition-colors p-1 hidden sm:block"
                        aria-label="Account"
                    >
                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link> */}
                </div>
            </div>

            {/* Full-width Search overlay */}
            {isSearchOpen && (
                <div className="absolute top-0 left-0 right-0 h-14 sm:h-16 lg:h-20 bg-white flex items-center px-4 sm:px-6 lg:px-10 gap-3 border-b border-zinc-100 z-50">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 flex-shrink-0" />
                    <form onSubmit={handleSearch} className="flex-1">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent text-zinc-900 placeholder-zinc-400 text-sm sm:text-base outline-none"
                        />
                    </form>
                    <button
                        onClick={() => setIsSearchOpen(false)}
                        className="p-1.5 hover:rotate-90 transition-transform duration-500 text-zinc-700 hover:text-zinc-900 flex-shrink-0"
                        aria-label="Close search"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            )}

            {/* Mobile sidebar */}
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

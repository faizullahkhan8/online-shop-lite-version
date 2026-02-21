

import { Search, Menu, ChevronDown, X, Loader2 } from "lucide-react";
import MobileSideBar from "./MobileSideBar";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCollections } from "../../features/collections/collection.queries";

const Header = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCollectionOpen, setIsCollectionOpen] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const cartItems = useSelector((state) => state.cart?.items || []);
    const cartCount = cartItems.reduce(
        (acc, it) => acc + (it.quantity || 1),
        0,
    );
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const { data, isLoading } = useCollections();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery?.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    // Close collection dropdown on outside click
    useEffect(() => {
        const handleClickOutside = () => setIsCollectionOpen(false);
        if (isCollectionOpen) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isCollectionOpen]);

    return (
        // <header className="fixed top-0 left-0 right-0 z-50 bg-[#fafafa] border-b border-zinc-100">
        //     {/* Main header row */}
        //     <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 h-20 sm:h-20 lg:h-20 max-w-screen-2xl mx-auto">
        //         {/* Left: Hamburger (mobile only) */}
        //         <button
        //             onClick={() => {
        //                 setIsMenuOpen(true);
        //                 console.log("The button is clicked. ");
        //             }}
        //             className="md:hidden z-50 text-zinc-900 hover:text-zinc-700 transition-colors p-1 -ml-1 flex-shrink-0"
        //             aria-label="Open menu"
        //         >
        //             <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        //         </button>

        //         {/* Center on mobile / Left on desktop: Logo */}
        //         <div className="absolute left-1/2 -translate-x-1/2 md:static md:left-auto md:translate-x-0 md:flex-shrink-0">
        //             <Link
        //                 to="/"
        //                 className="block text-center leading-tight"
        //                 aria-label="Home"
        //             >
        //                 <span className="block text-sm sm:text-sm font-bold tracking-widest uppercase text-zinc-900 whitespace-nowrap">
        //                     Askar
        //                 </span>
        //                 <span className="block text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-zinc-500 whitespace-nowrap">
        //                     Famous for Quality
        //                 </span>
        //             </Link>
        //         </div>

        //         {/* Desktop Nav */}
        //         <nav className="hidden md:flex items-center gap-6 lg:gap-10">
        //             {/* Collections dropdown */}
        //             <div
        //                 className="relative"
        //                 onMouseEnter={() => setIsCollectionOpen(true)}
        //                 onMouseLeave={() => setIsCollectionOpen(false)}
        //             >
        //                 <button
        //                     onClick={() => navigate("/collections")}
        //                     className={`flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer whitespace-nowrap ${
        //                         isCollectionOpen
        //                             ? "text-zinc-900"
        //                             : "text-zinc-500"
        //                     }`}
        //                 >
        //                     Collections
        //                     <ChevronDown
        //                         className={`w-3 h-3 transition-transform duration-200 ${
        //                             isCollectionOpen ? "rotate-180" : ""
        //                         }`}
        //                     />
        //                 </button>

        //                 {isCollectionOpen && (
        //                     <div className="absolute top-full left-0 w-48 lg:w-56 bg-white shadow-lg border border-zinc-100 rounded-sm z-50 py-1">
        //                         {isLoading ? (
        //                             <div className="w-full h-full flex items-center justify-center">
        //                                 <Loader2
        //                                     size={24}
        //                                     className="animate-spin"
        //                                 />
        //                             </div>
        //                         ) : (
        //                             data?.collections?.map((collection) => (
        //                                 <Link
        //                                     key={
        //                                         collection._id ||
        //                                         collection.name
        //                                     }
        //                                     to={`/products?collection=${collection?._id}`}
        //                                     className="block px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
        //                                     onClick={() =>
        //                                         setIsCollectionOpen(false)
        //                                     }
        //                                 >
        //                                     {collection.name}
        //                                 </Link>
        //                             ))
        //                         )}
        //                     </div>
        //                 )}
        //             </div>

        //             <Link
        //                 to="/products"
        //                 className="text-xs uppercase tracking-[0.2em] font-medium text-zinc-500 hover:text-zinc-900 transition-colors whitespace-nowrap"
        //             >
        //                 All Products
        //             </Link>
        //             <Link
        //                 to="/track-order"
        //                 className="text-xs uppercase tracking-[0.2em] font-medium text-zinc-500 hover:text-zinc-900 transition-colors whitespace-nowrap"
        //             >
        //                 Track order
        //             </Link>
        //             <Link
        //                 to="/about-us"
        //                 className="text-xs uppercase tracking-[0.2em] font-medium text-zinc-500 hover:text-zinc-900 transition-colors whitespace-nowrap"
        //             >
        //                 About Us
        //             </Link>
        //         </nav>

        //         {/* Right: Actions */}
        //         <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        //             {/* Search icon */}
        //             <button
        //                 onClick={() => setIsSearchOpen(true)}
        //                 className="text-zinc-900 hover:text-zinc-700 transition-colors p-1"
        //                 aria-label="Search"
        //             >
        //                 <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        //             </button>

        //             {/* Cart (if you have a cart icon, add it here) */}
        //             {/* User icon — desktop only or always visible */}
        //             {/* <Link
        //                 to={isAuthenticated ? "/account" : "/login"}
        //                 className="text-zinc-900 hover:text-zinc-700 transition-colors p-1 hidden sm:block"
        //                 aria-label="Account"
        //             >
        //                 <User className="w-4 h-4 sm:w-5 sm:h-5" />
        //             </Link> */}
        //         </div>
        //     </div>

        //     {/* Full-width Search overlay */}
        //     {isSearchOpen && (
        //         <div className="absolute top-0 left-0 right-0 h-14 sm:h-16 lg:h-20 bg-white flex items-center px-4 sm:px-6 lg:px-10 gap-3 border-b border-zinc-100 z-50">
        //             <Search className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 flex-shrink-0" />
        //             <form onSubmit={handleSearch} className="flex-1">
        //                 <input
        //                     autoFocus
        //                     type="text"
        //                     placeholder="Search products..."
        //                     value={searchQuery}
        //                     onChange={(e) => setSearchQuery(e.target.value)}
        //                     className="w-full bg-transparent text-zinc-900 placeholder-zinc-400 text-sm sm:text-base outline-none"
        //                 />
        //             </form>
        //             <button
        //                 onClick={() => setIsSearchOpen(false)}
        //                 className="p-1.5 hover:rotate-90 transition-transform duration-500 text-zinc-700 hover:text-zinc-900 flex-shrink-0"
        //                 aria-label="Close search"
        //             >
        //                 <X className="w-4 h-4 sm:w-5 sm:h-5" />
        //             </button>
        //         </div>
        //     )}

        //     {/* Mobile sidebar */}
        //     <MobileSideBar
        //         isMenuOpen={isMenuOpen}
        //         setIsMenuOpen={setIsMenuOpen}
        //         isAuthenticated={isAuthenticated}
        //         cartCount={cartCount}
        //     />
        // </header>
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
            {/* Main header row */}
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 h-16 max-w-screen-2xl mx-auto">

                {/* Left: Hamburger (mobile only) */}
                <button
                    onClick={() => {
                        setIsMenuOpen(true);
                        console.log("The button is clicked. ");
                    }}
                    className="md:hidden z-50 text-gray-700 hover:text-gray-900 transition-colors p-1 -ml-1 flex-shrink-0"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Left: Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8 flex-1">
                    {/* Collections dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsCollectionOpen(true)}
                        onMouseLeave={() => setIsCollectionOpen(false)}
                    >
                        <button
                            onClick={() => navigate("/collections")}
                            className={`flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] font-normal font-sans transition-colors cursor-pointer whitespace-nowrap ${isCollectionOpen ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            Collections
                            <ChevronDown
                                className={`w-3 h-3 transition-transform duration-200 ${isCollectionOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {isCollectionOpen && (
                            <div className="absolute top-full left-0 w-48 lg:w-56 bg-white shadow-sm border border-gray-100 z-50 py-1">
                                {isLoading ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Loader2 size={24} className="animate-spin text-gray-400" />
                                    </div>
                                ) : (
                                    data?.collections?.map((collection) => (
                                        <Link
                                            key={collection._id || collection.name}
                                            to={`/products?collection=${collection?._id}`}
                                            className="block px-4 py-2.5 text-[11px] uppercase tracking-[0.1em] font-sans text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                            onClick={() => setIsCollectionOpen(false)}
                                        >
                                            {collection.name}
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <Link
                        to="/products"
                        className="text-[11px] uppercase tracking-[0.12em] font-normal font-sans text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap"
                    >
                        All Products
                    </Link>
                    <Link
                        to="/track-order"
                        className="text-[11px] uppercase tracking-[0.12em] font-normal font-sans text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap"
                    >
                        Track order
                    </Link>
                    <Link
                        to="/about-us"
                        className="text-[11px] uppercase tracking-[0.12em] font-normal font-sans text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap"
                    >
                        About Us
                    </Link>
                </nav>

                {/* Center: Logo — always centered */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <Link to="/" className="block text-center leading-tight" aria-label="Home">
                        <span className="block text-base font-semibold tracking-[0.25em] uppercase text-gray-900 whitespace-nowrap font-sans">
                            Askar
                        </span>
                        <span className="block text-[8px] tracking-[0.2em] uppercase text-gray-400 whitespace-nowrap font-sans font-normal">
                            Famous for Quality
                        </span>
                    </Link>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 flex-1 justify-end">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="text-gray-500 hover:text-gray-900 transition-colors p-1"
                        aria-label="Search"
                    >
                        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>

            {/* Full-width Search overlay */}
            {isSearchOpen && (
                <div className="absolute top-0 left-0 right-0 h-16 bg-white flex items-center px-4 sm:px-6 lg:px-10 gap-3 border-b border-gray-100 z-50">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <form onSubmit={handleSearch} className="flex-1">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-sm font-sans outline-none"
                        />
                    </form>
                    <button
                        onClick={() => setIsSearchOpen(false)}
                        className="p-1.5 hover:rotate-90 transition-transform duration-500 text-gray-500 hover:text-gray-900 flex-shrink-0"
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

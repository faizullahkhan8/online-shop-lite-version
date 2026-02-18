import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllCollections } from "../api/hooks/collection.api.js";
import { ImageIcon } from "lucide-react";
import Breadcrumb from "../Components/Breadcrumb.jsx";

const CollectionsPage = () => {
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Collections" },
    ];
    const [collections, setCollections] = useState([]);
    const { getAllCollections, loading } = useGetAllCollections();

    useEffect(() => {
        (async () => {
            const response = await getAllCollections();
            if (response?.success) {
                setCollections(response.collections || []);
            }
        })();
    }, []);

    const displayCollections = collections.filter(
        (collection) => collection.isActive !== false,
    );

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="container mx-auto px-4 lg:px-12 pt-12">
                <Breadcrumb items={breadcrumbItems} />
                <header className="py-10 text-center">
                    <h1 className="text-2xl tracking-[0.4em] uppercase text-zinc-900 font-light">
                        Collections
                    </h1>
                </header>

                {loading ? (
                    <div className="py-20 text-center text-sm uppercase tracking-[0.3em] text-zinc-500">
                        Loading collections...
                    </div>
                ) : displayCollections.length === 0 ? (
                    <div className="py-20 text-center text-sm uppercase tracking-[0.3em] text-zinc-500">
                        No collections available
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {displayCollections.map((collection) => (
                            <Link
                                key={collection._id || collection.name}
                                to={
                                    collection._id
                                        ? `/products?collection=${collection._id}`
                                        : "/products"
                                }
                                className="group relative aspect-3/4 overflow-hidden rounded-2xl bg-zinc-100"
                            >
                                {collection.image ? (
                                    <img
                                        src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${collection.image}`}
                                        alt={`${collection.name} collection`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300 bg-zinc-50">
                                        <ImageIcon size={32} />
                                        <span className="mt-3 text-xs uppercase tracking-[0.3em]">
                                            No Image
                                        </span>
                                    </div>
                                )}
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent flex items-end justify-center pb-8 animate-in fade-in duration-300"
                                >
                                    <div className="text-center">
                                        <span className="block text-[10px] tracking-[0.35em] uppercase text-white/80 mb-2">
                                            Collection
                                        </span>
                                        <span className="text-white text-xs tracking-[0.25em] uppercase font-medium transition-all pb-1 text-center w-max hover:text-sm hover:tracking-[0.2em] duration-200">
                                            {collection.name}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionsPage;

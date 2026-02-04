import { useEffect, useState } from "react";
import HeroSection from "../components/home/HeroSection";
import DealsAndOffers from "../components/home/DealsAndOffers";
import { useGetAllProducts } from "../api/hooks/product.api";
import { Link } from "react-router-dom";
import ProductCard from "../Components/ProductCard";

const HomePage = () => {
    const { getAllProducts, loading } = useGetAllProducts();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await getAllProducts({ limit: 12 });
            if (response?.success) {
                setProducts(response.products);
            }
        })();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50/30 pb-20 flex flex-col gap-12">
            <HeroSection />

            {/* <div className="mt-4">
                <DealsAndOffers items={products.slice(0, 6)} />
            </div> */}

            <section className="container mx-auto px-4 mt-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">
                            Recommended for You
                        </h2>
                        <p className="text-sm text-slate-400 font-medium">
                            Based on your recent activity
                        </p>
                    </div>
                    <Link
                        to="/products"
                        className="text-xs font-black uppercase tracking-widest text-primary hover:underline"
                    >
                        See All Products
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((prod) => (
                        <ProductCard key={prod._id} product={prod} />
                    ))}
                </div>

                {loading && (
                    <div className="flex justify-center mt-12">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;

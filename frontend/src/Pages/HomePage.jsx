import HeroSection from "../Components/Home/HeroSection";
import DealsAndOffers from "../Components/Home/DealsAndOffers";
import Grid from "../Components/Home/Grid";
import RequestQuote from "../Components/Home/RequestQuote";
import RecommendedItems from "../Components/Home/RecommendedItems";
import ExtraServices from "../Components/Home/ExtraServices";
import NewsLetter from "../Components/Home/NewsLetter";
import SuppliersByRegion from "../Components/Home/SuppliersByRegion";

import { useGetAllProducts } from "../api/hooks/product.api";
import { useEffect } from "react";
import { useState } from "react";
import { Loader } from "lucide-react";

const HomePage = () => {
    const { getAllProducts, loading } = useGetAllProducts();

    const [products, setProducts] = useState();

    useEffect(() => {
        (async () => {
            const response = await getAllProducts();

            if (response.success) {
                setProducts(response.products);
                console.log(response);
            }
        })();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader size={28} />
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            {/* Hero Section - Full width */}
            <HeroSection />

            {/* Deals and Offers Section */}
            <section className="py-8 md:py-12 bg-white">
                <div className="container mx-auto px-4">
                    <DealsAndOffers items={products?.slice(0, 7)} />
                </div>
            </section>

            {/* Home & Outdoor Grid */}
            <section className="py-8 md:py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <Grid
                        title="Home and outdoor"
                        bannerImg="https://picsum.photos/id/111/300/600"
                        items={products?.slice(7, 15)}
                    />
                </div>
            </section>

            {/* Consumer Electronics Grid */}
            <section className="py-8 md:py-12 bg-white">
                <div className="container mx-auto px-4">
                    <Grid
                        title="Consumer electronics and gadgets"
                        bannerImg="https://picsum.photos/id/112/300/600"
                        items={products?.slice(15, 23)}
                    />
                </div>
            </section>

            {/* Request Quote Section - Full width background */}
            <section className="py-12 md:py-16">
                <RequestQuote />
            </section>

            {/* Recommended Items Section */}
            <section className="py-8 md:py-12 bg-white">
                <div className="container mx-auto px-4">
                    <RecommendedItems items={products?.slice(23, 28)} />
                </div>
            </section>

            {/* Extra Services Section */}
            <section className="py-8 md:py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <ExtraServices />
                </div>
            </section>

            {/* Suppliers by Region */}
            <section className="py-8 md:py-12 bg-white">
                <div className="container mx-auto px-4">
                    <SuppliersByRegion />
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-12 md:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <NewsLetter />
                </div>
            </section>
        </div>
    );
};

export default HomePage;

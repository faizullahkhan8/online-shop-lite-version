import { useEffect, useState } from "react";
import HeroSection from "../Components/Home/HeroSection";
import { useGetAllProducts } from "../api/hooks/product.api";
import { Link } from "react-router-dom";
import ProductCarousel from "../Components/Home/ProductCarousel";

const HomePage = () => {
    const { getAllProducts } = useGetAllProducts();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await getAllProducts({ limit: 12 });
            if (response?.success) {
                setProducts(response.products);
            }
        })();
    }, [getAllProducts]);

    return (
        <div className="min-h-screen bg-white pb-32 flex flex-col gap-18">
            <HeroSection />

            <section>
                <ProductCarousel
                    products={products}
                    title={"Trending Products"}
                    isViewAll={true}
                />
            </section>
            <section>
                <ProductCarousel
                    products={products}
                    title={"Top Selling Products"}
                    isViewAll={true}
                />
            </section>
            <section>
                <ProductCarousel
                    products={products}
                    title={"Best Today's"}
                    isViewAll={true}
                />
            </section>
        </div>
    );
};

export default HomePage;

import { useEffect, useState } from "react";
import HeroSection from "../Components/Home/HeroSection";
import { useProducts } from "../features/products/product.queries";
import ProductCarousel from "../Components/Home/ProductCarousel";

const HomePage = () => {
    const { data, isLoading } = useProducts();
    const [products, setProducts] = useState([]);

    console.log(data)

    useEffect(() => {
        if (data?.success) {
            setProducts(data.products);
        }
    }, [data]);

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

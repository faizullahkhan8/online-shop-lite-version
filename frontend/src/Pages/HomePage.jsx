import HeroSection from "../Components/Home/HeroSection";
import { useProducts } from "../features/products/product.queries";
import ProductCarousel from "../Components/Home/ProductCarousel";
import { Loader2 } from "lucide-react";
import PromotionSection from "../Components/Home/PromotionSection";

const HomePage = () => {
    const { data, isLoading } = useProducts();

    const products = data?.products;

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 size={32} className="animate-spin" />
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-white pb-32 flex flex-col">
            <HeroSection />

            <section>
                <ProductCarousel
                    products={products}
                    title={"Trending Products"}
                    isViewAll={true}
                />
            </section>
            <section>
                {/* <ProductCarousel
                    products={products}
                    title={"Top Selling Products"}
                    isViewAll={true}
                /> */}
            </section>
            <section>
                <PromotionSection />
            </section>
        </div>
    );
};

export default HomePage;

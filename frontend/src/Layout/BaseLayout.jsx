import { Outlet } from "react-router-dom";
import Header from "../Components/Bars/Header";
import Footer from "../Components/Home/Footer";

const BaseLayout = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans gap-6">
            <Header />
            <main className="flex-1 bg-gray-50 text-gray-900">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default BaseLayout;

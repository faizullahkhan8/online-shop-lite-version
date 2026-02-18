import { Outlet } from "react-router-dom";
import Header from "../Components/Bars/Header";
import Footer from "../Components/Home/Footer";

const BaseLayout = () => {
    return (
        <div className="min-h-screen flex flex-col gap-8 bg-white font-sans selection:bg-zinc-900 selection:text-white">
            <Header />

            <main className="flex-1 mt-30">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default BaseLayout;

import { Outlet } from "react-router-dom";
import Header from "../Components/Bars/Header";
import Footer from "../Components/Home/Footer";

import StickyActions from "../Components/StickyActions";

const BaseLayout = () => {
    return (
        <div className="min-h-screen flex flex-col gap-0 bg-white font-sans selection:bg-zinc-900 selection:text-white">
            <Header />

            <main className="flex-1 mt-15">
                <Outlet />
            </main>
            <StickyActions />
            <Footer />
        </div>
    );
};

export default BaseLayout;

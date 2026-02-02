import { Outlet } from "react-router-dom";
import Header from "../Components/Bars/Header";
import Footer from "../Components/Home/Footer";

const BaseLayout = () => {
    return (
        <div className="min-h-screen flex flex-col gap-4 font-sans selection:bg-primary/10 selection:text-primary">
            <div>
                <Header />
            </div>

            <main className="flex-1 bg-[#fafbfc] text-slate-900">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default BaseLayout;

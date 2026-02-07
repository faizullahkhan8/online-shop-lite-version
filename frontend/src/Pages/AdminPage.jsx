import { useSearchParams } from "react-router-dom";
import AdminSidebar from "../Components/Admin/AdminSidebar.jsx";
import DashboardHome from "../Components/Admin/DashboardHome";
import ProductList from "../Components/Admin/ProductList";
import AddProduct from "../Components/Admin/AddProduct";
import AddCategory from "../Components/Admin/AddCategory.jsx";
import CategoryList from "../Components/Admin/CategoryList.jsx";
import OrdersList from "../Components/Admin/OrdersList.jsx";
import OrdersDetails from "../Components/Admin/OrdersDetails.jsx";
import AddOrder from "../Components/Admin/AddOrder.jsx";
import { UserList, AddUser } from "../Components/Admin/UserComponents.jsx";
import TaxShippingSettings from "../Components/Admin/TaxShippingSettings.jsx";
import PromotionBuilder from "../Components/Admin/PromotionBuilder.jsx";
import HeroManager from "../Components/Admin/HeroManager.jsx";
import { LayoutDashboard, Settings, Bell, Search } from "lucide-react";


const AdminPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "dashboard";

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <DashboardHome />;
            case "products-list":
                return <ProductList />;
            case "products-add":
                return <AddProduct />;
            case "products-settings":
                return <TaxShippingSettings />;
            case "categories-list":
                return <CategoryList />;
            case "categories-add":
                return <AddCategory />;
            case "users-list":
                return <UserList />;
            case "users-add":
                return <AddUser />;
            case "orders-list":
                return <OrdersList />;
            case "orders-details":
                return <OrdersDetails />;
            case "orders-add":
                return <AddOrder />;
            case "promotions":
                return <PromotionBuilder />;
            case "hero-manager":
                return <HeroManager />;
            default:
                return <DashboardHome />;

        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <AdminSidebar
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 lg:p-12 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminPage;

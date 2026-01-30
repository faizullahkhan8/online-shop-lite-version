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
                <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-900 rounded-xl text-white">
                            <LayoutDashboard size={20} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">
                                Terminal{" "}
                                <span className="text-primary">v2.0</span>
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {activeTab.replace("-", " ")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center bg-slate-50 px-4 py-2 rounded-2xl gap-3 border border-slate-100 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                            <Search size={16} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Global Search..."
                                className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 placeholder:text-slate-300 w-48"
                            />
                        </div>

                        <div className="flex items-center gap-2 border-l border-slate-100 pl-6">
                            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                <Bell size={20} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                <Settings size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 lg:p-12 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminPage;

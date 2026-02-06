import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
    LayoutDashboard,
    Package,
    Plus,
    List as ListIcon,
    Users,
    ShoppingCart,
    Layers,
    ChevronLeft,
    ChevronRight,
    LayoutDashboardIcon,
    Globe,
    Receipt,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AdminSidebar = ({ searchParams, setSearchParams }) => {
    const [collapsed] = useState(false);
    const activeTab = searchParams.get("tab");

    const colors = {
        primary: "#3b82f6",
        activeBg: "#eff6ff",
        textMain: "#1e293b", // slate-800 for better contrast
        textMuted: "#94a3b8", // slate-400
        border: "#f1f5f9", // slate-100
    };

    return (
        <Sidebar
            backgroundColor="white"
            collapsed={collapsed}
            rootStyles={{
                borderColor: colors.border,
                borderRightWidth: "1px",
                zIndex: "99",
                height: "100vh",
                position: "sticky",
                top: 0,
                boxShadow: "10px 0 30px -15px rgba(0,0,0,0.05)",
            }}
        >
            <div className="relative flex items-center px-6 border-b border-slate-50 h-[80px]">
                {!collapsed ? (
                    <Link
                        to={"http://localhost:5173"}
                        className="flex items-center gap-2 animate-in fade-in duration-300"
                    >
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                            <Globe className="text-white" size={28} />
                        </div>
                        <div>
                            <p className="font-black text-lg uppercase tracking-tighter text-slate-900">
                                E-Shop
                            </p>
                            <p className="text-xs">By Faiz Ullah Khan</p>
                        </div>
                    </Link>
                ) : (
                    ""
                )}

                {/* <button
                    className="absolute right-6 top-7 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm z-50"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? (
                        <ChevronRight size={14} />
                    ) : (
                        <ChevronLeft size={14} />
                    )}
                </button> */}
            </div>

            <div className="py-6 px-2">
                <Menu
                    menuItemStyles={{
                        button: ({ active }) => ({
                            fontSize: "12px",
                            fontWeight: active ? "800" : "500",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: active ? colors.primary : colors.textMain,
                            backgroundColor: active
                                ? colors.activeBg
                                : "transparent",
                            borderRadius: "16px",
                            margin: "2px 8px",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                                backgroundColor: colors.activeBg,
                                color: colors.primary,
                                transform: "translateX(4px)",
                            },
                        }),
                        icon: ({ active }) => ({
                            color: active ? colors.primary : colors.textMuted,
                            marginRight: "4px",
                        }),
                        subMenuContent: {
                            backgroundColor: "transparent",
                        },
                    }}
                >
                    <MenuItem
                        icon={<LayoutDashboard size={18} />}
                        onClick={() => setSearchParams({ tab: "dashboard" })}
                        active={activeTab === "dashboard"}
                    >
                        Dashboard
                    </MenuItem>

                    <div
                        className={`px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] transition-opacity ${collapsed ? "opacity-0" : "opacity-100"}`}
                    >
                        Inventory
                    </div>

                    <SubMenu
                        label="Products"
                        icon={<Package size={18} />}
                        defaultOpen={activeTab?.includes("products")}
                    >
                        <MenuItem
                            icon={<ListIcon size={16} />}
                            onClick={() =>
                                setSearchParams({ tab: "products-list" })
                            }
                            active={activeTab === "products-list"}
                        >
                            All Products
                        </MenuItem>
                        <MenuItem
                            icon={<Plus size={16} />}
                            onClick={() =>
                                setSearchParams({ tab: "products-add" })
                            }
                            active={activeTab === "products-add"}
                        >
                            Add Product
                        </MenuItem>
                        <MenuItem
                            icon={<Receipt size={16} />}
                            onClick={() =>
                                setSearchParams({ tab: "products-settings" })
                            }
                            active={activeTab === "products-settings"}
                        >
                            Tax & Shipping
                        </MenuItem>
                    </SubMenu>

                    <SubMenu
                        label="Categories"
                        icon={<Layers size={18} />}
                        defaultOpen={activeTab?.includes("categories")}
                    >
                        <MenuItem
                            icon={<ListIcon size={16} />}
                            onClick={() =>
                                setSearchParams({ tab: "categories-list" })
                            }
                            active={activeTab === "categories-list"}
                        >
                            All Categories
                        </MenuItem>
                        <MenuItem
                            icon={<Plus size={16} />}
                            onClick={() =>
                                setSearchParams({ tab: "categories-add" })
                            }
                            active={activeTab === "categories-add"}
                        >
                            Add Category
                        </MenuItem>
                    </SubMenu>

                    <div
                        className={`px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4 transition-opacity ${collapsed ? "opacity-0" : "opacity-100"}`}
                    >
                        Logistics
                    </div>

                    <SubMenu label="Orders" icon={<ShoppingCart size={18} />}>
                        <MenuItem
                            icon={<ListIcon size={16} />}
                            onClick={() =>
                                setSearchParams({ tab: "orders-list" })
                            }
                            active={activeTab === "orders-list"}
                        >
                            All Orders
                        </MenuItem>
                        <MenuItem
                            icon={<Plus size={16} />}
                            onClick={() =>
                                setSearchParams({ tab: "orders-add" })
                            }
                            active={activeTab === "orders-add"}
                        >
                            Add Manual Order
                        </MenuItem>
                    </SubMenu>

                    <SubMenu label="Users" icon={<Users size={18} />}>
                        <MenuItem
                            icon={<ListIcon size={16} />}
                            onClick={() =>
                                setSearchParams({ tab: "users-list" })
                            }
                            active={activeTab === "users-list"}
                        >
                            All Users
                        </MenuItem>
                        <MenuItem
                            icon={<Plus size={16} />}
                            onClick={() =>
                                setSearchParams({ tab: "users-add" })
                            }
                            active={activeTab === "users-add"}
                        >
                            Add User
                        </MenuItem>
                    </SubMenu>
                    <MenuItem
                        component={<Link to={"http://localhost:5173/"} />}
                        icon={<Globe size={16} />}
                    >
                        Vist Site
                    </MenuItem>
                </Menu>
            </div>
        </Sidebar>
    );
};

export default AdminSidebar;

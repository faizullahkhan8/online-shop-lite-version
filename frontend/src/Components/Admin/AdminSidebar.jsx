import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
    LayoutDashboard,
    Package,
    Plus,
    List as ListIcon,
    Users,
    ShoppingCart,
    Layers,
    SidebarIcon,
} from "lucide-react";
import { useState } from "react";

const AdminSidebar = ({ searchParams, setSearchParams }) => {
    const [open, setIsOpen] = useState(false);
    const activeTab = searchParams.get("tab");

    // Consistent styling variables to match ProductList
    const colors = {
        primary: "#3b82f6", // blue-500
        activeBg: "#eff6ff", // blue-50
        textMain: "#374151", // gray-700
        textMuted: "#6b7280", // gray-500
        border: "#e5e7eb", // gray-200
    };

    return (
        <Sidebar
            backgroundColor="white"
            collapsed={open}
            rootStyles={{
                borderColor: colors.border,
                zIndex: "9",
                height: "100vh",
                position: "sticky",
                top: 0,
            }}
        >
            {/* Header - Matched height and padding to ProductList header */}
            <div className="relative flex items-center px-6 border-b border-gray-100 h-[73px]">
                {!open && (
                    <span className="font-bold text-xl tracking-tight text-gray-800">
                        Admin<span className="text-blue-600">Panel</span>
                    </span>
                )}
                <div
                    className="absolute top-6 right-6 cursor-w-resize"
                    onClick={() => setIsOpen((pre) => !pre)}
                >
                    <SidebarIcon />
                </div>
            </div>

            <div className="py-4">
                <Menu
                    menuItemStyles={{
                        button: ({ active }) => ({
                            fontSize: "14px",
                            fontWeight: active ? "600" : "400",
                            color: active ? colors.primary : colors.textMain,
                            backgroundColor: active
                                ? colors.activeBg
                                : "transparent",
                            paddingLeft: "24px",
                            "&:hover": {
                                backgroundColor: colors.activeBg,
                                color: colors.primary,
                                transition: "all 0.2s ease",
                            },
                        }),
                        icon: ({ active }) => ({
                            color: active ? colors.primary : colors.textMuted,
                        }),
                        label: {
                            lineHeight: "2",
                        },
                        subMenuContent: {
                            backgroundColor: "white",
                        },
                    }}
                >
                    {/* Dashboard Section */}
                    <MenuItem
                        icon={<LayoutDashboard size={20} />}
                        onClick={() => setSearchParams({ tab: "dashboard" })}
                        active={activeTab === "dashboard"}
                    >
                        Dashboard
                    </MenuItem>

                    <div className="px-6 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Inventory
                    </div>

                    {/* Products Section */}
                    <SubMenu
                        label="Products"
                        icon={<Package size={20} />}
                        defaultOpen={activeTab?.includes("products")}
                    >
                        <MenuItem
                            icon={<ListIcon size={18} />}
                            onClick={() =>
                                setSearchParams({ tab: "products-list" })
                            }
                            active={activeTab === "products-list"}
                        >
                            List Products
                        </MenuItem>
                        <MenuItem
                            icon={<Plus size={18} />}
                            onClick={() =>
                                setSearchParams({ tab: "products-add" })
                            }
                            active={activeTab === "products-add"}
                        >
                            Add Product
                        </MenuItem>
                    </SubMenu>

                    {/* Categories Section */}
                    <SubMenu
                        label="Categories"
                        icon={<Layers size={20} />}
                        defaultOpen={activeTab?.includes("categories")}
                    >
                        <MenuItem
                            icon={<ListIcon size={18} />}
                            onClick={() =>
                                setSearchParams({ tab: "categories-list" })
                            }
                            active={activeTab === "categories-list"}
                        >
                            List Categories
                        </MenuItem>
                        <MenuItem
                            icon={<Plus size={18} />}
                            onClick={() =>
                                setSearchParams({ tab: "categories-add" })
                            }
                            active={activeTab === "categories-add"}
                        >
                            Add Category
                        </MenuItem>
                    </SubMenu>

                    <div className="px-6 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-2">
                        Management
                    </div>

                    {/* Orders Section */}
                    <SubMenu label="Orders" icon={<ShoppingCart size={20} />}>
                        <MenuItem
                            icon={<ListIcon size={18} />}
                            onClick={() =>
                                setSearchParams({ tab: "orders-list" })
                            }
                            active={activeTab === "orders-list"}
                        >
                            List Orders
                        </MenuItem>
                        <MenuItem
                            icon={<Plus size={18} />}
                            onClick={() =>
                                setSearchParams({ tab: "orders-add" })
                            }
                            active={activeTab === "orders-add"}
                        >
                            Add Order
                        </MenuItem>
                    </SubMenu>

                    {/* Users Section */}
                    <SubMenu label="Users" icon={<Users size={20} />}>
                        <MenuItem
                            icon={<ListIcon size={18} />}
                            onClick={() =>
                                setSearchParams({ tab: "users-list" })
                            }
                            active={activeTab === "users-list"}
                        >
                            List Users
                        </MenuItem>
                        <MenuItem
                            icon={<Plus size={18} />}
                            onClick={() =>
                                setSearchParams({ tab: "users-add" })
                            }
                            active={activeTab === "users-add"}
                        >
                            Add User
                        </MenuItem>
                    </SubMenu>
                </Menu>
            </div>
        </Sidebar>
    );
};

export default AdminSidebar;

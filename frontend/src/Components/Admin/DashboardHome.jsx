import { useDashboardStats } from "../../api/hooks/dashboard.api";
import {
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    TrendingUp,
    ArrowUpRight,
    Loader2,
    AlertCircle,
} from "lucide-react";

const DashboardHome = () => {
    const { stats, loading, error } = useDashboardStats();

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Aggregating Data...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-red-400">
                <AlertCircle className="mb-4" size={32} />
                <p className="text-sm font-bold uppercase tracking-widest">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        Dashboard Overview
                    </h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                        Welcome back, Admin!
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Revenue"
                    value={`Rs ${stats?.totalSales?.toLocaleString() ?? 0}`}
                    icon={<DollarSign size={20} />}
                    trend="+12.5%"
                    color="primary"
                />
                <StatCard
                    label="Orders"
                    value={stats?.totalOrders ?? 0}
                    icon={<ShoppingCart size={20} />}
                    trend="+5.2%"
                    color="slate"
                />
                <StatCard
                    label="Inventory"
                    value={stats?.totalProducts ?? 0}
                    icon={<Package size={20} />}
                    trend="Stable"
                    color="slate"
                />
                <StatCard
                    label="Active Users"
                    value={stats?.totalUsers ?? 0}
                    icon={<Users size={20} />}
                    trend="+2.1%"
                    color="slate"
                />
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, trend, color }) => (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 group hover:border-primary/20 transition-all duration-500">
        <div className="flex justify-between items-start mb-6">
            <div
                className={`p-3 rounded-2xl ${color === "primary" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500"}`}
            >
                {icon}
            </div>
            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                <span className="text-[9px] font-black uppercase tracking-tighter">
                    {trend}
                </span>
                <ArrowUpRight size={10} />
            </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
            {label}
        </p>
        <h4 className="text-2xl font-black text-slate-900 tracking-tight">
            {value}
        </h4>
    </div>
);

const QuickActionBtn = ({ label }) => (
    <button className="w-full text-left px-6 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary hover:border-primary transition-all group">
        <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-white transition-colors">
            {label}
        </span>
    </button>
);

export default DashboardHome;

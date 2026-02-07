import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#6366f1"];

const DashboardCharts = ({ stats }) => {
    if (!stats) return null;

    const { dailySales, categoryStats, orderStatusStats } = stats;

    // Formatting daily sales for the chart
    const revenueData = dailySales?.map((item) => ({
        date: new Date(item._id).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        }),
        revenue: item.total,
    })) || [];

    const categoryData = categoryStats?.map((item) => ({
        name: item.name,
        sales: item.totalSold,
        products: item.count,
    })) || [];

    const statusData = orderStatusStats?.map((item) => ({
        name: item._id.toUpperCase(),
        value: item.count,
    })) || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Area Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">
                    Revenue Trends (Last 30 Days)
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                                tickFormatter={(value) => `Rs ${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "none",
                                    borderRadius: "12px",
                                    color: "#fff",
                                }}
                                itemStyle={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}
                                labelStyle={{ color: "#94a3b8", fontSize: "10px", fontWeight: 700, marginBottom: "4px" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRev)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Performance Bar Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">
                    Category Performance
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                            />
                            <Tooltip
                                cursor={{ fill: "#f8fafc" }}
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "none",
                                    borderRadius: "12px",
                                    color: "#fff",
                                }}
                                itemStyle={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}
                            />
                            <Bar
                                dataKey="sales"
                                fill="#6366f1"
                                radius={[6, 6, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Order Status Pie Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">
                    Order Status Breakdown
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={8}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "none",
                                    borderRadius: "12px",
                                    color: "#fff",
                                }}
                                itemStyle={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] flex flex-col justify-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
                        Avg Order Value
                    </span>
                    <h4 className="text-2xl font-black text-white">
                        Rs {stats?.totalOrders > 0 ? (stats?.totalSales / stats?.totalOrders).toFixed(0).toLocaleString() : 0}
                    </h4>
                </div>
                <div className="bg-primary p-8 rounded-[2.5rem] flex flex-col justify-center shadow-xl shadow-primary/20">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-2">
                        Items Inventory
                    </span>
                    <h4 className="text-2xl font-black text-white">
                        {stats?.totalProducts}+ Units
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;

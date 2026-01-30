import { useDashboardStats } from "../../api/hooks/dashboard.api";

const DashboardHome = () => {
    const { stats, loading, error } = useDashboardStats();

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            {loading ? (
                <div className="text-center py-8">Loading stats...</div>
            ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm">Total Sales</h3>
                        <p className="text-2xl font-bold">
                            Rs:{stats?.totalSales?.toLocaleString() ?? 0}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm">Total Orders</h3>
                        <p className="text-2xl font-bold">
                            {stats?.totalOrders ?? 0}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm">
                            Total Products
                        </h3>
                        <p className="text-2xl font-bold">
                            {stats?.totalProducts ?? 0}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm">Total Users</h3>
                        <p className="text-2xl font-bold">
                            {stats?.totalUsers ?? 0}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHome;

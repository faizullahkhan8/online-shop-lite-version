import { AlertTriangle, XCircle, Package, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InventoryAlerts = ({ inventory }) => {
    const navigate = useNavigate();
    
    if (!inventory || (inventory.outOfStockCount === 0 && inventory.lowStockCount === 0)) {
        return null;
    }

    const { outOfStock, lowStock, outOfStockCount, lowStockCount } = inventory;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Out of Stock Alert */}
            {outOfStockCount > 0 && (
                <div className="bg-rose-50 border border-rose-100 rounded-[2.5rem] p-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-rose-500 text-white rounded-2xl">
                                <XCircle size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                    Out of Stock
                                </h3>
                                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                                    {outOfStockCount} Items require restock
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate("/admin-dashboard?tab=products-list")}
                            className="p-2 hover:bg-rose-100 rounded-xl transition-colors text-rose-500"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {outOfStock.slice(0, 3).map((item) => (
                            <div key={item._id} className="flex items-center justify-between bg-white/50 p-4 rounded-2xl border border-rose-100/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden p-2">
                                        <img 
                                            src={`${import.meta.env.VITE_BACKEND_URL}/${item.image}`} 
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 uppercase truncate max-w-[150px]">
                                        {item.name}
                                    </span>
                                </div>
                                <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                                    STOCK: 0
                                </span>
                            </div>
                        ))}
                        {outOfStockCount > 3 && (
                            <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest pt-2">
                                + {outOfStockCount - 3} more items
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Low Stock Alert */}
            {lowStockCount > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-[2.5rem] p-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-500/20">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                    Low Stock Warning
                                </h3>
                                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                                    {lowStockCount} Items running low
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate("/admin/products")}
                            className="p-2 hover:bg-amber-100 rounded-xl transition-colors text-amber-600"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {lowStock.slice(0, 3).map((item) => (
                            <div key={item._id} className="flex items-center justify-between bg-white/50 p-4 rounded-2xl border border-amber-100/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden p-2">
                                        <img 
                                            src={`${import.meta.env.VITE_BACKEND_URL}/${item.image}`} 
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 uppercase truncate max-w-[150px]">
                                        {item.name}
                                    </span>
                                </div>
                                <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                                    STOCK: {item.stock}
                                </span>
                            </div>
                        ))}
                        {lowStockCount > 3 && (
                            <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest pt-2">
                                + {lowStockCount - 3} more items
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryAlerts;

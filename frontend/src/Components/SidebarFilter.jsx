import { useEffect, useState } from "react";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { useGetAllCategories } from "../api/hooks/category.api";

const SidebarFilter = ({ filters, onFilterChange }) => {
    const { getAllCategories, loading: catLoading } = useGetAllCategories();
    const [dbCategories, setDbCategories] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await getAllCategories();
            if (response?.success) {
                setDbCategories(response.categories);
            }
        })();
    }, []);

    return (
        <div className="space-y-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6 flex items-center justify-between">
                    Category
                    <ChevronDown size={14} className="text-slate-400" />
                </h4>
                <div className="space-y-3">
                    {catLoading ? (
                        <div className="flex items-center gap-2 text-slate-400 py-2">
                            <Loader2 size={14} className="animate-spin" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                Loading...
                            </span>
                        </div>
                    ) : (
                        dbCategories.map((cat) => (
                            <label
                                key={cat._id}
                                className="flex items-center group cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name="category"
                                    checked={filters.category === cat._id}
                                    onChange={() =>
                                        onFilterChange({ category: cat._id })
                                    }
                                    className="hidden"
                                />
                                <span
                                    className={`text-sm font-bold transition-all ${
                                        filters.category === cat._id
                                            ? "text-primary translate-x-2"
                                            : "text-slate-400 group-hover:text-slate-600"
                                    }`}
                                >
                                    {cat.name}
                                </span>
                            </label>
                        ))
                    )}
                </div>
            </div>

            <div className="h-[1px] bg-slate-50" />
            <div className="h-[1px] bg-slate-50" />
        </div>
    );
};

export default SidebarFilter;

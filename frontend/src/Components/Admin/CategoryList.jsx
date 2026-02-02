import { useState, useEffect } from "react";
import {
    useGetAllCategories,
    useDeleteCategory,
} from "../../api/hooks/category.api.js";
import {
    Edit,
    MoreVertical,
    Trash2,
    FolderTree,
    CheckCircle2,
    XCircle,
    RefreshCw,
    ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import DeleteDialog from "../../UI/DialogBox.jsx";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        categoryId: null,
    });

    const { getAllCategories, loading: getAllCategoriesLoading } =
        useGetAllCategories();
    const { deleteCategory, loading: deleteCategoryLoading } =
        useDeleteCategory();

    useEffect(() => {
        (async () => {
            const response = await getAllCategories();
            if (response?.success) setCategories(response.categories);
        })();
    }, []);

    const handleDelete = async () => {
        const { categoryId } = deleteModal;
        const response = await deleteCategory(categoryId);
        if (response?.success) {
            setCategories((prev) => prev.filter((c) => c._id !== categoryId));
            setDeleteModal({ isOpen: false, categoryId: null });
        }
    };

    console.log(categories);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                        Categories
                    </h2>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Name
                                </th>
                                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Parent Node
                                </th>
                                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Status
                                </th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {getAllCategoriesLoading &&
                            categories.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-20 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Loading Categories...
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : categories.length > 0 ? (
                                categories.map((cat) => (
                                    <tr
                                        key={cat._id}
                                        className="group hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                {cat.parentId && (
                                                    <ChevronRight
                                                        size={14}
                                                        className="text-slate-300 ml-4"
                                                    />
                                                )}
                                                <span
                                                    className={`text-sm font-black uppercase tracking-tight ${cat.parentId ? "text-slate-500" : "text-slate-900"}`}
                                                >
                                                    {cat.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span
                                                className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${
                                                    cat.parentId
                                                        ? "bg-slate-50 text-slate-500 border-slate-200"
                                                        : "bg-primary/10 text-primary border-primary/20"
                                                }`}
                                            >
                                                {cat.parentId?.name
                                                    ? cat.parentId?.name
                                                    : "Root Node"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                {cat.isActive ? (
                                                    <>
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-[10px] font-black text-emerald-600 uppercase">
                                                            Online
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                                                        <span className="text-[10px] font-black text-slate-400 uppercase">
                                                            Offline
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() =>
                                                        setActiveMenuId(
                                                            activeMenuId ===
                                                                cat._id
                                                                ? null
                                                                : cat._id,
                                                        )
                                                    }
                                                    className={`p-2 rounded-xl transition-all ${activeMenuId === cat._id ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "text-slate-400 hover:bg-slate-100"}`}
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {activeMenuId === cat._id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-20"
                                                            onClick={() =>
                                                                setActiveMenuId(
                                                                    null,
                                                                )
                                                            }
                                                        />
                                                        <div className="absolute right-0 mt-3 w-48 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 py-3 z-30 animate-in fade-in zoom-in-95 duration-100 text-left">
                                                            <Link
                                                                to={`/admin-dashboard?tab=categories-add&isEditing=true&category=${JSON.stringify(cat)}`}
                                                                onClick={() =>
                                                                    setActiveMenuId(
                                                                        null,
                                                                    )
                                                                }
                                                                className="flex items-center gap-3 px-4 py-2 text-[10px] font-black text-slate-300 hover:text-white uppercase tracking-widest transition-colors"
                                                            >
                                                                <Edit
                                                                    size={14}
                                                                    className="text-primary"
                                                                />{" "}
                                                                Edit Category
                                                            </Link>
                                                            <button
                                                                onClick={() => {
                                                                    setActiveMenuId(
                                                                        null,
                                                                    );
                                                                    setDeleteModal(
                                                                        {
                                                                            isOpen: true,
                                                                            categoryId:
                                                                                cat._id,
                                                                        },
                                                                    );
                                                                }}
                                                                className="flex items-center gap-3 w-full px-4 py-2 text-[10px] font-black text-rose-400 hover:text-rose-300 uppercase tracking-widest transition-colors"
                                                            >
                                                                <Trash2
                                                                    size={14}
                                                                />{" "}
                                                                Delete Category
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-32 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-4 grayscale opacity-40">
                                            <FolderTree
                                                size={64}
                                                strokeWidth={1}
                                            />
                                            <div className="space-y-1">
                                                <p className="text-sm font-black uppercase tracking-widest text-slate-900">
                                                    Tree Not Planted
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                                    No hierarchical data
                                                    detected.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DeleteDialog
                isOpen={deleteModal.isOpen}
                loading={deleteCategoryLoading}
                onClose={() =>
                    setDeleteModal({ isOpen: false, categoryId: null })
                }
                onConfirm={handleDelete}
                title="Sever Category Link"
                message="This will purge the category from the master tree. Warning: Dependencies (products/sub-nodes) may lose their structural reference."
            />
        </div>
    );
};

export default CategoryList;

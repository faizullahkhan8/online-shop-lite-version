import { useState, useEffect } from "react";
import { useGetAllCategories, useDeleteCategory } from "../../api/hooks/category.api.js";
import { Edit, MoreVertical, Trash2, FolderTree, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import DeleteDialog from "../../UI/DialogBox.jsx";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoryId: null });

    const { getAllCategories, loading: getAllCategoriesLoading } = useGetAllCategories();
    const { deleteCategory, loading: deleteCategoryLoading } = useDeleteCategory();

    useEffect(() => {
        (async () => {
            const response = await getAllCategories();
            if (response?.success) setCategories(response.categories);
        })()
    }, []);

    const handleDelete = async () => {
        const { categoryId } = deleteModal;
        const response = await deleteCategory(categoryId);
        if (response?.success) {
            setCategories(prev => prev.filter(c => c._id !== categoryId));
            setDeleteModal({ isOpen: false, categoryId: null });
        }
    };

    return (
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 max-w-3xl mx-auto overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Category Management</h2>
                    <p className="text-sm text-gray-500">Organize your products into hierarchies.</p>
                </div>
            </div>

            <div className="overflow-x-auto max-h-[calc(100vh-200px)] h-[calc(100vh-200px)]">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Parent Category</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            {/* Indent subcategories slightly */}
                                            {cat.parentCategory && <span className="text-gray-300 ml-4">└─</span>}
                                            <span className={`text-sm font-medium ${cat.parentCategory ? 'text-gray-600' : 'text-gray-900 font-bold'}`}>
                                                {cat.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${cat.parentId ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {cat.parentId?.name ? cat.parentId?.name : 'Main Category'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {cat.isActive ? (
                                            <span className="flex items-center gap-1 text-green-600 text-sm">
                                                <CheckCircle2 size={14} /> Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-gray-400 text-sm">
                                                <XCircle size={14} /> Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                                        <button
                                            onClick={() => setActiveMenuId(activeMenuId === cat._id ? null : cat._id)}
                                            className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                        {activeMenuId === cat._id && (
                                            <>
                                                <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)}></div>
                                                <div className="absolute right-6 top-12 w-36 bg-white rounded-md shadow-xl border border-gray-100 py-1 z-30">
                                                    <Link
                                                        to={`/admin-dashboard?tab=categories-add&isEditing=true&category=${JSON.stringify(cat)}`}
                                                        onClick={() => setActiveMenuId(null)}
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                    >
                                                        <Edit size={14} className="text-blue-500" /> Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => { setActiveMenuId(null); setDeleteModal({ isOpen: true, categoryId: cat._id }) }}
                                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50"
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                    <FolderTree size={40} className="mx-auto mb-2 opacity-20" />
                                    No categories found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <DeleteDialog
                isOpen={deleteModal.isOpen}
                loading={deleteCategoryLoading}
                onClose={() => setDeleteModal({ isOpen: false, categoryId: null })}
                onConfirm={handleDelete}
                title="Delete Category"
                message="Are you sure? If this category has subcategories or products linked to it, you might want to reassign them first."
            />
        </div>
    );
};

export default CategoryList;
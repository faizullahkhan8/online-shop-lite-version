import { useState, useEffect } from "react";
import {
    useGetAllCategories,
    useDeleteCategory,
    useCreateCategory,
    useUpdateCategory,
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
    Plus,
    X,
    Tag,
    Loader,
} from "lucide-react";
import DeleteDialog from "../../UI/DialogBox.jsx";
import Input from "../../UI/Input.jsx";
import Button from "../../UI/Button.jsx";

const INITIAL_STATE = {
    name: "",
    parentId: "",
    isActive: true,
};

const CategoriesListPage = () => {
    const [categories, setCategories] = useState([]);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        categoryId: null,
    });
    const [categoryModal, setCategoryModal] = useState({
        isOpen: false,
        isEditing: false,
        data: INITIAL_STATE,
    });

    const { getAllCategories, loading: getAllCategoriesLoading } =
        useGetAllCategories();
    const { deleteCategory, loading: deleteCategoryLoading } =
        useDeleteCategory();
    const { createCategory, loading: creating } = useCreateCategory();
    const { updateCategory, loading: updating } = useUpdateCategory();

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

    const handleOpenAddModal = () => {
        setCategoryModal({
            isOpen: true,
            isEditing: false,
            data: INITIAL_STATE,
        });
    };

    const handleOpenEditModal = (category) => {
        setCategoryModal({
            isOpen: true,
            isEditing: true,
            data: {
                name: category.name,
                _id: category._id,
                parentId: category.parentId?._id || "",
                isActive: category.isActive,
            },
        });
    };

    const handleCloseModal = () => {
        setCategoryModal({
            isOpen: false,
            isEditing: false,
            data: INITIAL_STATE,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryModal.data.name.trim()) return;

        let response;
        if (categoryModal.isEditing) {
            response = await updateCategory({
                id: categoryModal.data._id,
                categoryData: categoryModal.data,
            });

            if (response.success) {
                setCategories((pre) => {
                    let temp = pre;
                    const index = pre.findIndex(
                        (cat) => cat._id === response.category._id,
                    );

                    temp[index] = response.category;

                    return temp;
                });
                setCategoryModal(false);
            }
        } else {
            response = await createCategory(categoryModal.data);
            if (response.success) {
                setCategories((pre) => [...pre, response.category]);
                setCategoryModal(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Categories
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage product categories ({categories.length} total)
                    </p>
                </div>
                <Button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add New Category
                </Button>
            </header>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                    Category Name
                                </th>
                                {/* <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                    Parent Category
                                </th> */}
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                    Status
                                </th>
                                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-700 border-b border-gray-200">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {getAllCategoriesLoading &&
                            categories.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                                            <p className="text-sm font-medium text-gray-500">
                                                Loading categories...
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : categories.length > 0 ? (
                                categories.map((cat) => (
                                    <tr
                                        key={cat._id}
                                        className="group hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {cat.parentId && (
                                                    <ChevronRight
                                                        size={16}
                                                        className="text-gray-400"
                                                    />
                                                )}
                                                <span
                                                    className={`text-sm font-medium ${cat.parentId ? "text-gray-600 ml-2" : "text-gray-900 font-semibold"}`}
                                                >
                                                    {cat.name}
                                                </span>
                                            </div>
                                        </td>
                                        {/* <td className="px-6 py-4">
                                            <span
                                                className={`text-xs font-medium px-2.5 py-1 rounded-md ${cat.parentId
                                                    ? "bg-gray-100 text-gray-600"
                                                    : "bg-blue-50 text-blue-700 border border-blue-200"
                                                    }`}
                                            >
                                                {cat.parentId?.name || "Root"}
                                            </span>
                                        </td> */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {cat.isActive ? (
                                                    <>
                                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Active
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                                                        <span className="text-sm font-medium text-gray-500">
                                                            Inactive
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right flex gap-2 justify-end">
                                            <button
                                                onClick={() =>
                                                    handleOpenEditModal(cat)
                                                }
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Edit
                                                    size={16}
                                                    className="text-blue-600"
                                                />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeleteModal({
                                                        isOpen: true,
                                                        categoryId: cat._id,
                                                    });
                                                }}
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-24 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <FolderTree
                                                size={48}
                                                className="text-gray-300"
                                                strokeWidth={1.5}
                                            />
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    No categories found
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Get started by adding your
                                                    first category
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

            {/* Delete Dialog */}
            <DeleteDialog
                isOpen={deleteModal.isOpen}
                loading={deleteCategoryLoading}
                onClose={() =>
                    setDeleteModal({ isOpen: false, categoryId: null })
                }
                onConfirm={handleDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? This action cannot be undone and may affect related products."
            />

            {/* Add/Edit Category Modal */}
            {categoryModal.isOpen && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {categoryModal.isEditing
                                        ? "Edit Category"
                                        : "Add New Category"}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {categoryModal.isEditing
                                        ? "Update category information"
                                        : "Create a new product category"}
                                </p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Category Name */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                    <Tag size={14} className="text-blue-600" />
                                    Category Name
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    placeholder="e.g., Electronics"
                                    value={categoryModal.data.name}
                                    onChange={(e) =>
                                        setCategoryModal({
                                            ...categoryModal,
                                            data: {
                                                ...categoryModal.data,
                                                name: e.target.value,
                                            },
                                        })
                                    }
                                    required
                                    className="w-full"
                                />
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <span className="text-sm font-medium text-gray-900">
                                        Active Status
                                    </span>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {categoryModal.data.isActive
                                            ? "Category is visible to customers"
                                            : "Category is hidden from customers"}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCategoryModal({
                                            ...categoryModal,
                                            data: {
                                                ...categoryModal.data,
                                                isActive:
                                                    !categoryModal.data
                                                        .isActive,
                                            },
                                        })
                                    }
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        categoryModal.data.isActive
                                            ? "bg-blue-600"
                                            : "bg-gray-300"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            categoryModal.data.isActive
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={creating || updating}
                                    className="min-w-35"
                                >
                                    {creating || updating ? (
                                        <div className="flex items-center gap-2">
                                            <Loader
                                                className="animate-spin"
                                                size={16}
                                            />
                                            <span>
                                                {categoryModal.isEditing
                                                    ? "Updating..."
                                                    : "Creating..."}
                                            </span>
                                        </div>
                                    ) : categoryModal.isEditing ? (
                                        "Update Category"
                                    ) : (
                                        "Create Category"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesListPage;

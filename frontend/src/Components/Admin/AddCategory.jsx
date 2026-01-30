import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Input from "../../UI/Input.jsx";
import Button from "../../UI/Button.jsx";
import Select from "../../UI/Select.jsx";
import { Loader, Info, ArrowLeft } from "lucide-react";
import { useCreateCategory, useUpdateCategory, useGetAllCategories } from "../../api/hooks/category.api.js";
import { useMemo } from "react";

const INITIAL_STATE = {
    name: "",
    parentCategory: "",
    isActive: true,
};

const AddCategory = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const isEditing = searchParams.get('isEditing') === 'true';

    // Safety check for parsing JSON from URL
    const getInitialData = () => {
        try {
            const cat = searchParams.get("category");
            return cat ? JSON.parse(cat) : INITIAL_STATE;
        } catch (e) {
            return INITIAL_STATE;
        }
    };

    const [categoryData, setCategoryData] = useState(INITIAL_STATE);
    const [categories, setCategories] = useState([]);

    const { createCategory, loading: creating } = useCreateCategory();
    const { updateCategory, loading: updating } = useUpdateCategory();
    const { getAllCategories, loading: fetchingCats } = useGetAllCategories();

    // 2. Sync state with URL
    useEffect(() => {
        if (isEditing) {
            setCategoryData(getInitialData());
        } else {
            setCategoryData(INITIAL_STATE);
        }
    }, [isEditing, searchParams]);

    // Fetch categories for the dropdown
    useEffect(() => {
        const fetch = async () => {
            const res = await getAllCategories();
            if (res?.success) setCategories(res.categories || []);
        };
        fetch();
    }, []);

    // 3. Prevent Circular References
    // We use useMemo so this list only recalculates when categories change
    const categoryOptions = useMemo(() => {
        return categories
            ?.filter(cat => cat._id !== categoryData._id) // Remove current category from parent list
            .map(cat => ({
                label: cat.name,
                value: cat._id
            })) || [];
    }, [categories, categoryData._id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryData.name.trim()) return;

        let response;
        if (isEditing) {
            response = await updateCategory({ id: categoryData._id, categoryData });
        } else {
            response = await createCategory(categoryData);
        }

        if (response?.success) {
            // Replace ensures the "Edit" state is cleared from history
            navigate("/admin-dashboard?tab=categories-list", { replace: true });
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 m-6 max-w-2xl mx-auto">
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        {isEditing ? "Edit Category" : "Add New Category"}
                    </h2>
                </div>
                {isEditing && (
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        placeholder="e.g. Electronics"
                        value={categoryData.name}
                        onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
                        required
                        className="w-full"
                    />
                </div>

                {/* Parent Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Category (Optional)
                    </label>
                    <Select
                        placeholder={fetchingCats ? "Loading categories..." : "Select Parent Category"}
                        options={categoryOptions}
                        value={categoryData.parentCategory}
                        onChange={(val) => setCategoryData({ ...categoryData, parentCategory: val })}
                        className="w-full"
                    />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                        <span className="block text-sm font-semibold text-gray-700">Active Status</span>

                    </div>
                    <button
                        type="button"
                        onClick={() => setCategoryData({ ...categoryData, isActive: !categoryData.isActive })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${categoryData.isActive ? "bg-blue-600" : "bg-gray-300"
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${categoryData.isActive ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    {isEditing && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/admin-dashboard?tab=categories-list")}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={creating || updating} className="px-10">
                        {creating || updating ? <Loader className="animate-spin" size={18} /> : (isEditing ? "Update Category" : "Create Category")}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddCategory;
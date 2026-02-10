/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Input from "../../UI/Input.jsx";
import Button from "../../UI/Button.jsx";
import Select from "../../UI/Select.jsx";
import {
    ImageIcon,
    Loader,
    Plus,
    Save,
    X,
    Hash,
    Layers,
    DollarSign,
    Box,
    Boxes,
} from "lucide-react";
import {
    useCreateProuduct,
    useUpdateProduct,
} from "../../api/hooks/product.api.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetAllCategories } from "../../api/hooks/category.api.js";

const INITAIL_STATE = {
    _id: "",
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    lowStock: "",
    image: null,
    isRemoveBg: false,
};

const AddProduct = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const parseProductFromParams = () => {
        try {
            const raw = searchParams.get("product");
            return raw ? JSON.parse(raw) : INITAIL_STATE;
        } catch {
            return INITAIL_STATE;
        }
    };

    const [productData, setProductData] = useState(parseProductFromParams);
    const isEditing = Boolean(productData?._id);

    const [categories, setCategories] = useState([]);
    const [previewUrl, setPreviewUrl] = useState("");

    const { createProduct, loading: createProductLoading } =
        useCreateProuduct();
    const { updateProduct, loading: updateProductLoading } = useUpdateProduct();
    const { getAllCategories } = useGetAllCategories();

    useEffect(() => {
        (async () => {
            const response = await getAllCategories();
            if (response.success) {
                setCategories(response.categories);
            }
        })();
    }, []);

    useEffect(() => {
        if (!productData.image) {
            setPreviewUrl("");
            return;
        }

        if (productData.image instanceof File) {
            const url = URL.createObjectURL(productData.image);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }

        if (typeof productData.image === "string") {
            setPreviewUrl(
                `${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${productData.image}`,
            );
        }
    }, [productData.image]);

    const handleChange = (e) => {
        const { id, value, files, type } = e.target;
        if (type === "file") {
            setProductData((prev) => ({ ...prev, image: files[0] }));
        } else {
            setProductData((prev) => ({ ...prev, [id]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        if (!isEditing) {
            if (!productData.image)
                return toast.error("Please select an image");

            formData.append("image", productData.image);
            const { image, ...textData } = productData;
            formData.append("data", JSON.stringify(textData));

            const response = await createProduct(formData);
            if (response.success) navigate("/admin-dashboard/products");
        } else {
            if (productData.image instanceof File) {
                formData.append("image", productData.image);
            }

            const { image, ...textData } = productData;
            formData.append("data", JSON.stringify(textData));

            const response = await updateProduct({
                product: formData,
                id: productData._id,
            });
            if (response.success)
                navigate("/admin-dashboard?tab=products-list");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEditing ? "Edit Product" : "Add New Product"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEditing
                            ? "Update product information"
                            : "Create a new product listing"}
                    </p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                    <X size={20} />
                </button>
            </header>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
                {/* Left Column - Product Details */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-5">
                        {/* Product Name */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <Hash size={14} className="text-blue-600" />
                                Product Name
                            </label>
                            <Input
                                type="text"
                                id="name"
                                value={productData?.name}
                                placeholder="Enter product name"
                                className="w-full"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Price and Stock */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                    <DollarSign
                                        size={14}
                                        className="text-blue-600"
                                    />
                                    Price (Rs)
                                </label>
                                <Input
                                    type="number"
                                    id="price"
                                    value={productData?.price}
                                    placeholder="0.00"
                                    step="0.01"
                                    className="w-full"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                    <Boxes
                                        size={16}
                                        className="text-blue-600"
                                    />
                                    Stock Quantity
                                </label>
                                <Input
                                    type="number"
                                    id="stock"
                                    value={productData?.stock}
                                    placeholder="0"
                                    className="w-full"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                    <Box size={14} className="text-blue-600" />
                                    Low Stock
                                </label>
                                <Input
                                    type="number"
                                    id="lowStock"
                                    value={productData?.lowStock}
                                    placeholder="0"
                                    className="w-full"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <Layers size={14} className="text-blue-600" />
                                Category
                            </label>
                            <Select
                                placeholder="Select category"
                                id="category"
                                value={productData?.category}
                                onChange={(value) =>
                                    handleChange({
                                        target: { id: "category", value },
                                    })
                                }
                                options={categories.map((cat) => ({
                                    label: cat.name,
                                    value: cat._id,
                                }))}
                                className="w-full"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <Layers size={14} className="text-blue-600" />
                                Description
                            </label>
                            <Input
                                type="textarea"
                                id="description"
                                value={productData?.description}
                                placeholder="Enter product description"
                                rows={6}
                                className="w-full resize-none"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Image Upload & Actions */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Image Upload */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-gray-700">
                                Product Image
                            </label>
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-medium text-gray-600">
                                    Remove BG
                                </label>
                                <input
                                    type="checkbox"
                                    checked={productData?.isRemoveBg}
                                    onChange={(e) =>
                                        setProductData((pre) => ({
                                            ...pre,
                                            isRemoveBg: e.target.checked,
                                        }))
                                    }
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <label
                            htmlFor="image"
                            className="group relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-gray-50 transition-all cursor-pointer overflow-hidden"
                        >
                            {previewUrl ? (
                                <div className="absolute inset-0">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-sm font-medium text-white">
                                            Change Image
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-6">
                                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-50 transition-colors">
                                        <ImageIcon
                                            size={24}
                                            className="text-gray-400 group-hover:text-blue-600 transition-colors"
                                        />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                        Upload Product Image
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, WEBP (Max 10MB)
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                id="image"
                                hidden
                                accept="image/*"
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <Button
                            type="submit"
                            disabled={
                                createProductLoading || updateProductLoading
                            }
                            className="w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {createProductLoading || updateProductLoading ? (
                                <>
                                    <Loader
                                        className="animate-spin"
                                        size={18}
                                    />
                                    <span className="text-sm font-medium">
                                        {isEditing
                                            ? "Updating..."
                                            : "Creating..."}
                                    </span>
                                </>
                            ) : isEditing ? (
                                <>
                                    <Save size={18} />
                                    <span className="text-sm font-medium">
                                        Update Product
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Plus size={18} />
                                    <span className="text-sm font-medium">
                                        Create Product
                                    </span>
                                </>
                            )}
                        </Button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;

import { useState, useEffect } from "react";
import Input from "../../UI/Input.jsx";
import Button from "../../UI/Button.jsx";
import Select from "../../UI/Select.jsx";
import { ImageIcon, Loader } from "lucide-react";
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
    image: null, // Stores the File object
};

const AddProduct = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const isEditing = searchParams.get("isEditing") === "true";
    const selectedProduct =
        JSON.parse(searchParams.get("product")) || INITAIL_STATE;

    const [productData, setProductData] = useState(selectedProduct);
    const [categories, setCategories] = useState([]);
    const [previewUrl, setPreviewUrl] = useState("");

    const { createProduct, loading: createProductLoading } =
        useCreateProuduct();
    const { updateProduct, loading: updateProductLoading } = useUpdateProduct();
    const { getAllCategories, loading } = useGetAllCategories();

    // ---------------- created by my best friend AI ----------------

    useEffect(() => {
        if (isEditing) {
            try {
                const product = JSON.parse(searchParams.get("product"));
                if (product) setProductData(product);
            } catch (err) {
                console.error("Failed to parse product data", err);
            }
        } else {
            setProductData(INITAIL_STATE);
            setPreviewUrl("");
        }
    }, [isEditing, searchParams]);

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
                `${import.meta.env.VITE_BACKEND_URL}/${productData.image}`
            );
        }
    }, [productData.image]);

    // ---------------- created by my best friend AI ----------------

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
            if (response.success)
                navigate("/admin-dashboard?tab=products-list");
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto max-md:my-6">
            <header className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    {isEditing ? "Edit Product" : "Add New Product"}
                </h2>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                    </label>
                    <Input
                        type="text"
                        id="name"
                        value={productData?.name}
                        placeholder="e.g. Wireless Headphones"
                        className="w-full"
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price ($)
                        </label>
                        <Input
                            type="number"
                            id="price"
                            value={productData?.price}
                            className={"w-full"}
                            placeholder="0.00"
                            step="0.01"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock Quantity
                        </label>
                        <Input
                            type="number"
                            id="stock"
                            value={productData?.stock}
                            className={"w-full"}
                            placeholder="e.g. 50"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <Select
                        placeholder="Select category"
                        id="category"
                        value={productData?.category}
                        onChange={(value) =>
                            handleChange({ target: { id: "category", value } })
                        }
                        options={categories.map((cat) => ({
                            label: cat.name,
                            value: cat._id,
                        }))}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <Input
                        type="textarea"
                        id="description"
                        value={productData?.description}
                        className={"w-full"}
                        placeholder="Provide a detailed description of the product..."
                        rows={4}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <p className="block text-sm font-medium text-gray-700 mb-1">
                        Product Image
                    </p>
                    <label
                        htmlFor="image"
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-all cursor-pointer overflow-hidden min-h-[200px] items-center"
                    >
                        {previewUrl ? (
                            <div className="text-center">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-h-48 rounded-md mb-2 object-contain"
                                />
                                <p className="text-xs text-blue-600 font-medium">
                                    Click to change image
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1 flex items-center justify-center flex-col">
                                <ImageIcon
                                    size={32}
                                    className="text-gray-400"
                                />
                                <p className="text-sm text-gray-600 font-medium text-blue-600">
                                    Upload a file
                                </p>
                                <p className="text-xs text-gray-400">
                                    PNG, JPG up to 10MB
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

                <div className="pt-4 flex items-center justify-end space-x-3 border-t">
                    <Button
                        type="button"
                        onClick={() => navigate(-1)}
                        variant="outline"
                        className="text-gray-600"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={createProductLoading || updateProductLoading}
                        className="px-8"
                    >
                        {createProductLoading || updateProductLoading ? (
                            <Loader className="animate-spin" />
                        ) : isEditing ? (
                            "Update Product"
                        ) : (
                            "Add Product"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;

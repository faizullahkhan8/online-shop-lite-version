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
    useCreateProduct,
    useUpdateProduct,
} from "../../features/products/product.mutations.js";
import { useCollections } from "../../features/collections/collection.queries.js";

import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const INITIAL_STATE = {
    _id: "",
    name: "",
    price: "",
    description: "",
    collection: "",
    stock: "",
    lowStock: "",
    images: [],
    isRemoveBg: false,
};

const AddProduct = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const parseProductFromParams = () => {
        try {
            const raw = searchParams.get("product");
            if (!raw) return INITIAL_STATE;

            const parsed = JSON.parse(raw);
            const { collection, images, ...rest } = parsed || {};
            const resolvedCollection =
                typeof collection === "string"
                    ? collection
                    : collection?._id || collection?.id || "";

            return {
                ...INITIAL_STATE,
                ...rest,
                images: Array.isArray(images) ? images : [],
                collection: resolvedCollection,
            };
        } catch {
            return INITIAL_STATE;
        }
    };

    const [productData, setProductData] = useState(parseProductFromParams);
    const isEditing = Boolean(productData?._id);

    const { mutateAsync: createProduct, isPending: createLoading } =
        useCreateProduct();
    const { mutateAsync: updateProduct, isPending: updateLoading } =
        useUpdateProduct();
    const { data: collectionData } = useCollections();

    const handleChange = (e) => {
        const { id, value, files, type } = e.target;
        if (type === "file") {
            const newFiles = Array.from(files);
            setProductData((prev) => ({
                ...prev,
                images: [...prev.images, ...newFiles],
            }));
        } else {
            setProductData((prev) => ({ ...prev, [id]: value }));
        }
    };

    const removeImage = (index) => {
        setProductData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        const { images, ...textData } = productData;
        formData.append("data", JSON.stringify(textData));

        images.forEach((img) => {
            if (img instanceof File) {
                formData.append("images", img);
            }
        });

        if (!isEditing) {
            if (images.length === 0)
                return toast.error("At least one image is required");

            await createProduct(formData, {
                onSuccess: () => {
                    toast.success("Product created successfully");
                    navigate("/admin-dashboard/products");
                },
                onError: (err) =>
                    toast.error(err.message || "Failed to create product"),
            });
        } else {
            await updateProduct(
                {
                    id: productData?._id,
                    product: formData,
                },
                {
                    onSuccess: () => {
                        toast.success("Product updated successfully");
                        navigate("/admin-dashboard/products");
                    },
                    onError: (err) =>
                        toast.error(err.message || "Failed to update product"),
                },
            );
        }
    };

    const isSubmitting = createLoading || updateLoading;

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEditing ? "Edit Product" : "Add New Product"}
                    </h2>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-2xl hover:bg-gray-100"
                >
                    <X size={20} />
                </button>
            </header>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <Hash size={14} className="text-blue-600" />{" "}
                                Product Name
                            </label>
                            <Input
                                type="text"
                                id="name"
                                placeholder={"e.g: Lighting Keyboard"}
                                value={productData?.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                    <DollarSign
                                        size={14}
                                        className="text-blue-600"
                                    />{" "}
                                    Price (Rs)
                                </label>
                                <Input
                                    type="number"
                                    id="price"
                                    placeholder={"Rs: 0.00"}
                                    value={productData?.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                    <Boxes
                                        size={16}
                                        className="text-blue-600"
                                    />{" "}
                                    Stock
                                </label>
                                <Input
                                    type="number"
                                    id="stock"
                                    placeholder={"e.g: 10"}
                                    value={productData?.stock}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                    <Box size={14} className="text-blue-600" />{" "}
                                    Low Stock
                                </label>
                                <Input
                                    className={"w-full"}
                                    placeholder={"e.g: 10"}
                                    type="number"
                                    id="lowStock"
                                    value={productData?.lowStock}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <Layers size={14} className="text-blue-600" />{" "}
                                Collection
                            </label>
                            <Select
                                id="collection"
                                value={productData?.collection}
                                onChange={(val) =>
                                    handleChange({
                                        target: {
                                            id: "collection",
                                            value: val,
                                        },
                                    })
                                }
                                options={collectionData?.collections?.map(
                                    (c) => ({ label: c.name, value: c._id }),
                                )}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <Layers size={14} className="text-blue-600" />{" "}
                                Description
                            </label>
                            <textarea
                                type="textarea"
                                id="description"
                                value={productData?.description}
                                rows={6}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-2xl w-full resize-none py-2 px-4 text-gray-700 text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-gray-700">
                                Product Images
                            </label>
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-medium text-gray-600">
                                    Remove BG
                                </label>
                                <input
                                    type="checkbox"
                                    checked={productData?.isRemoveBg}
                                    onChange={(e) =>
                                        setProductData((p) => ({
                                            ...p,
                                            isRemoveBg: e.target.checked,
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {productData.images.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative aspect-square rounded-xl overflow-hidden border"
                                >
                                    <img
                                        src={
                                            img instanceof File
                                                ? URL.createObjectURL(img)
                                                : img.url
                                        }
                                        className="w-full h-full object-cover"
                                        alt="Preview"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}

                            {productData.images.length < 10 && (
                                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <Plus size={20} className="text-gray-400" />
                                    <span className="text-[10px] text-gray-400">
                                        Add More
                                    </span>
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        accept="image/*"
                                        onChange={handleChange}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-blue-600 text-white rounded-2xl"
                        >
                            {isSubmitting ? (
                                <Loader className="animate-spin" size={18} />
                            ) : isEditing ? (
                                "Update Product"
                            ) : (
                                "Create Product"
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;

/* eslint-disable no-unused-vars */
import { useState } from "react";
import Input from "../../UI/Input.jsx";
import Button from "../../UI/Button.jsx";
import Select from "../../UI/Select.jsx";
import UploadImagesModal from "./UploadImagesModel.jsx";

import { Loader, X, Hash, Loader2 } from "lucide-react";

import {
    useCreateProduct,
    useUpdateProduct,
} from "../../features/products/product.mutations.js";

import { useCollections } from "../../features/collections/collection.queries.js";
import { useDeleteUploadImage } from "../../features/upload.api.js";

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
    images: [], // [{ _id, url, fileName, size }]
    isRemoveBg: false,
};

const AddProduct = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const deleteUploadImage = useDeleteUploadImage();

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
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const isEditing = Boolean(productData?._id);

    const { mutateAsync: createProduct, isPending: createLoading } =
        useCreateProduct();
    const { mutateAsync: updateProduct, isPending: updateLoading } =
        useUpdateProduct();
    const { data: collectionData } = useCollections();

    const isSubmitting = createLoading || updateLoading;

    const handleChange = (e) => {
        const { id, value } = e.target;
        setProductData((prev) => ({ ...prev, [id]: value }));
    };

    // ✅ Handle upload success from modal
    const handleUploadSuccess = (uploadedImages) => {
        setProductData((prev) => ({
            ...prev,
            images: [...prev.images, ...uploadedImages],
        }));
    };

    // ✅ Delete uploaded image
    const handleDeleteImage = async (imageData) => {
        try {
            await deleteUploadImage.mutateAsync(imageData);

            setProductData((prev) => ({
                ...prev,
                images: prev.images.filter((img) => img._id !== imageData._id),
            }));

            toast.success("Image deleted successfully");
        } catch (err) {
            toast.error("Failed to delete image");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (productData.images.length === 0) {
            return toast.error("At least one image is required");
        }

        if (!isEditing) {
            await createProduct(productData, {
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
                    id: productData._id,
                    product: productData,
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

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEditing ? "Edit Product" : "Add New Product"}
                </h2>
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
                {/* LEFT SIDE */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <Hash size={14} className="text-blue-600" />
                                Product Name
                            </label>
                            <Input
                                type="text"
                                id="name"
                                value={productData?.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <Input
                                type="number"
                                id="price"
                                placeholder="Price"
                                value={productData?.price}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                type="number"
                                id="stock"
                                placeholder="Stock"
                                value={productData?.stock}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                type="number"
                                id="lowStock"
                                placeholder="Low Stock"
                                value={productData?.lowStock}
                                onChange={handleChange}
                                required
                            />
                        </div>

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
                            options={collectionData?.collections?.map((c) => ({
                                label: c.name,
                                value: c._id,
                            }))}
                        />

                        <textarea
                            id="description"
                            rows={6}
                            value={productData?.description}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-2xl w-full resize-none py-2 px-4 text-gray-700 text-sm"
                        />
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-medium text-gray-700">
                                Product Images
                            </label>

                            <Button
                                type="button"
                                onClick={() => setIsUploadModalOpen(true)}
                                className="text-sm"
                            >
                                Upload Images
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {productData.images.map((img) => (
                                <div
                                    key={img._id}
                                    className="relative aspect-square rounded-xl overflow-hidden border"
                                >
                                    <img
                                        src={img.url}
                                        className="w-full h-full object-cover"
                                        alt="Product"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage(img)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg"
                                    >
                                        {deleteUploadImage.isPending ? (
                                            <Loader2
                                                size={24}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <X size={12} />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

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
            </form>

            {/* ✅ Upload Modal */}
            <UploadImagesModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSuccess={handleUploadSuccess}
            />
        </div>
    );
};

export default AddProduct;

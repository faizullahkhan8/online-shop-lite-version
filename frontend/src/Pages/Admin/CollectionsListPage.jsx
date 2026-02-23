import { useState, useEffect } from "react";
import {
    useDeleteCollection,
    useCreateCollection,
    useUpdateCollection,
} from "../../features/collections/collection.mutations.js";

import { useCollections } from "../../features/collections/collection.queries";

import { useProducts } from "../../features/products/product.queries";
import { useAssignCollectionToProducts } from "../../features/products/product.mutations.js";
import {
    Edit,
    Trash2,
    FolderTree,
    ChevronRight,
    Plus,
    X,
    Tag,
    Loader,
    ImageIcon,
} from "lucide-react";
import DeleteDialog from "../../UI/DialogBox.jsx";
import Input from "../../UI/Input.jsx";
import Button from "../../UI/Button.jsx";
import { toast } from "react-toastify";

const INITIAL_STATE = {
    name: "",
    parentId: "",
    isActive: true,
    image: null,
};

const CollectionsListPage = () => {
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        collectionId: null,
    });
    const [collectionModal, setCollectionModal] = useState({
        isOpen: false,
        isEditing: false,
        data: INITIAL_STATE,
    });
    const [previewUrl, setPreviewUrl] = useState("");

    const { data: collectionsData, isLoading } = useCollections();
    const {
        mutateAsync: deleteCollection,
        isPending: deleteCollectionLoading,
    } = useDeleteCollection();
    const { mutateAsync: createCollection, isPending: creating } =
        useCreateCollection();
    const { mutateAsync: updateCollection, isPending: updating } =
        useUpdateCollection();
    const { mutateAsync: assignCollectionToProducts } =
        useAssignCollectionToProducts();

    const [addProductsModal, setAddProductsModal] = useState({
        isOpen: false,
        collectionId: null,
        collectionName: "",
    });

    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [assigning, setAssigning] = useState(false);

    const { data: unassignedProductsData } = useProducts({
        excludeAssignedToCollection: true,
    });

    console.log(collectionModal.data._id);

    const unassignedProducts = unassignedProductsData?.products || [];

    useEffect(() => {
        const image = collectionModal.data.image;
        if (!image) {
            setPreviewUrl("");
            return;
        }

        if (image instanceof File) {
            const url = URL.createObjectURL(image);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }

        if (typeof image === "string") {
            setPreviewUrl(
                `${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${image}`,
            );
        }
    }, [collectionModal.data.image]);

    const handleDelete = async () => {
        const { collectionId } = deleteModal;
        await deleteCollection(collectionId, {
            onSuccess: () => {
                setDeleteModal({ isOpen: false, collectionId: null });
            },
        });
    };

    const handleOpenAddModal = () => {
        setCollectionModal({
            isOpen: true,
            isEditing: false,
            data: INITIAL_STATE,
        });
    };

    const handleOpenEditModal = (collection) => {
        setCollectionModal({
            isOpen: true,
            isEditing: true,
            data: {
                name: collection.name,
                _id: collection._id,
                parentId: collection.parentId?._id || "",
                isActive: collection.isActive,
                image: collection.image || "",
            },
        });
    };

    const handleCloseModal = () => {
        setCollectionModal({
            isOpen: false,
            isEditing: false,
            data: INITIAL_STATE,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCollectionModal((prev) => ({
            ...prev,
            data: { ...prev.data, image: file },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!collectionModal.data.name.trim()) return;

        const formData = new FormData();
        const { image, ...textData } = collectionModal.data;
        formData.append("data", JSON.stringify(textData));

        if (!collectionModal.isEditing && !(image instanceof File)) {
            return toast.error("Please select a collection image");
        }

        if (image instanceof File) {
            formData.append("image", image);
        }

        if (collectionModal.isEditing) {
            await updateCollection(
                {
                    id: collectionModal.data._id,
                    collectionData: formData,
                },
                {
                    onSuccess: () => {
                        handleCloseModal();
                    },
                },
            );
        } else {
            await createCollection(
                { collectionData: formData },
                {
                    onSuccess: () => {
                        handleCloseModal();
                    },
                },
            );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Collections
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage product collections (
                        {collectionsData?.collections?.length} total)
                    </p>
                </div>
                <Button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add New Collection
                </Button>
            </header>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                    Image
                                </th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                    Collection Name
                                </th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                    Status
                                </th>
                                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-700 border-b border-gray-200">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading &&
                            collectionsData?.collections?.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                                            <p className="text-sm font-medium text-gray-500">
                                                Loading collections...
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : collectionsData?.collections?.length > 0 ? (
                                collectionsData?.collections?.map(
                                    (collection) => (
                                        <tr
                                            key={collection._id}
                                            className="group hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                                                    {collection.image ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${collection.image}`}
                                                            alt={
                                                                collection.name
                                                            }
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <ImageIcon
                                                                size={18}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {collection.parentId && (
                                                        <ChevronRight
                                                            size={16}
                                                            className="text-gray-400"
                                                        />
                                                    )}
                                                    <span
                                                        className={`text-sm font-medium ${collection.parentId ? "text-gray-600 ml-2" : "text-gray-900 font-semibold"}`}
                                                    >
                                                        {collection.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {collection.isActive ? (
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
                                                        handleOpenEditModal(
                                                            collection,
                                                        )
                                                    }
                                                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Edit
                                                        size={16}
                                                        className="text-blue-600"
                                                    />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        // open modal and load unassigned products
                                                        setAddProductsModal({
                                                            isOpen: true,
                                                            collectionId:
                                                                collection._id,
                                                            collectionName:
                                                                collection.name,
                                                        });
                                                        setSelectedProductIds(
                                                            [],
                                                        );
                                                        // const resp =
                                                        //     await getAllProducts();
                                                        // if (resp?.success) {
                                                        //     const unassigned = (
                                                        //         resp.products ||
                                                        //         []
                                                        //     ).filter(
                                                        //         (p) =>
                                                        //             !p.collection,
                                                        //     );
                                                        //     setUnassignedProducts(
                                                        //         unassigned,
                                                        //     );
                                                        // }
                                                    }}
                                                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Tag
                                                        size={16}
                                                        className="text-green-600"
                                                    />
                                                    <span>Add Products</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeleteModal({
                                                            isOpen: true,
                                                            collectionId:
                                                                collection._id,
                                                        });
                                                    }}
                                                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ),
                                )
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
                                                    No collections found
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Get started by adding your
                                                    first collection
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
                loading={deleteCollectionLoading}
                onClose={() =>
                    setDeleteModal({ isOpen: false, collectionId: null })
                }
                onConfirm={handleDelete}
                title="Delete Collection"
                message="Are you sure you want to delete this collection? This action cannot be undone and may affect related products."
            />

            {/* Add/Edit Collection Modal */}
            {collectionModal.isOpen && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {collectionModal.isEditing
                                        ? "Edit Collection"
                                        : "Add New Collection"}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {collectionModal.isEditing
                                        ? "Update collection information"
                                        : "Create a new product collection"}
                                </p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-2xl hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Collection Name */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                    <Tag size={14} className="text-blue-600" />
                                    Collection Name
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    placeholder="e.g., Electronics"
                                    value={collectionModal.data.name}
                                    onChange={(e) =>
                                        setCollectionModal({
                                            ...collectionModal,
                                            data: {
                                                ...collectionModal.data,
                                                name: e.target.value,
                                            },
                                        })
                                    }
                                    required
                                    className="w-full"
                                />
                            </div>

                            {/* Collection Image */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                    <ImageIcon
                                        size={14}
                                        className="text-blue-600"
                                    />
                                    Collection Image
                                    {!collectionModal.isEditing && (
                                        <span className="text-red-500">*</span>
                                    )}
                                </label>
                                <label
                                    htmlFor="collection-image"
                                    className="group relative flex flex-col items-center justify-center w-full aspect-[3/2] border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 hover:bg-gray-50 transition-all cursor-pointer overflow-hidden"
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
                                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-50 transition-colors">
                                                <ImageIcon
                                                    size={22}
                                                    className="text-gray-400 group-hover:text-blue-600 transition-colors"
                                                />
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 mb-1">
                                                Upload Collection Image
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, WEBP (Max 5MB)
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="collection-image"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                                <div>
                                    <span className="text-sm font-medium text-gray-900">
                                        Active Status
                                    </span>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {collectionModal.data.isActive
                                            ? "Collection is visible to customers"
                                            : "Collection is hidden from customers"}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCollectionModal({
                                            ...collectionModal,
                                            data: {
                                                ...collectionModal.data,
                                                isActive:
                                                    !collectionModal.data
                                                        .isActive,
                                            },
                                        })
                                    }
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        collectionModal.data.isActive
                                            ? "bg-blue-600"
                                            : "bg-gray-300"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            collectionModal.data.isActive
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
                                                {collectionModal.isEditing
                                                    ? "Updating..."
                                                    : "Creating..."}
                                            </span>
                                        </div>
                                    ) : collectionModal.isEditing ? (
                                        "Update Collection"
                                    ) : (
                                        "Create Collection"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Products To Collection Modal */}
            {addProductsModal.isOpen && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Add Products to "
                                    {addProductsModal.collectionName}"
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Select products that are not currently
                                    assigned to any collection.
                                </p>
                            </div>
                            <button
                                onClick={() =>
                                    setAddProductsModal({
                                        isOpen: false,
                                        collectionId: null,
                                        collectionName: "",
                                    })
                                }
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-2xl hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-auto border border-gray-100 rounded-2xl">
                            {unassignedProducts.length === 0 ? (
                                <div className="p-6 text-center text-sm text-gray-500">
                                    No unassigned products available.
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs text-gray-600 border-b">
                                            <th className="px-4 py-3"> </th>
                                            <th className="px-4 py-3">
                                                Product
                                            </th>
                                            <th className="px-4 py-3">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {unassignedProducts.map((p) => (
                                            <tr
                                                key={p._id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProductIds.includes(
                                                            p._id,
                                                        )}
                                                        onChange={(e) => {
                                                            if (
                                                                e.target.checked
                                                            ) {
                                                                setSelectedProductIds(
                                                                    (s) => [
                                                                        ...s,
                                                                        p._id,
                                                                    ],
                                                                );
                                                            } else {
                                                                setSelectedProductIds(
                                                                    (s) =>
                                                                        s.filter(
                                                                            (
                                                                                id,
                                                                            ) =>
                                                                                id !==
                                                                                p._id,
                                                                        ),
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                                                            {p.image ? (
                                                                <img
                                                                    src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${p.image}`}
                                                                    alt={p.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : null}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {p.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                SKU:{" "}
                                                                {p.sku || "-"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    Rs {p.price}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setAddProductsModal({
                                        isOpen: false,
                                        collectionId: null,
                                        collectionName: "",
                                    })
                                }
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={async () => {
                                    if (selectedProductIds.length === 0)
                                        return toast.error(
                                            "Select at least one product",
                                        );
                                    setAssigning(true);
                                    try {
                                        await assignCollectionToProducts({
                                            collectionId:
                                                addProductsModal.collectionId,
                                            productIds: selectedProductIds,
                                        });
                                        toast.success(
                                            "Products assigned to collection",
                                        );
                                        // refresh page or collections state if needed
                                        setAddProductsModal({
                                            isOpen: false,
                                            collectionId: null,
                                            collectionName: "",
                                        });
                                    } catch (err) {
                                        console.log(err);
                                        toast.error(
                                            "Failed to assign products",
                                        );
                                    } finally {
                                        setAssigning(false);
                                    }
                                }}
                                disabled={assigning}
                            >
                                {assigning ? "Assigning..." : "Assign Selected"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollectionsListPage;

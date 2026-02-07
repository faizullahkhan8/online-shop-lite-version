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
    image: null,
    isRemoveBg: false,
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
    const { getAllCategories } = useGetAllCategories();

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

    console.log(productData);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        {isEditing ? "Modify Product" : "Initialize Product"}
                    </h2>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 text-slate-400 hover:text-slate-900 transition-colors"
                >
                    <X size={24} />
                </button>
            </header>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20"
            >
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                                <Hash size={12} className="text-primary" />{" "}
                                Product Name
                            </label>
                            <Input
                                type="text"
                                id="name"
                                value={productData?.name}
                                placeholder="e.g. CORE-SERIES MK I"
                                className="w-full bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                                    <DollarSign
                                        size={12}
                                        className="text-primary"
                                    />{" "}
                                    Price
                                </label>
                                <Input
                                    type="number"
                                    id="price"
                                    value={productData?.price}
                                    placeholder="0.00"
                                    step="0.01"
                                    className="w-full bg-slate-50 border-none rounded-2xl"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                                    <Box size={12} className="text-primary" />{" "}
                                    Stock
                                </label>
                                <Input
                                    type="number"
                                    id="stock"
                                    value={productData?.stock}
                                    placeholder="0"
                                    className="w-full bg-slate-50 border-none rounded-2xl"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                                <Layers size={12} className="text-primary" />{" "}
                                Category
                            </label>
                            <Select
                                placeholder="Select Category..."
                                id="category"
                                value={productData?.category}
                                onChange={(value) =>
                                    handleChange({
                                        target: { id: "category", value },
                                    })
                                }
                                options={categories.map((cat) => ({
                                    label: cat.name.toUpperCase(),
                                    value: cat._id,
                                }))}
                                className="bg-slate-50 border-none rounded-2xl"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                                <Layers size={12} className="text-primary" />{" "}
                                Description
                            </label>
                            <Input
                                type="textarea"
                                id="description"
                                value={productData?.description}
                                placeholder="Enter detailed specifications..."
                                rows={6}
                                className="w-full bg-slate-50 border-none rounded-2xl resize-none"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                        <div className="flex gap-2 justify-between">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                                Product Image
                            </label>
                            <div className="flex gap-2 items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                                    Remove Background
                                </label>
                                <input
                                    type="checkbox"
                                    value={productData?.isRemoveBg}
                                    onChange={(e) =>
                                        setProductData((pre) => ({
                                            ...pre,
                                            isRemoveBg: e.target.checked,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        <label
                            htmlFor="image"
                            className="group relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-slate-200 rounded-[2rem] hover:border-primary/50 hover:bg-slate-50 transition-all cursor-pointer overflow-hidden"
                        >
                            {previewUrl ? (
                                <div className="absolute inset-0">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">
                                            Replace Image
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-6">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <ImageIcon
                                            size={28}
                                            className="text-slate-300 group-hover:text-primary transition-colors"
                                        />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                        Upload Product Image
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-400 mt-2">
                                        RAW, PNG, JPG (MAX 10MB)
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

                    <div className="flex flex-col gap-3">
                        <Button
                            type="submit"
                            disabled={
                                createProductLoading || updateProductLoading
                            }
                            className="w-full py-6 rounded-2xl bg-slate-900 text-white hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-900/20"
                        >
                            {createProductLoading || updateProductLoading ? (
                                <Loader className="animate-spin" size={20} />
                            ) : isEditing ? (
                                <>
                                    <Save size={18} />
                                    <span className="text-xs font-black uppercase tracking-widest">
                                        Update Product
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Plus size={18} />
                                    <span className="text-xs font-black uppercase tracking-widest">
                                        Create Product
                                    </span>
                                </>
                            )}
                        </Button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
                        >
                            Cancel & Go Back
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;

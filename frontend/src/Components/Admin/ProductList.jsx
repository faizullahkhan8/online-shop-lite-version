import {
    useDeleteProduct,
    useGetAllProducts,
} from "../../api/hooks/product.api.js";
import { useState, useEffect } from "react";
import {
    Edit,
    MoreVertical,
    PackageOpen,
    Trash,
    ExternalLink,
    RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import DeleteDialog from "../../UI/DialogBox.jsx";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [activeMenuId, setActiveMenuId] = useState(null);

    const { getAllProducts, loading: getAllProductsLoading } =
        useGetAllProducts();
    const { deleteProduct, loading: deleteProductLoading } = useDeleteProduct();

    const [productState, setProductState] = useState({
        type: "",
        data: null,
    });

    useEffect(() => {
        (async () => {
            const response = await getAllProducts();
            if (response?.success) {
                setProducts(response.products);
            }
        })();
    }, []);

    const handleDelete = async () => {
        const response = await deleteProduct(productState.data._id);
        if (response?.success) {
            setProducts(
                products.filter(
                    (product) => product._id !== productState.data._id,
                ),
            );
            setProductState({ type: "", data: null });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DeleteDialog
                isOpen={Boolean(productState.type === "delete")}
                onClose={() => setProductState({ type: "", data: null })}
                onConfirm={handleDelete}
                title="Decommission Entity"
                message="Are you certain you wish to purge this product from the master registry? This operation is irreversible."
                loading={deleteProductLoading}
            />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                        Products
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
                        All Products in the inventory {products.length}
                    </p>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Image + Name
                                </th>
                                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Category
                                </th>
                                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Price
                                </th>
                                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Stock
                                </th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {getAllProductsLoading && products.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-20 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Fetching products...
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <tr
                                        key={product._id}
                                        className="group hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                                                    <img
                                                        src={`${import.meta.env.VITE_BACKEND_URL}/${product.image}`}
                                                        className="w-full h-full object-cover"
                                                        alt={product.name}
                                                    />
                                                </div>
                                                <span className="text-sm font-black text-slate-800 uppercase tracking-tight leading-tight max-w-[180px]">
                                                    {" "}
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase">
                                                {product.category
                                                    ? product.category.name
                                                    : "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-slate-700">
                                                Rs:{" "}
                                                {Number(
                                                    product.price,
                                                ).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div
                                                    className={`h-1.5 w-12 rounded-full ${product.stock > 10 ? "bg-emerald-400" : "bg-rose-400"}`}
                                                />
                                                <span
                                                    className={`text-[10px] font-black uppercase tracking-tighter ${product.stock > 10 ? "text-emerald-600" : "text-rose-600"}`}
                                                >
                                                    {product.stock} Units
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() =>
                                                        setActiveMenuId(
                                                            activeMenuId ===
                                                                product._id
                                                                ? null
                                                                : product._id,
                                                        )
                                                    }
                                                    className={`p-2 rounded-xl transition-all ${activeMenuId === product._id ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "text-slate-400 hover:bg-slate-100"}`}
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {activeMenuId ===
                                                    product._id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-10"
                                                            onClick={() =>
                                                                setActiveMenuId(
                                                                    null,
                                                                )
                                                            }
                                                        />
                                                        <div className="absolute right-0 mt-3 w-48 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 py-3 z-20 animate-in fade-in zoom-in-95 duration-100">
                                                            <Link
                                                                to={`/admin-dashboard?tab=products-add&isEditing=true&product=${encodeURIComponent(JSON.stringify(product))}`}
                                                                className="flex items-center gap-3 px-4 py-2 text-[10px] font-black text-slate-300 hover:text-white uppercase tracking-widest transition-colors"
                                                            >
                                                                <Edit
                                                                    size={14}
                                                                    className="text-primary"
                                                                />{" "}
                                                                Edit Product
                                                            </Link>
                                                            <button
                                                                onClick={() => {
                                                                    setProductState(
                                                                        {
                                                                            type: "delete",
                                                                            data: product,
                                                                        },
                                                                    );
                                                                    setActiveMenuId(
                                                                        null,
                                                                    );
                                                                }}
                                                                className="flex items-center gap-3 w-full px-4 py-2 text-[10px] font-black text-rose-400 hover:text-rose-300 uppercase tracking-widest transition-colors"
                                                            >
                                                                <Trash
                                                                    size={14}
                                                                />{" "}
                                                                Delete Product
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
                                        colSpan={5}
                                        className="py-32 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-4 grayscale opacity-40">
                                            <PackageOpen
                                                size={64}
                                                strokeWidth={1}
                                            />
                                            <div className="space-y-1">
                                                <p className="text-sm font-black uppercase tracking-widest text-slate-900">
                                                    Registry Empty
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                                    No assets detected in
                                                    current sector.
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
        </div>
    );
};

export default ProductList;

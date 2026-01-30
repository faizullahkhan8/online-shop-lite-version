import {
    useDeleteProduct,
    useGetAllProducts,
} from "../../api/hooks/product.api.js";
import { useState, useEffect } from "react";
import { Edit, MoreVertical, PackageOpen, Trash } from "lucide-react"; // Optional: for better icons
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
                    (product) => product._id !== productState.data._id
                )
            );
            setProductState({ type: "", data: null });
        }
    };

    return (
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 mx-auto max-w-3xl flex flex-col overflow-hidden">
            <DeleteDialog
                isOpen={Boolean(productState.type === "delete")}
                onClose={() => setProductState({ type: "", data: null })}
                onConfirm={handleDelete}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                loading={deleteProductLoading}
            />

            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">
                    Product List
                </h2>
                <p className="text-sm text-gray-500">
                    Manage your store inventory and stock levels.
                </p>
            </div>

            <div className="overflow-x-auto overflow-y-auto h-[calc(100vh-200px)] max-h-[calc(100vh-200px)]">
                <table className="min-w-full divide-y divide-gray-200 border-separate border-spacing-0">
                    <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                                Image
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                                ID
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                                Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                                Price
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                                Stock
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {getAllProductsLoading ? (
                            <tr className="text-center text-gray-300 font-semibold">
                                <td className="p-4" colSpan={6}>
                                    No product added yet!
                                </td>
                            </tr>
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <tr
                                    className="hover:bg-blue-50/30 transition-colors group"
                                    key={product._id}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                            src={`${
                                                import.meta.env.VITE_BACKEND_URL
                                            }/${product.image}`}
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-100 shadow-sm"
                                            alt={product.name}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-400">
                                        #{product._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                        Rs: {Number(product.price).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                product.stock > 10
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {product.stock} in stock
                                        </span>
                                    </td>
                                    <td className="relative px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <MoreVertical
                                            onClick={() =>
                                                setActiveMenuId(product._id)
                                            }
                                            size={24}
                                            className="text-primary hover:text-primary/80"
                                        />

                                        {activeMenuId === product._id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() =>
                                                        setActiveMenuId(null)
                                                    }
                                                ></div>

                                                <div className="absolute right-10 top-12 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-9999 overflow-hidden">
                                                    <Link
                                                        to={`/admin-dashboard?tab=products-add&isEditing=true&product=${encodeURIComponent(
                                                            JSON.stringify(
                                                                product
                                                            )
                                                        )}`}
                                                        onClick={() =>
                                                            setActiveMenuId(
                                                                null
                                                            )
                                                        }
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Edit size={14} /> Edit
                                                    </Link>

                                                    <button
                                                        onClick={() => {
                                                            setProductState({
                                                                type: "delete",
                                                                data: product,
                                                            });
                                                            setActiveMenuId(
                                                                null
                                                            );
                                                        }}
                                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash size={14} />{" "}
                                                        Delete
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <PackageOpen
                                            size={48}
                                            className="text-gray-300"
                                        />
                                        <p>
                                            No products found. Add your first
                                            product to get started!
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;

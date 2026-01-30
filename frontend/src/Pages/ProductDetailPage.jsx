import { useState, useEffect } from "react";
import {
    Heart,
    Check,
    Package,
    ShoppingCart,
    Loader,
    X,
    FileStack,
    Boxes,
} from "lucide-react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../Components/Breadcrumb";
import { useGetProductById } from "../api/hooks/product.api";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { toggleWishlist } from "../store/slices/wishlistSlice";
import { useAddToWishlist, useRemoveFromWishlist } from "../api/hooks/user.api";

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    const { getProductById, loading: productLoading } = useGetProductById();

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Clothings", path: "/products?category=clothing" },
        { label: "Men's wear", path: "/products?category=mens" },
        { label: product?.name || "Product" },
    ];

    const dispatch = useDispatch();
    const { addToWishlist } = useAddToWishlist();
    const { removeFromWishlist } = useRemoveFromWishlist();
    const wishlistItems = useSelector((state) => state.wishlist.items || []);
    const matchId = (item, product) => {
        if (!item || !product) return false;
        const aval = item._id || item.id || item;
        const bval = product._id || product.id || product;
        return aval.toString() === bval.toString();
    };
    const isInWishlist = !!wishlistItems.find((item) => matchId(item, product));

    useEffect(() => {
        (async () => {
            const response = await getProductById(id);
            if (response?.success) {
                setProduct(response.product);
            }
        })();
    }, []);

    if (productLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader size={28} />
            </div>
        );
    }

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart(product));
    };

    const handleWishlist = async () => {
        if (!product) return;
        dispatch(toggleWishlist(product));
        try {
            if (isInWishlist) {
                await removeFromWishlist(product._id || product.id);
            } else {
                await addToWishlist(product._id || product.id);
            }
        } catch {
            dispatch(toggleWishlist(product));
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            {/* Breadcrumbs */}
            <Breadcrumb items={breadcrumbItems} />

            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        {/* Images */}
                        <div className="lg:col-span-1">
                            <div className="border border-gray-200 rounded flex items-center justify-center p-4 mb-4 h-80">
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/${
                                        product?.image
                                    }`}
                                    alt={product?.name}
                                    className="max-h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="lg:col-span-1">
                            {product?.stock > 0 ? (
                                <span className="text-green-600 flex items-center gap-1 text-sm font-medium mb-2">
                                    <Check size={16} /> In stock
                                </span>
                            ) : (
                                <span className="text-red-600 flex items-center gap-1 text-sm font-medium mb-2">
                                    <X size={16} /> out of stock
                                </span>
                            )}
                            <h1 className="text-xl font-bold text-gray-900 mb-3">
                                {product?.name}
                            </h1>
                            <h1 className="text-md text-gray-900 mb-3">
                                {product?.description}
                            </h1>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-gray-500 text-sm">
                                    <Package size={16} />
                                    <span>
                                        {product?.soldCount
                                            ? product.soldCount
                                            : 0}{" "}
                                        sold
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-500 text-sm">
                                    <Boxes size={16} />
                                    <span>
                                        {product?.category?.name
                                            ? product?.category?.name
                                            : "temp category"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-primary text-white py-2.5 rounded font-medium mb-2 
                                     hover:bg-primary-dark transition-colors disabled:opacity-50 
                                     flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={18} />
                            <span>Add to Cart</span>
                        </button>

                        {/* Save for Later (Add to Wishlist) */}
                        <button
                            onClick={handleWishlist}
                            className={`w-full border border-gray-200 py-2.5 rounded font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors ${
                                isInWishlist
                                    ? "text-red-500 border-red-200"
                                    : "text-gray-700 hover:text-red-500"
                            }`}
                        >
                            <Heart size={18} />
                            <span>
                                {isInWishlist
                                    ? "Remove from Wishlist"
                                    : "Add to Wishlist"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;

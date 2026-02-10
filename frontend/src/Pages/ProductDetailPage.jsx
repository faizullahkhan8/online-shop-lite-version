import { useState, useEffect } from "react";
import {
    Heart,
    Check,
    Package,
    ShoppingCart,
    Loader2,
    X,
    Boxes,
    ShieldCheck,
    Truck,
    Minus,
    Plus,
} from "lucide-react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../Components/Breadcrumb";
import { useGetProductById } from "../api/hooks/product.api";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { toggleWishlist } from "../store/slices/wishlistSlice";
import { useAddToWishlist, useRemoveFromWishlist } from "../api/hooks/user.api";
import StarRating from "../Components/UI/StarRating";
import ProductReviews from "../Components/Product/ProductReviews";

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const { getProductById, loading: productLoading } = useGetProductById();

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
    }, [id]);

    if (productLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-sm font-medium text-gray-500">
                    Loading product details...
                </p>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({ ...product, quantity }));
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

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Catalog", path: "/products" },
        {
            label: product?.category?.name || "Category",
            path: `/products?category=${product?.category?.name}`,
        },
        { label: product?.name || "Product" },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-8">
                <Breadcrumb items={breadcrumbItems} />

                <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
                        {/* Product Image */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center p-8 group overflow-hidden">
                                <img
                                    src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${product?.image}`}
                                    alt={product?.name}
                                    className="max-h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-col">
                            {/* Stock Status */}
                            <div className="mb-4">
                                {product?.stock > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                                        <Check size={14} strokeWidth={2.5} />
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-200">
                                        <X size={14} strokeWidth={2.5} />
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            {/* Product Name */}
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                                {product?.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-5">
                                <StarRating rating={product?.rating || 0} readonly size={16} />
                                <span className="text-sm text-gray-500">
                                    {product?.numReviews || 0} reviews
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {product?.description ||
                                    "Experience the perfect blend of performance and design with our latest addition to the collection."}
                            </p>

                            {/* Price Section */}
                            <div className="mb-6 p-5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg text-white">
                                <span className="text-xs font-medium text-blue-100 mb-2 block">
                                    Price
                                </span>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold">
                                        PKR{" "}
                                        {(
                                            product?.effectivePrice ||
                                            product?.price
                                        )?.toLocaleString()}
                                    </span>
                                    {product?.effectivePrice <
                                        product?.price && (
                                            <span className="text-sm font-medium text-blue-200 line-through">
                                                PKR{" "}
                                                {product?.price?.toLocaleString()}
                                            </span>
                                        )}
                                </div>
                            </div>

                            {/* Product Stats */}
                            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-gray-500 mb-1">
                                        Sales
                                    </span>
                                    <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
                                        <Package
                                            size={16}
                                            className="text-blue-600"
                                        />
                                        <span>
                                            {product?.sold || 0} sold
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-gray-500 mb-1">
                                        Category
                                    </span>
                                    <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
                                        <Boxes
                                            size={16}
                                            className="text-blue-600"
                                        />
                                        <span>
                                            {product?.category?.name || "Tech"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity and Cart */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center bg-gray-100 rounded-lg border border-gray-300">
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1),
                                                )
                                            }
                                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors rounded-l-lg"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-12 text-center font-semibold text-gray-900">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setQuantity(quantity + 1)
                                            }
                                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors rounded-r-lg"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product?.stock <= 0}
                                        className="flex-1 bg-blue-600 text-white h-11 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                                    >
                                        <ShoppingCart size={18} />
                                        Add to Cart
                                    </button>
                                </div>

                                {/* Wishlist Button */}
                                <button
                                    onClick={handleWishlist}
                                    className={`w-full h-11 rounded-lg font-medium text-sm flex items-center justify-center gap-2 border transition-colors ${isInWishlist
                                        ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <Heart
                                        size={18}
                                        fill={
                                            isInWishlist
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />
                                    {isInWishlist
                                        ? "Saved to Wishlist"
                                        : "Add to Wishlist"}
                                </button>
                            </div>

                            {/* Features */}
                            <div className="mt-8 grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2.5 p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                                    <Truck className="text-blue-600" size={20} />
                                    <span className="text-xs font-medium text-gray-700">
                                        Fast Delivery
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5 p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                                    <ShieldCheck
                                        className="text-blue-600"
                                        size={20}
                                    />
                                    <span className="text-xs font-medium text-gray-700">
                                        Secure Warranty
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Reviews Section */}
                {product && <ProductReviews productId={product._id || product.id} />}
            </div>
        </div>
    );
};

export default ProductDetailPage;
// import { useEffect, useState } from "react";
// import { useOrderById } from "../features/orders/orders.queries.js";
// import { readGuestOrders } from "../utils/guestOrders";
// import {
//     Loader2,
//     Receipt,
//     ChevronRight,
//     Search,
//     CheckCircle2,
//     Package,
//     MapPin,
//     CreditCard,
//     Calendar,
//     User,
//     Phone,
//     Truck,
//     Star,
// } from "lucide-react";
// import Breadcrumb from "../Components/Breadcrumb.jsx";
// import ReviewModal from "../Components/ReviewModal.jsx";

// const TrackOrderPage = () => {
//     const [orderId, setOrderId] = useState("");
//     const [selectedOrderId, setSelectedOrderId] = useState(null);
//     const [savedOrders, setSavedOrders] = useState([]);
//     const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const [reviewedProductIds, setReviewedProductIds] = useState([]);

//     const {
//         data,
//         isLoading: loading,
//         error,
//     } = useOrderById(selectedOrderId, {
//         enabled: !!selectedOrderId,
//     });

//     const order = data?.order || null;

//     /* Load localStorage once */
//     useEffect(() => {
//         const ids = readGuestOrders();
//         setSavedOrders(ids || []);
//     }, []);

//     /* Manual search */
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!orderId.trim()) return;
//         setSelectedOrderId(orderId.trim());
//     };

//     /* Click saved order */
//     const handleSavedOrderClick = (id) => {
//         setOrderId(id);
//         setSelectedOrderId(id);
//     };

//     /* Format date */
//     const formatDate = (date) => {
//         if (!date) return "N/A";
//         return new Date(date).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//         });
//     };

//     /* Status badge color */
//     const getStatusColor = (status) => {
//         switch (status?.toLowerCase()) {
//             case "delivered":
//                 return "bg-green-100 text-green-800";
//             case "shipped":
//                 return "bg-blue-100 text-blue-800";
//             case "pending":
//                 return "bg-yellow-100 text-yellow-800";
//             case "cancelled":
//                 return "bg-red-100 text-red-800";
//             default:
//                 return "bg-gray-100 text-gray-800";
//         }
//     };

//     const breadcrumbItems = [
//         { label: "Home", path: "/" },
//         { label: "Track Order" },
//     ];

//     return (
//         <div className="min-h-screen">
//             <div className="container mx-auto px-4 lg:px-12 py-12 max-w-7xl">
//                 <Breadcrumb items={breadcrumbItems} />
//                 {/* HEADER */}
//                 <div className="mb-12">
//                     <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">
//                         Track Your Order
//                     </h1>
//                     <p className="text-gray-600">
//                         Enter your order ID or select from recent orders
//                     </p>
//                 </div>

//                 {/* SEARCH */}
//                 <div className="mb-12">
//                     <form onSubmit={handleSubmit} className="flex gap-4">
//                         <div className="relative flex-1">
//                             <Search
//                                 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
//                                 size={20}
//                             />
//                             <input
//                                 value={orderId}
//                                 onChange={(e) => setOrderId(e.target.value)}
//                                 placeholder="Enter your order ID..."
//                                 className="w-full border border-gray-300 rounded-2xl px-12 py-4 tracking-widest outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//                             />
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="bg-black text-white px-8 py-4 rounded-2xl uppercase tracking-widest disabled:opacity-50 hover:bg-gray-800 transition-colors"
//                         >
//                             {loading ? (
//                                 <Loader2
//                                     className="animate-spin mx-auto"
//                                     size={20}
//                                 />
//                             ) : (
//                                 "Track"
//                             )}
//                         </button>
//                     </form>

//                     {error && (
//                         <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
//                             <p className="text-sm text-red-600 uppercase tracking-widest">
//                                 Order fetching failed!
//                             </p>
//                         </div>
//                     )}
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//                     {/* LEFT: ORDER DETAILS */}
//                     <div className="lg:col-span-8">
//                         {loading && (
//                             <div className="bg-white border border-gray-200 rounded-2xl p-16 flex items-center justify-center">
//                                 <Loader2
//                                     className="animate-spin text-gray-400"
//                                     size={40}
//                                 />
//                             </div>
//                         )}

//                         {!loading && order && (
//                             <div className="space-y-6">
//                                 {/* Order Summary Card */}
//                                 <div className="bg-white border border-gray-200 rounded-2xl p-6">
//                                     <div className="flex items-start justify-between mb-6">
//                                         <div>
//                                             <h2 className="text-xl font-bold uppercase tracking-wider mb-1">
//                                                 Order #{order._id || order.id}
//                                             </h2>
//                                             <p className="text-sm text-gray-500">
//                                                 Placed on{" "}
//                                                 {formatDate(order.createdAt)}
//                                             </p>
//                                         </div>
//                                         <span
//                                             className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${getStatusColor(
//                                                 order.status,
//                                             )}`}
//                                         >
//                                             {order.status || "Processing"}
//                                         </span>
//                                     </div>

//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
//                                         <div className="flex items-start gap-3">
//                                             <CreditCard
//                                                 className="text-gray-400 mt-1"
//                                                 size={20}
//                                             />
//                                             <div>
//                                                 <p className="text-xs text-gray-500 uppercase mb-1">
//                                                     Grand Total
//                                                 </p>
//                                                 <p className="text-2xl font-bold">
//                                                     RS{" "}
//                                                     {Number(
//                                                         order.grandTotal || 0,
//                                                     ).toLocaleString()}
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         <div className="flex items-start gap-3">
//                                             <Truck
//                                                 className="text-gray-400 mt-1"
//                                                 size={20}
//                                             />
//                                             <div>
//                                                 <p className="text-xs text-gray-500 uppercase mb-1">
//                                                     Shipping Info
//                                                 </p>
//                                                 <p className="text-xs text-gray-500">
//                                                     RS{" "}
//                                                     {Number(
//                                                         order.shippingFee || 0,
//                                                     ).toLocaleString()}
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         <div className="flex items-start gap-3">
//                                             <Calendar
//                                                 className="text-gray-400 mt-1"
//                                                 size={20}
//                                             />
//                                             <div>
//                                                 <p className="text-xs text-gray-500 uppercase mb-1">
//                                                     Payment Method
//                                                 </p>
//                                                 <p className="text-sm font-semibold uppercase">
//                                                     {order.payment?.method ||
//                                                         "N/A"}
//                                                 </p>
//                                                 <p className="text-xs text-gray-500">
//                                                     {order.payment?.ispaid
//                                                         ? "Paid"
//                                                         : "Unpaid"}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Delivery Information */}
//                                 <div className="bg-white border border-gray-200 rounded-2xl p-6">
//                                     <div className="flex items-center gap-2 mb-4">
//                                         <MapPin size={20} />
//                                         <h3 className="text-lg font-bold uppercase tracking-wider">
//                                             Delivery Information
//                                         </h3>
//                                     </div>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div className="flex items-start gap-3">
//                                             <User
//                                                 className="text-gray-400 mt-1"
//                                                 size={18}
//                                             />
//                                             <div>
//                                                 <p className="text-xs text-gray-500 uppercase mb-1">
//                                                     Recipient
//                                                 </p>
//                                                 <p className="font-semibold">
//                                                     {order.recipient?.name ||
//                                                         "Guest User"}
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         <div className="flex items-start gap-3">
//                                             <Phone
//                                                 className="text-gray-400 mt-1"
//                                                 size={18}
//                                             />
//                                             <div>
//                                                 <p className="text-xs text-gray-500 uppercase mb-1">
//                                                     Phone
//                                                 </p>
//                                                 <p className="font-semibold">
//                                                     {order.recipient?.phone ||
//                                                         "N/A"}
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         <div className="md:col-span-2 flex items-start gap-3">
//                                             <MapPin
//                                                 className="text-gray-400 mt-1"
//                                                 size={18}
//                                             />
//                                             <div>
//                                                 <p className="text-xs text-gray-500 uppercase mb-1">
//                                                     Delivery Address
//                                                 </p>
//                                                 <p className="font-semibold">
//                                                     {order.recipient?.street}
//                                                     {order.recipient
//                                                         ?.addressLine2 &&
//                                                         `, ${order.recipient.addressLine2}`}
//                                                 </p>
//                                                 <p className="text-sm text-gray-600">
//                                                     {[
//                                                         order.recipient?.city,
//                                                         order.recipient?.state,
//                                                         order.recipient
//                                                             ?.postalCode,
//                                                         order.recipient
//                                                             ?.country,
//                                                     ]
//                                                         .filter(Boolean)
//                                                         .join(", ")}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Order Items */}
//                                 <div className="bg-white border border-gray-200 rounded-2xl p-6">
//                                     <div className="flex items-center gap-2 mb-6">
//                                         <Package size={20} />
//                                         <h3 className="text-lg font-bold uppercase tracking-wider">
//                                             Order Items
//                                         </h3>
//                                     </div>

//                                     <div className="space-y-4">
//                                         {order.items?.map((item, index) => {
//                                             // Handle both populated and non-populated product
//                                             const productName =
//                                                 typeof item.product === "object"
//                                                     ? item.product?.name
//                                                     : null;
//                                             const productId =
//                                                 typeof item.product === "object"
//                                                     ? item.product?._id ||
//                                                       item.product?.id
//                                                     : item.product;

//                                             return (
//                                                 <div
//                                                     key={index}
//                                                     className="flex items-start justify-between p-4 bg-gray-50 rounded-2xl"
//                                                 >
//                                                     <div className="flex-1">
//                                                         <div className="flex items-start justify-between mb-2">
//                                                             <div>
//                                                                 {productName ? (
//                                                                     <>
//                                                                         <p className="font-semibold text-lg">
//                                                                             {
//                                                                                 productName
//                                                                             }
//                                                                         </p>
//                                                                         <p className="text-xs text-gray-500">
//                                                                             ID:{" "}
//                                                                             {
//                                                                                 productId
//                                                                             }
//                                                                         </p>
//                                                                     </>
//                                                                 ) : (
//                                                                     <p className="font-semibold">
//                                                                         Product
//                                                                         ID:{" "}
//                                                                         {
//                                                                             productId
//                                                                         }
//                                                                     </p>
//                                                                 )}
//                                                                 <p className="text-sm text-gray-600 mt-1">
//                                                                     Quantity:{" "}
//                                                                     {
//                                                                         item.quantity
//                                                                     }
//                                                                 </p>
//                                                             </div>
//                                                             <span
//                                                                 className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
//                                                                     item.status ===
//                                                                     "cancelled"
//                                                                         ? "bg-red-100 text-red-800"
//                                                                         : "bg-green-100 text-green-800"
//                                                                 }`}
//                                                             >
//                                                                 {item.status ||
//                                                                     "Active"}
//                                                             </span>
//                                                         </div>

//                                                         {order.status ===
//                                                             "delivered" &&
//                                                             item.status !==
//                                                                 "cancelled" &&
//                                                             !reviewedProductIds.includes(
//                                                                 productId,
//                                                             ) && (
//                                                                 <button
//                                                                     onClick={() => {
//                                                                         setSelectedProduct(
//                                                                             {
//                                                                                 _id: productId,
//                                                                                 name:
//                                                                                     productName ||
//                                                                                     "Product",
//                                                                             },
//                                                                         );
//                                                                         setIsReviewModalOpen(
//                                                                             true,
//                                                                         );
//                                                                     }}
//                                                                     className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-2 border border-emerald-100 bg-emerald-50 px-3 py-1.5 rounded-xl w-fit"
//                                                                 >
//                                                                     <Star
//                                                                         size={
//                                                                             12
//                                                                         }
//                                                                         className="fill-emerald-600"
//                                                                     />
//                                                                     Give Review
//                                                                 </button>
//                                                             )}

//                                                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
//                                                             <div>
//                                                                 <p className="text-gray-500">
//                                                                     Price
//                                                                 </p>
//                                                                 <p className="font-semibold">
//                                                                     RS{" "}
//                                                                     {Number(
//                                                                         item.price ||
//                                                                             0,
//                                                                     ).toLocaleString()}
//                                                                 </p>
//                                                             </div>

//                                                             {item.discount >
//                                                                 0 && (
//                                                                 <div>
//                                                                     <p className="text-gray-500">
//                                                                         Discount
//                                                                     </p>
//                                                                     <p className="font-semibold text-green-600">
//                                                                         -Rs:
//                                                                         {
//                                                                             item.discount
//                                                                         }
//                                                                     </p>
//                                                                 </div>
//                                                             )}

//                                                             {item.promotion
//                                                                 ?.title && (
//                                                                 <div className="md:col-span-2">
//                                                                     <p className="text-gray-500">
//                                                                         Promotion
//                                                                     </p>
//                                                                     <p className="font-semibold text-blue-600">
//                                                                         {
//                                                                             item
//                                                                                 .promotion
//                                                                                 .title
//                                                                         }
//                                                                     </p>
//                                                                 </div>
//                                                             )}

//                                                             <div>
//                                                                 <p className="text-gray-500">
//                                                                     Total
//                                                                 </p>
//                                                                 <p className="font-bold text-lg">
//                                                                     RS{" "}
//                                                                     {Number(
//                                                                         item.totalAmount ||
//                                                                             0,
//                                                                     ).toLocaleString()}
//                                                                 </p>
//                                                             </div>
//                                                         </div>

//                                                         {item.cancellationReason && (
//                                                             <p className="mt-2 text-sm text-red-600">
//                                                                 Cancellation
//                                                                 reason:{" "}
//                                                                 {
//                                                                     item.cancellationReason
//                                                                 }
//                                                             </p>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>

//                                     {/* Order Totals */}
//                                     <div className="mt-6 pt-6 border-t space-y-2">
//                                         {order.taxAmount > 0 && (
//                                             <div className="flex justify-between text-sm">
//                                                 <span className="text-gray-600">
//                                                     Tax Amount
//                                                 </span>
//                                                 <span className="font-semibold">
//                                                     RS{" "}
//                                                     {Number(
//                                                         order.taxAmount || 0,
//                                                     ).toLocaleString()}
//                                                 </span>
//                                             </div>
//                                         )}
//                                         <div className="flex justify-between text-sm">
//                                             <span className="text-gray-600">
//                                                 Shipping Fee
//                                             </span>
//                                             <span className="font-semibold">
//                                                 RS{" "}
//                                                 {Number(
//                                                     order.shippingFee || 0,
//                                                 ).toLocaleString()}
//                                             </span>
//                                         </div>
//                                         <div className="flex justify-between text-lg font-bold pt-2 border-t">
//                                             <span>Grand Total</span>
//                                             <span>
//                                                 RS{" "}
//                                                 {Number(
//                                                     order.grandTotal || 0,
//                                                 ).toLocaleString()}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Cancellation Info */}
//                                 {order.status === "cancelled" &&
//                                     order.cancellationReason && (
//                                         <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
//                                             <h3 className="text-lg font-bold text-red-800 mb-2">
//                                                 Order Cancelled
//                                             </h3>
//                                             <p className="text-red-700">
//                                                 Reason:{" "}
//                                                 {order.cancellationReason}
//                                             </p>
//                                         </div>
//                                     )}
//                             </div>
//                         )}

//                         {!loading && !order && !error && (
//                             <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
//                                 <Package
//                                     className="mx-auto text-gray-300 mb-4"
//                                     size={64}
//                                 />
//                                 <p className="text-gray-500 text-lg">
//                                     Enter an order ID to track your order
//                                 </p>
//                             </div>
//                         )}
//                     </div>

//                     {/* RIGHT: SAVED ORDERS */}
//                     <div className="lg:col-span-4">
//                         <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-4">
//                             <div className="flex items-center gap-3 mb-6">
//                                 <Receipt size={20} />
//                                 <h2 className="text-sm font-bold uppercase tracking-widest">
//                                     Recent Orders
//                                 </h2>
//                             </div>

//                             {savedOrders.length === 0 ? (
//                                 <div className="text-center py-8">
//                                     <Receipt
//                                         className="mx-auto text-gray-300 mb-3"
//                                         size={40}
//                                     />
//                                     <p className="text-sm text-gray-500">
//                                         No recent orders found
//                                     </p>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-2">
//                                     {savedOrders.map((id) => (
//                                         <button
//                                             key={id}
//                                             onClick={() =>
//                                                 handleSavedOrderClick(id)
//                                             }
//                                             className={`w-full flex items-center justify-between p-3 border rounded-2xl transition-all ${
//                                                 selectedOrderId === id
//                                                     ? "bg-black text-white border-black"
//                                                     : "bg-white hover:bg-gray-50 border-gray-200"
//                                             }`}
//                                         >
//                                             <div className="flex items-center gap-3">
//                                                 <CheckCircle2 size={16} />
//                                                 <span className="text-sm font-bold">
//                                                     #{id.slice(-8)}
//                                                 </span>
//                                             </div>
//                                             <ChevronRight size={16} />
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {selectedProduct && (
//                 <ReviewModal
//                     isOpen={isReviewModalOpen}
//                     onClose={() => setIsReviewModalOpen(false)}
//                     product={selectedProduct}
//                     orderRecipient={order?.recipient}
//                     onSuccess={(id) =>
//                         setReviewedProductIds((prev) => [...prev, id])
//                     }
//                 />
//             )}
//         </div>
//     );
// };

// export default TrackOrderPage;

import { useEffect, useState } from "react";
import { useOrderById } from "../features/orders/orders.queries.js";
import { readGuestOrders } from "../utils/guestOrders";
import {
    Loader2,
    Receipt,
    ChevronRight,
    Search,
    CheckCircle2,
    Package,
    MapPin,
    CreditCard,
    Calendar,
    User,
    Phone,
    Truck,
    Star,
    Leaf,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "../Components/Breadcrumb.jsx";
import ReviewModal from "../Components/ReviewModal.jsx";

/* ─── Variants ─── */
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (d = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: d },
    }),
};

const cardFade = {
    hidden: { opacity: 0, y: 16 },
    visible: (d = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: d },
    }),
};

/* ─── Status styling ─── */
const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
        case "delivered":
            return "bg-[#eef6ea] text-[#2e6b2e] border border-[#c3e0b8]";
        case "shipped":
            return "bg-[#eff6ff] text-[#1e4d8c] border border-[#bfdbfe]";
        case "pending":
            return "bg-[#fefce8] text-[#854d0e] border border-[#fde68a]";
        case "cancelled":
            return "bg-[#fff1f2] text-[#9f1239] border border-[#fecdd3]";
        default:
            return "bg-stone-100 text-stone-600 border border-stone-200";
    }
};

const TrackOrderPage = () => {
    const [orderId, setOrderId] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [savedOrders, setSavedOrders] = useState([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [reviewedProductIds, setReviewedProductIds] = useState([]);

    const {
        data,
        isLoading: loading,
        error,
    } = useOrderById(selectedOrderId, {
        enabled: !!selectedOrderId,
    });

    const order = data?.order || null;

    useEffect(() => {
        const ordersObj = readGuestOrders();
        const allOrders = Object.values(ordersObj).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setSavedOrders(allOrders);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;
        setSelectedOrderId(orderId.trim());
    };

    // const handleSavedOrderClick = (id) => {
    //     setOrderId(id);
    //     setSelectedOrderId(id);
    // };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Track Order" },
    ];

    return (
        <div className="min-h-screen bg-[#fdfdfb]">
            {/* ── Hero Banner ── */}
            <div className="relative w-full bg-[#f4f8f2] border-b border-[#e8f0e4] overflow-hidden">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#d6eacc] opacity-40 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-8 w-48 h-48 rounded-full bg-[#e8f4e0] opacity-50 blur-2xl pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-14 md:py-16 flex flex-col items-center text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[#7aaf68] mb-3"
                    >
                        <Leaf size={10} /> Order Status
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        className="text-2xl md:text-3xl font-light tracking-[0.25em] uppercase text-[#1a2e1a] mb-3"
                    >
                        Track Your Order
                    </motion.h1>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                            duration: 0.55,
                            ease: "easeOut",
                            delay: 0.2,
                        }}
                        className="w-10 h-px bg-[#b5d4a6] mb-3 origin-center"
                    />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs text-stone-400 tracking-widest"
                    >
                        Enter your order ID or select from recent orders
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* ── Search Bar ── */}
                <motion.div
                    custom={0}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="mb-10"
                >
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                                size={16}
                            />
                            <input
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="Enter your order ID..."
                                className="w-full border border-[#dcebd5] bg-white rounded-2xl px-12 py-4 text-sm tracking-widest outline-none focus:ring-2 focus:ring-[#7aaf68] focus:border-transparent placeholder:text-stone-300 text-[#1a2e1a] transition-all"
                            />
                        </div>
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{
                                scale: 1.03,
                                backgroundColor: "#2e4a2e",
                            }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.2 }}
                            className="bg-[#1a2e1a] text-white px-8 py-4 rounded-2xl text-[10px] uppercase tracking-[0.25em] disabled:opacity-50 transition-colors"
                        >
                            {loading ? (
                                <Loader2
                                    className="animate-spin mx-auto"
                                    size={16}
                                />
                            ) : (
                                "Track"
                            )}
                        </motion.button>
                    </form>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-3 p-4 bg-[#fff1f2] border border-[#fecdd3] rounded-2xl"
                            >
                                <p className="text-xs text-rose-600 uppercase tracking-widest">
                                    Order fetching failed!
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ── Main Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT: ORDER DETAILS */}
                    <div className="lg:col-span-8 space-y-5">
                        {/* Loading */}
                        {loading && (
                            <div className="bg-white border border-[#e8f0e4] rounded-3xl p-20 flex flex-col items-center justify-center gap-4">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.4,
                                        ease: "linear",
                                    }}
                                >
                                    <Loader2
                                        className="text-[#7aaf68]"
                                        size={22}
                                        strokeWidth={1.5}
                                    />
                                </motion.div>
                                <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400">
                                    Fetching your ritual…
                                </p>
                            </div>
                        )}

                        {/* Empty placeholder */}
                        {!loading && !order && !error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-[#f8faf7] border border-dashed border-[#dcebd5] rounded-3xl p-20 flex flex-col items-center justify-center text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-[#eef6ea] flex items-center justify-center mb-5">
                                    <Package
                                        size={22}
                                        strokeWidth={1}
                                        className="text-[#b5d4a6]"
                                    />
                                </div>
                                <p className="text-xs uppercase tracking-[0.25em] text-stone-400">
                                    Enter an order ID to track your order
                                </p>
                            </motion.div>
                        )}

                        {/* Order Data */}
                        {!loading && order && (
                            <AnimatePresence>
                                <div className="space-y-5">
                                    {/* ── Order Summary Card ── */}
                                    <motion.div
                                        custom={0}
                                        variants={cardFade}
                                        initial="hidden"
                                        animate="visible"
                                        className="bg-white border border-[#e8f0e4] rounded-3xl p-6 md:p-8"
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-[#7aaf68] mb-1">
                                                    Order
                                                </p>
                                                <h2 className="text-lg font-light tracking-[0.15em] uppercase text-[#1a2e1a]">
                                                    #{order._id || order.id}
                                                </h2>
                                                <p className="text-xs text-stone-400 mt-1 tracking-wide">
                                                    Placed on{" "}
                                                    {formatDate(
                                                        order.createdAt,
                                                    )}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-4 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-widest ${getStatusStyle(order.status)}`}
                                            >
                                                {order.status || "Processing"}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 border-t border-[#f0f5ee]">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-[#eef6ea] flex items-center justify-center shrink-0">
                                                    <CreditCard
                                                        size={14}
                                                        className="text-[#7aaf68]"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">
                                                        Grand Total
                                                    </p>
                                                    <p className="text-xl font-light text-[#1a2e1a]">
                                                        RS{" "}
                                                        {Number(
                                                            order.grandTotal ||
                                                            0,
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-[#eef6ea] flex items-center justify-center shrink-0">
                                                    <Truck
                                                        size={14}
                                                        className="text-[#7aaf68]"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">
                                                        Shipping Fee
                                                    </p>
                                                    <p className="text-sm text-stone-600">
                                                        RS{" "}
                                                        {Number(
                                                            order.shippingFee ||
                                                            0,
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-[#eef6ea] flex items-center justify-center shrink-0">
                                                    <Calendar
                                                        size={14}
                                                        className="text-[#7aaf68]"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">
                                                        Payment
                                                    </p>
                                                    <p className="text-sm font-medium uppercase text-[#1a2e1a]">
                                                        {order.payment
                                                            ?.method || "N/A"}
                                                    </p>
                                                    <p className="text-[10px] text-stone-400">
                                                        {order.payment?.ispaid
                                                            ? "Paid"
                                                            : "Unpaid"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* ── Delivery Information ── */}
                                    <motion.div
                                        custom={0.08}
                                        variants={cardFade}
                                        initial="hidden"
                                        animate="visible"
                                        className="bg-white border border-[#e8f0e4] rounded-3xl p-6 md:p-8"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-xl bg-[#eef6ea] flex items-center justify-center">
                                                <MapPin
                                                    size={14}
                                                    className="text-[#7aaf68]"
                                                />
                                            </div>
                                            <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-[#1a2e1a]">
                                                Delivery Information
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="flex items-start gap-3">
                                                <User
                                                    size={15}
                                                    className="text-stone-300 mt-0.5"
                                                />
                                                <div>
                                                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">
                                                        Recipient
                                                    </p>
                                                    <p className="text-sm text-[#1a2e1a] font-medium">
                                                        {order.recipient
                                                            ?.name ||
                                                            "Guest User"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Phone
                                                    size={15}
                                                    className="text-stone-300 mt-0.5"
                                                />
                                                <div>
                                                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">
                                                        Phone
                                                    </p>
                                                    <p className="text-sm text-[#1a2e1a] font-medium">
                                                        {order.recipient
                                                            ?.phone || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 flex items-start gap-3">
                                                <MapPin
                                                    size={15}
                                                    className="text-stone-300 mt-0.5"
                                                />
                                                <div>
                                                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">
                                                        Delivery Address
                                                    </p>
                                                    <p className="text-sm text-[#1a2e1a] font-medium">
                                                        {
                                                            order.recipient
                                                                ?.street
                                                        }
                                                        {order.recipient
                                                            ?.addressLine2 &&
                                                            `, ${order.recipient.addressLine2}`}
                                                    </p>
                                                    <p className="text-xs text-stone-400 mt-0.5">
                                                        {[
                                                            order.recipient
                                                                ?.city,
                                                            order.recipient
                                                                ?.state,
                                                            order.recipient
                                                                ?.postalCode,
                                                            order.recipient
                                                                ?.country,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(", ")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* ── Order Items ── */}
                                    <motion.div
                                        custom={0.16}
                                        variants={cardFade}
                                        initial="hidden"
                                        animate="visible"
                                        className="bg-white border border-[#e8f0e4] rounded-3xl p-6 md:p-8"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-xl bg-[#eef6ea] flex items-center justify-center">
                                                <Package
                                                    size={14}
                                                    className="text-[#7aaf68]"
                                                />
                                            </div>
                                            <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-[#1a2e1a]">
                                                Order Items
                                            </h3>
                                        </div>

                                        <div className="space-y-4">
                                            {order.items?.map((item, index) => {
                                                const productName =
                                                    typeof item.product ===
                                                        "object"
                                                        ? item.product?.name
                                                        : null;
                                                const productId =
                                                    typeof item.product ===
                                                        "object"
                                                        ? item.product?._id ||
                                                        item.product?.id
                                                        : item.product;

                                                return (
                                                    <motion.div
                                                        key={index}
                                                        initial={{
                                                            opacity: 0,
                                                            y: 10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        transition={{
                                                            delay: index * 0.06,
                                                        }}
                                                        className="p-5 bg-[#f8faf7] border border-[#eef3eb] rounded-2xl"
                                                    >
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                {productName ? (
                                                                    <>
                                                                        <p className="text-sm font-medium text-[#1a2e1a]">
                                                                            {
                                                                                productName
                                                                            }
                                                                        </p>
                                                                        <p className="text-[10px] text-stone-400 mt-0.5">
                                                                            ID:{" "}
                                                                            {
                                                                                productId
                                                                            }
                                                                        </p>
                                                                    </>
                                                                ) : (
                                                                    <p className="text-sm font-medium text-[#1a2e1a]">
                                                                        Product
                                                                        ID:{" "}
                                                                        {
                                                                            productId
                                                                        }
                                                                    </p>
                                                                )}
                                                                <p className="text-xs text-stone-400 mt-1">
                                                                    Qty:{" "}
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </p>
                                                            </div>
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium ${item.status ===
                                                                    "cancelled"
                                                                    ? "bg-[#fff1f2] text-rose-700 border border-[#fecdd3]"
                                                                    : "bg-[#eef6ea] text-[#2e6b2e] border border-[#c3e0b8]"
                                                                    }`}
                                                            >
                                                                {item.status ||
                                                                    "Active"}
                                                            </span>
                                                        </div>

                                                        {order.status ===
                                                            "delivered" &&
                                                            item.status !==
                                                            "cancelled" &&
                                                            !reviewedProductIds.includes(
                                                                productId,
                                                            ) && (
                                                                // animate small and big infinity
                                                                <motion.button
                                                                    animate={{ scale: [1, 1.1, 1] }} // grow then shrink
                                                                    transition={{
                                                                        duration: 1,      // full grow+shrink cycle takes 1 second
                                                                        ease: "easeInOut",
                                                                        repeat: Infinity, // repeat forever
                                                                    }}
                                                                    onClick={() => {
                                                                        setSelectedProduct({
                                                                            _id: productId,
                                                                            name: productName || "Product",
                                                                        });
                                                                        setIsReviewModalOpen(true);
                                                                    }}
                                                                    className="mb-3 text-[10px] font-medium uppercase tracking-widest text-yellow-800 hover:text-[#5a9050] transition-colors flex items-center gap-2 border border-[#c3e0b8] bg-yellow-300 px-3 py-1.5 rounded-xl w-fit"
                                                                >
                                                                    <Star size={11} className="fill-yellow-900" />
                                                                    Give Review
                                                                </motion.button>
                                                            )}

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-3 border-t border-[#e8f0e4]">
                                                            <div>
                                                                <p className="text-stone-400 mb-0.5">
                                                                    Price
                                                                </p>
                                                                <p className="font-medium text-[#1a2e1a]">
                                                                    RS{" "}
                                                                    {Number(
                                                                        item.price ||
                                                                        0,
                                                                    ).toLocaleString()}
                                                                </p>
                                                            </div>
                                                            {item.discount >
                                                                0 && (
                                                                    <div>
                                                                        <p className="text-stone-400 mb-0.5">
                                                                            Discount
                                                                        </p>
                                                                        <p className="font-medium text-[#2e6b2e]">
                                                                            -RS{" "}
                                                                            {
                                                                                item.discount
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            {item.promotion
                                                                ?.title && (
                                                                    <div className="md:col-span-2">
                                                                        <p className="text-stone-400 mb-0.5">
                                                                            Promotion
                                                                        </p>
                                                                        <p className="font-medium text-[#1e4d8c]">
                                                                            {
                                                                                item
                                                                                    .promotion
                                                                                    .title
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            <div>
                                                                <p className="text-stone-400 mb-0.5">
                                                                    Total
                                                                </p>
                                                                <p className="font-semibold text-[#1a2e1a] text-sm">
                                                                    RS{" "}
                                                                    {Number(
                                                                        item.totalAmount ||
                                                                        0,
                                                                    ).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {item.cancellationReason && (
                                                            <p className="mt-3 text-xs text-rose-600">
                                                                Cancellation
                                                                reason:{" "}
                                                                {
                                                                    item.cancellationReason
                                                                }
                                                            </p>
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>

                                        {/* Order Totals */}
                                        <div className="mt-6 pt-5 border-t border-[#eef3eb] space-y-2">
                                            {order.taxAmount > 0 && (
                                                <div className="flex justify-between text-xs text-stone-500">
                                                    <span>Tax Amount</span>
                                                    <span>
                                                        RS{" "}
                                                        {Number(
                                                            order.taxAmount ||
                                                            0,
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-xs text-stone-500">
                                                <span>Shipping Fee</span>
                                                <span>
                                                    RS{" "}
                                                    {Number(
                                                        order.shippingFee || 0,
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm font-medium text-[#1a2e1a] pt-3 border-t border-[#e8f0e4]">
                                                <span className="uppercase tracking-widest text-xs">
                                                    Grand Total
                                                </span>
                                                <span className="text-lg font-light">
                                                    RS{" "}
                                                    {Number(
                                                        order.grandTotal || 0,
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* ── Cancellation Info ── */}
                                    {order.status === "cancelled" &&
                                        order.cancellationReason && (
                                            <motion.div
                                                custom={0.24}
                                                variants={cardFade}
                                                initial="hidden"
                                                animate="visible"
                                                className="bg-[#fff1f2] border border-[#fecdd3] rounded-3xl p-6"
                                            >
                                                <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-rose-800 mb-2">
                                                    Order Cancelled
                                                </h3>
                                                <p className="text-sm text-rose-700">
                                                    Reason:{" "}
                                                    {order.cancellationReason}
                                                </p>
                                            </motion.div>
                                        )}
                                </div>
                            </AnimatePresence>
                        )}
                    </div>

                    {/* RIGHT: SAVED ORDERS */}
                    <div className="lg:col-span-4">
                        <motion.div
                            custom={0.1}
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            className="bg-white border border-[#e8f0e4] rounded-3xl p-6 sticky top-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-xl bg-[#eef6ea] flex items-center justify-center">
                                    <Receipt
                                        size={14}
                                        className="text-[#7aaf68]"
                                    />
                                </div>
                                <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-[#1a2e1a]">
                                    Recent Orders
                                </h2>
                            </div>

                            {savedOrders.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="w-12 h-12 rounded-full bg-[#f8faf7] flex items-center justify-center mx-auto mb-3">
                                        <Receipt
                                            size={18}
                                            strokeWidth={1}
                                            className="text-stone-300"
                                        />
                                    </div>
                                    <p className="text-xs text-stone-400 tracking-wide">
                                        No recent orders found
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {savedOrders.map((order) => (
                                        <motion.button
                                            key={order.orderId}
                                            onClick={() => {
                                                setOrderId(order.orderId);
                                                setSelectedOrderId(order.orderId);
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{ duration: 0.15 }}
                                            className={`w-full flex flex-col items-start p-3.5 rounded-2xl border transition-all text-left relative ${selectedOrderId === order.orderId
                                                ? "bg-[#1a2e1a] text-white border-[#1a2e1a]"
                                                : "bg-[#f8faf7] hover:bg-[#eef6ea] border-[#e8f0e4] text-[#1a2e1a]"
                                                }`}
                                        >
                                            <div className="absolute top-9 right-3">
                                                <img src={order.items[0]?.image} alt="" className="w-16 h-16 rounded" />
                                            </div>
                                            <div className="flex items-center justify-between w-full mb-1">
                                                <span className="text-xs font-medium tracking-widest">
                                                    #{order.orderId.slice(-8)}
                                                </span>
                                                <span className="text-xs font-semibold text-stone-500">
                                                    <span>{new Date(order.createdAt).toLocaleDateString("en-US")}</span>
                                                </span>
                                            </div>


                                            <div className="">
                                                <span className={`mt-1 text-sm font-medium ${selectedOrderId === order.orderId ? "text-white" : "text-[#1a2e1a]"}`}>
                                                    Quantity: {" "}
                                                    {Number(order.items[0]?.quantity || 0).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="">
                                                <span className={`mt-1 text-sm font-medium ${selectedOrderId === order.orderId ? "text-white" : "text-[#1a2e1a]"}`}>
                                                    Unit Price: RS :{" "}
                                                    {Number(order.items[0]?.unitPrice || 0).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="">
                                                <span className={`mt-1 text-sm font-medium ${selectedOrderId === order.orderId ? "text-white" : "text-[#1a2e1a]"}`}>
                                                    Total Amount: RS : {" "}
                                                    {Number(order.grandTotal || 0).toLocaleString()}
                                                </span>
                                            </div>

                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {selectedProduct && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    product={selectedProduct}
                    orderRecipient={order?.recipient}
                    onSuccess={(id) =>
                        setReviewedProductIds((prev) => [...prev, id])
                    }
                />
            )}
        </div>
    );
};

export default TrackOrderPage;

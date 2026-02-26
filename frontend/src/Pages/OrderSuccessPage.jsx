import { useLocation, Link, useSearchParams } from "react-router-dom";
import { useOrderById } from "../features/orders/orders.queries.js";
import { getLastGuestOrder } from "../utils/guestOrders";
import { Check, Loader2, Mail, Tag } from "lucide-react";
import Breadcrumb from "../Components/Breadcrumb.jsx";

const OrderSuccessPage = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const orderId =
        location.state?.orderId ||
        searchParams.get("id") ||
        getLastGuestOrder()?._id ||
        getLastGuestOrder()?.id;

    const { data, loading } = useOrderById(orderId);

    let order = data?.order;

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Order Success" },
    ];

    if (loading || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Loader2
                    className="animate-spin text-zinc-900 mb-4"
                    size={30}
                    strokeWidth={1}
                />
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                    Verifying transaction
                </p>
            </div>
        );
    }

    // // Calculate totals from order model
    // const itemsSubtotal = order.items?.reduce(
    //     (sum, item) => sum + (item.totalAmount || 0),
    //     0,
    // );

    const totalDiscounts = order.items?.reduce(
        (sum, item) => sum + (item.discountTotal || 0),
        0,
    );
    const shippingFee = Number(order.shippingFee) || 0;
    const taxAmount = Number(order.taxAmount) || 0;
    const grandTotal = Number(order.grandTotal) || 0;

    // Get payment method display
    const getPaymentMethodDisplay = (method) => {
        const methods = {
            COD: "Cash on Delivery (COD)",
            online: "Online Payment",
            card: "Credit/Debit Card",
            bank: "Bank Transfer",
            wallet: "Digital Wallet",
        };
        return methods[method] || method;
    };

    return (
        <div className="bg-white min-h-screen mt-20">
            <div className="container mx-auto px-4 lg:px-20 py-12">
                <Breadcrumb items={breadcrumbItems} />
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    <div className="flex-1 space-y-10 w-full">
                        <header className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-full border border-zinc-900 flex items-center justify-center shrink-0 mt-1">
                                <Check size={28} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-zinc-500 text-md tracking-tight">
                                    Confirmation #
                                    {(order.id || order._id)
                                        ?.toString()
                                        .toUpperCase()}
                                </p>
                                <h1 className="text-2xl font-medium text-zinc-900 mt-1">
                                    Thank you,{" "}
                                    {order.recipient?.name?.split(" ")[0]}!
                                </h1>
                                <p className="text-sm text-zinc-700 mt-2">
                                    Order Status:{" "}
                                    <span className="font-semibold capitalize">
                                        {order.status}
                                    </span>
                                </p>
                            </div>
                        </header>

                        <section className="p-6 border border-zinc-200 rounded-2xl">
                            <h2 className="text-base font-medium mb-3">
                                Your order is confirmed
                            </h2>
                            <p className="text-sm text-zinc-600 leading-relaxed font-light">
                                {order.status === "pending"
                                    ? "We will be in touch with you shortly to finalize your order. Please note that your purchase is not complete until a member of our team confirms your order."
                                    : order.status === "shipped"
                                      ? "Your order has been shipped and is on its way to you."
                                      : order.status === "delivered"
                                        ? "Your order has been successfully delivered."
                                        : "Your order has been received and is being processed."}
                            </p>
                        </section>

                        <section className="p-6 border border-zinc-200 rounded-2xl">
                            <h2 className="text-lg font-medium mb-6">
                                Order details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900 mb-2">
                                        Contact information
                                    </h3>
                                    <div className="text-sm text-zinc-600 space-y-1">
                                        <p>{order.recipient?.phone}</p>
                                        {order.recipient?.email && (
                                            <p>{order.recipient.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900 mb-2">
                                        Payment method
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="px-2 py-0.5 border border-zinc-200 rounded bg-zinc-50 flex items-center gap-1">
                                            <span className="text-sm font-bold text-zinc-500">
                                                {order.payment?.method === "COD"
                                                    ? "$"
                                                    : "💳"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm text-zinc-600">
                                                {getPaymentMethodDisplay(
                                                    order.payment?.method,
                                                )}{" "}
                                                · Rs{" "}
                                                {grandTotal.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {order.payment?.ispaid
                                                    ? "✓ Paid"
                                                    : "Payment pending"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900 mb-2">
                                        Shipping address
                                    </h3>
                                    <div className="text-sm text-zinc-600 space-y-0.5 leading-relaxed font-light">
                                        <p>{order.recipient?.name}</p>
                                        <p>{order.recipient?.street}</p>
                                        {order.recipient?.addressLine2 && (
                                            <p>
                                                {order.recipient.addressLine2}
                                            </p>
                                        )}
                                        <p>
                                            {[
                                                order.recipient?.city,
                                                order.recipient?.state,
                                            ]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </p>
                                        {order.recipient?.postalCode && (
                                            <p>{order.recipient.postalCode}</p>
                                        )}
                                        {order.recipient?.country && (
                                            <p>{order.recipient.country}</p>
                                        )}
                                        <p>{order.recipient?.phone}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900 mb-2">
                                        Billing address
                                    </h3>
                                    <div className="text-sm text-zinc-600 space-y-0.5 leading-relaxed font-light">
                                        <p>{order.recipient?.name}</p>
                                        <p>{order.recipient?.street}</p>
                                        {order.recipient?.addressLine2 && (
                                            <p>
                                                {order.recipient.addressLine2}
                                            </p>
                                        )}
                                        <p>
                                            {[
                                                order.recipient?.city,
                                                order.recipient?.state,
                                            ]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </p>
                                        {order.recipient?.postalCode && (
                                            <p>{order.recipient.postalCode}</p>
                                        )}
                                        {order.recipient?.country && (
                                            <p>{order.recipient.country}</p>
                                        )}
                                        <p>{order.recipient?.phone}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900 mb-2">
                                        Shipping info
                                    </h3>
                                    <p className="text-xs text-zinc-500 mt-1">
                                        {shippingFee === 0
                                            ? "Free Shipping"
                                            : `Rs ${shippingFee.toLocaleString()}`}
                                    </p>
                                </div>

                                {order.trackingToken && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-zinc-900 mb-2">
                                            Tracking Information
                                        </h3>
                                        <p className="text-sm text-zinc-600 font-mono">
                                            {order.trackingToken.slice(0, 20)}
                                            ...
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <div className="flex flex-col gap-6 pt-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-zinc-600">
                                    Need help?
                                </span>
                                <a
                                    href="mailto:support@eshop.com"
                                    className="text-zinc-900"
                                >
                                    <Mail size={18} strokeWidth={1.5} />
                                </a>
                                <a
                                    href="https://wa.me/..."
                                    className="text-zinc-900"
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                </a>
                            </div>
                            <Link
                                to="/products"
                                className="inline-block w-fit bg-zinc-900 text-white px-8 py-4 rounded-2xl text-sm font-medium hover:bg-zinc-800 transition-colors"
                            >
                                Continue shopping
                            </Link>
                        </div>

                        <footer className="pt-10 border-t border-zinc-100 flex flex-wrap gap-x-6 gap-y-2">
                            {[
                                "Refund policy",
                                "Shipping",
                                "Privacy policy",
                                "Terms of service",
                                "Contact",
                            ].map((link) => (
                                <Link
                                    key={link}
                                    to="#"
                                    className="text-xs text-zinc-700 border-b border-zinc-400 pb-0.5 hover:text-zinc-900 transition-colors"
                                >
                                    {link}
                                </Link>
                            ))}
                        </footer>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-[420px] bg-zinc-50 p-8 lg:p-10 lg:min-h-screen lg:-mt-12 lg:-mb-12 border-l border-zinc-200">
                        <div className="space-y-6">
                            {order.items?.map((item, index) => {
                                const productName =
                                    typeof item.product === "object"
                                        ? item.product?.name
                                        : null;
                                const productImage =
                                    item.product?.images[0]?.url;

                                return (
                                    <div key={index} className="space-y-2">
                                        <div className="flex gap-4">
                                            <div className="relative w-16 h-20 bg-white border border-zinc-200 rounded overflow-hidden shrink-0">
                                                <img
                                                    src={productImage}
                                                    className="w-full h-full object-cover"
                                                    alt={
                                                        productName || "Product"
                                                    }
                                                />

                                                <span className="absolute -top-2 -right-2 bg-zinc-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                                    {item.quantity}
                                                </span>
                                                {item.status ===
                                                    "cancelled" && (
                                                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                                        <span className="text-xs font-bold text-red-600">
                                                            CANCELLED
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 flex justify-between items-start">
                                                <div className="pr-4">
                                                    <p className="text-[13px] font-medium text-zinc-900 uppercase tracking-tight leading-tight">
                                                        {productName ||
                                                            "Product Item"}
                                                    </p>
                                                    {item.originalPrice &&
                                                        item.originalPrice >
                                                            item.price && (
                                                            <p className="text-sm text-zinc-500 mt-1">
                                                                Price :{" "}
                                                                {item.originalPrice.toLocaleString()}
                                                            </p>
                                                        )}
                                                    {item.promotion?.title && (
                                                        <p className="text-sm text-zinc-500 mt-1">
                                                            Discount Per Unit :{" "}
                                                            {item.discountPerUnit.toFixed(
                                                                2,
                                                            )}
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-zinc-500 mt-1">
                                                        Quantity :{" "}
                                                        {item.quantity.toLocaleString()}
                                                    </p>
                                                </div>
                                                {/* <div className="text-right">
                                                    <p className="text-sm font-medium text-zinc-900">
                                                        {" "}
                                                        {item.totalAmount.toLocaleString()}
                                                    </p>
                                                    {item.discount > 0 && (
                                                        <p className="text-xs text-green-600 font-medium ">
                                                            Total Discount :{" "}
                                                            {item.discount}{" "}
                                                        </p>
                                                    )}
                                                </div> */}
                                            </div>
                                        </div>

                                        {/* Item Promotion */}
                                        {item.promotion?.title && (
                                            <div className="ml-20 flex items-center gap-1.5 text-xs text-blue-600">
                                                <Tag size={12} />
                                                <span>
                                                    {item.promotion.title}
                                                </span>
                                            </div>
                                        )}

                                        {/* Item Cancellation */}
                                        {item.status === "cancelled" &&
                                            item.cancellationReason && (
                                                <div className="ml-20 text-xs text-red-600">
                                                    Cancelled:{" "}
                                                    {item.cancellationReason}
                                                </div>
                                            )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-10 pt-10 border-t border-zinc-200 space-y-3">
                            <div className="flex justify-between text-sm text-zinc-600">
                                <span>Original Total</span>
                                <span>
                                    Rs{" "}
                                    {order.items[0].originalPrice *
                                        order.items[0].quantity}
                                </span>
                            </div>
                            {totalDiscounts > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount per item</span>
                                    <span>
                                        -Rs{" "}
                                        {order.items[0].discountPerUnit.toLocaleString()}
                                    </span>
                                </div>
                            )}
                            {totalDiscounts > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Total Discount</span>
                                    <span>
                                        -Rs {totalDiscounts.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            {taxAmount > 0 && (
                                <div className="flex justify-between text-sm text-red-600">
                                    <span>Tax</span>
                                    <span>Rs {taxAmount.toLocaleString()}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-sm text-red-600 items-center">
                                <div className="flex items-center gap-1">
                                    <span>Shipping</span>
                                </div>
                                <span>
                                    {shippingFee === 0
                                        ? "FREE"
                                        : `Rs ${shippingFee.toLocaleString()}`}
                                </span>
                            </div>
                            {/* 
                            <div className="flex justify-between text-sm text-zinc-600">
                                <span>Subtotal</span>
                                <span>Rs {itemsSubtotal.toLocaleString()}</span>
                            </div> */}

                            <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
                                <span className="text-lg font-medium">
                                    Total
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xs text-zinc-500">
                                        PKR
                                    </span>
                                    <span className="text-xl font-semibold">
                                        Rs {grandTotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Cancellation Notice */}
                        {order.status === "cancelled" && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                                <p className="text-sm font-semibold text-red-800 mb-1">
                                    Order Cancelled
                                </p>
                                {order.cancellationReason && (
                                    <p className="text-xs text-red-600">
                                        Reason: {order.cancellationReason}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;

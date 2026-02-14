import { useEffect, useState } from "react";
import {
    useLocation,
    useNavigate,
    Link,
    useSearchParams,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetOrderById } from "../api/hooks/orders.api";
import { getLastGuestOrder } from "../utils/guestOrders";
import {
    Check,
    Loader2,
    Mail,
    Phone,
} from "lucide-react";

const OrderSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { getOrderById, loading } = useGetOrderById();

    const orderId =
        location.state?.orderId ||
        searchParams.get("id") ||
        getLastGuestOrder()?._id ||
        getLastGuestOrder()?.id;

    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (!orderId) {
            navigate("/track-order", { replace: true });
            return;
        }
        (async () => {
            const resp = await getOrderById(orderId);
            if (resp?.order) setOrder(resp.order);
        })();
    }, [orderId, navigate]);

    if (loading || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Loader2 className="animate-spin text-zinc-900 mb-4" size={30} strokeWidth={1} />
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Verifying transaction</p>
            </div>
        );
    }

    const itemsSubtotal = order.items?.reduce(
        (sum, item) => sum + (item.totalAmount || item.quantity * item.price),
        0
    );
    const shippingFee = Number(order.shippingFee) || 0;
    const grandTotal = Number(order.grandTotal) || 0;

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 lg:px-20 py-12">
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    <div className="flex-1 space-y-10 w-full">
                        <header className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-full border border-zinc-900 flex items-center justify-center flex-shrink-0 mt-1">
                                <Check size={28} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-zinc-400 text-md tracking-tight">
                                    Confirmation #{(order.id || order._id).toUpperCase()}
                                </p>
                                <h1 className="text-2xl font-medium text-zinc-900 mt-1">
                                    Thank you, {order.recipient?.name?.split(' ')[0]}!
                                </h1>
                            </div>
                        </header>

                        <section className="p-6 border border-zinc-200 rounded-lg">
                            <h2 className="text-base font-medium mb-3">Your order is confirmed</h2>
                            <p className="text-sm text-zinc-600 leading-relaxed font-light">
                                We will be in touch with you shortly to finalize your order. Please note that
                                your purchase is not complete until a member of our team confirms your order.
                            </p>
                        </section>

                        <section className="p-6 border border-zinc-200 rounded-lg">
                            <h2 className="text-lg font-medium mb-6">Order details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900 mb-2">Contact information</h3>
                                    <p className="text-sm text-zinc-600">{order.recipient?.email || order.user?.email}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900 mb-2">Payment method</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="px-2 py-0.5 border border-zinc-200 rounded bg-zinc-50 flex items-center gap-1">
                                            <span className="text-sm font-bold text-zinc-400">$</span>
                                        </div>
                                        <p className="text-sm text-zinc-600">
                                            Cash on Delivery (COD) · Rs {grandTotal.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900 mb-2">Shipping address</h3>
                                    <div className="text-sm text-zinc-600 space-y-0.5 leading-relaxed font-light">
                                        <p>{order.recipient?.name}</p>
                                        <p>{order.recipient?.street}</p>
                                        {order.recipient?.addressLine2 && <p>{order.recipient.addressLine2}</p>}
                                        <p>{order.recipient?.city}</p>
                                        <p>{order.recipient?.country}</p>
                                        <p>{order.recipient?.phone}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900 mb-2">Billing address</h3>
                                    <div className="text-sm text-zinc-600 space-y-0.5 leading-relaxed font-light">
                                        <p>{order.recipient?.name}</p>
                                        <p>{order.recipient?.street}</p>
                                        {order.recipient?.addressLine2 && <p>{order.recipient.addressLine2}</p>}
                                        <p>{order.recipient?.city}</p>
                                        <p>{order.recipient?.country}</p>
                                        <p>{order.recipient?.phone}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900 mb-2">Shipping method</h3>
                                    <p className="text-sm text-zinc-600">
                                        {shippingFee === 0 ? "Free Shipping" : `Standard Shipping (Rs ${shippingFee})`}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="flex flex-col gap-6 pt-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-zinc-600">Need help?</span>
                                <a href="mailto:support@eshop.com" className="text-zinc-900"><Mail size={18} strokeWidth={1.5} /></a>
                                <a href="https://wa.me/..." className="text-zinc-900">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </a>
                            </div>
                            <Link
                                to="/products"
                                className="inline-block w-fit bg-zinc-900 text-white px-8 py-4 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
                            >
                                Continue shopping
                            </Link>
                        </div>

                        <footer className="pt-10 border-t border-zinc-100 flex flex-wrap gap-x-6 gap-y-2">
                            {['Refund policy', 'Shipping', 'Privacy policy', 'Terms of service', 'Contact'].map(link => (
                                <Link key={link} to="#" className="text-xs text-zinc-500 border-b border-zinc-400 pb-0.5 hover:text-zinc-900 transition-colors">
                                    {link}
                                </Link>
                            ))}
                        </footer>
                    </div>

                    <div className="w-full lg:w-[420px] bg-zinc-50 p-8 lg:p-10 lg:min-h-screen lg:-mt-12 lg:-mb-12 border-l border-zinc-200">
                        <div className="space-y-6">
                            {order.items?.map((item) => (
                                <div key={item.product?._id || item.product} className="flex gap-4">
                                    <div className="relative w-16 h-20 bg-white border border-zinc-200 rounded overflow-hidden flex-shrink-0">
                                        <img
                                            src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${item.product?.image}`}
                                            className="w-full h-full object-cover"
                                            alt={item.product?.name}
                                        />
                                        <span className="absolute -top-2 -right-2 bg-zinc-500 text-white text-sm font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 flex justify-between items-start">
                                        <div className="pr-4">
                                            <p className="text-[13px] font-medium text-zinc-900 uppercase tracking-tight leading-tight">
                                                {item.product?.name || "Product Item"}
                                            </p>
                                            <p className="text-md text-zinc-400 uppercase mt-1">
                                                {typeof item.product?.collection === "string"
                                                    ? item.product.collection
                                                    : item.product?.collection?.name || "Apparel"}{" "}
                                                / {item.size || "Standard"}
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium text-zinc-900 flex-shrink-0">
                                            Rs {(item.quantity * item.price).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-10 border-t border-zinc-200 space-y-3">
                            <div className="flex justify-between text-sm text-zinc-600">
                                <span>Subtotal</span>
                                <span>Rs {itemsSubtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-zinc-600 items-center">
                                <div className="flex items-center gap-1">
                                    <span>Shipping</span>
                                    <div className="w-3.5 h-3.5 rounded-full border border-zinc-400 flex items-center justify-center text-[8px] text-zinc-400">?</div>
                                </div>
                                <span>{shippingFee === 0 ? "FREE" : `Rs ${shippingFee}`}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-lg font-medium">Total</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-md text-zinc-400">PKR</span>
                                    <span className="text-xl font-semibold">Rs {grandTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;

import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    useGetOrderById,
    useGetOrderByTrackingToken,
} from "../api/hooks/orders.api";
import { addGuestOrder, readGuestOrders } from "../utils/guestOrders";
import {
    Loader2,
    PackageSearch,
    Truck,
    Copy,
    ArrowRight,
    Receipt,
    ChevronRight,
    Search,
    CheckCircle2,
} from "lucide-react";

const TrackOrderPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const paramId = searchParams.get("id") || "";

    const [orderId, setOrderId] = useState(paramId);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");
    const { getOrderById, loading: loadingById } = useGetOrderById();
    const { getOrderByTrackingToken, loading: loadingByToken } =
        useGetOrderByTrackingToken();
    const [recentOrders, setRecentOrders] = useState(() => readGuestOrders());
    const [savedOrders, setSavedOrders] = useState([]);
    const [savedLoading, setSavedLoading] = useState(false);

    const activeRequest = useRef(0);

    const lookup = useCallback(
        async (id, updateUrl = false) => {
            const trimmed = (id || "").trim();
            if (!trimmed) return;

            const requestId = ++activeRequest.current;

            // Try by ID first
            let resp = await getOrderById(trimmed).catch(() => null);

            // If not found by ID, try tracking token endpoint
            if (!resp) {
                console.log("fetch by token tracking token");
                resp = await getOrderByTrackingToken(trimmed).catch(() => null);
            } else {
                console.log("fetch by order id");
            }

            if (requestId !== activeRequest.current) return;

            const resolvedOrder = resp?.order || resp;

            if (resolvedOrder && (resolvedOrder._id || resolvedOrder.id)) {
                addGuestOrder(resolvedOrder);
                setRecentOrders(readGuestOrders());
                setOrder(resolvedOrder);
                // Only update URL if this was a manual user action
                if (updateUrl) {
                    setSearchParams({
                        id: resolvedOrder._id || resolvedOrder.id,
                    });
                }
            } else {
                setError("ORDER NOT FOUND.");
            }
        },
        [getOrderById, getOrderByTrackingToken, setSearchParams],
    );

    const loadSavedOrders = useCallback(() => {
        setSavedLoading(true);
        const orders = readGuestOrders();
        setSavedOrders(orders);
        setSavedLoading(false);
    }, []);

    useEffect(() => {
        loadSavedOrders();
        if (!paramId) return;

        const stored = readGuestOrders().find(
            (o) => (o._id || o.id) === paramId,
        );

        if (stored) {
            setOrder(stored);
            setOrderId(paramId);
        } else {
            lookup(paramId, false); // Initial load does NOT update URL
        }
    }, [paramId]);

    const displayId = order?.id || order?._id;

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 lg:px-12 py-16 max-w-7xl">
                <div className="text-center mb-16">
                    <p className="text-sm uppercase tracking-[0.4em] text-zinc-400 mb-4 font-bold">
                        Services & Support
                    </p>
                    <h1 className="text-4xl font-light tracking-[0.1em] text-zinc-900 uppercase">
                        Track <span className="font-semibold">Order</span>
                    </h1>
                    <div className="w-12 h-[1px] bg-zinc-900 mx-auto mt-6"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7 space-y-12">
                        <section>
                            <div className="bg-zinc-50 p-8 rounded-sm border border-zinc-100">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        lookup(orderId, true); // Manual search updates URL
                                    }}
                                >
                                    <div className="relative flex-1">
                                        <Search
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                                            size={16}
                                        />
                                        <input
                                            value={orderId}
                                            onChange={(e) =>
                                                setOrderId(e.target.value)
                                            }
                                            placeholder="ENTER YOUR ORDER ID..."
                                            className="w-full bg-white border border-zinc-200 rounded-none px-12 py-4 text-md uppercase tracking-widest focus:border-zinc-900 outline-none transition-all placeholder:text-zinc-300"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loadingById || loadingByToken}
                                        className="bg-zinc-900 text-white px-10 py-4 text-md font-bold uppercase tracking-[0.2em] hover:bg-zinc-700 transition-colors disabled:opacity-50 min-w-[160px]"
                                    >
                                        {loadingById && loadingByToken ? (
                                            <Loader2
                                                className="animate-spin mx-auto"
                                                size={16}
                                            />
                                        ) : (
                                            "Track"
                                        )}
                                    </button>
                                </form>

                                {error && (
                                    <p className="mt-4 text-sm font-bold text-red-500 tracking-widest uppercase flex items-center gap-2">
                                        <div className="w-1 h-1 bg-red-500 rounded-full" />{" "}
                                        {error}
                                    </p>
                                )}
                            </div>
                        </section>

                        {order && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="border border-zinc-100 rounded-sm">
                                    <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-1">
                                                Current Order Reference
                                            </p>
                                            <p className="text-xs font-medium text-zinc-900 tracking-wider">
                                                {displayId}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                navigator.clipboard.writeText(
                                                    displayId || "",
                                                )
                                            }
                                            className="text-zinc-400 hover:text-zinc-900 transition-colors"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>

                                    <div className="p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                            <div>
                                                <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-3">
                                                    Status
                                                </p>
                                                <div className="flex items-center gap-2 text-zinc-900">
                                                    <CheckCircle2
                                                        size={16}
                                                        className="text-zinc-900"
                                                    />
                                                    <span className="text-xs font-bold uppercase tracking-widest">
                                                        {order.status ||
                                                            "Processing"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-3">
                                                    Amount
                                                </p>
                                                <p className="text-lg font-light text-zinc-900 tracking-tight">
                                                    RS{" "}
                                                    {Number(
                                                        order.grandTotal ||
                                                            order.totalAmount ||
                                                            0,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-3">
                                                    Delivery To
                                                </p>
                                                <p className="text-xs font-medium text-zinc-800 uppercase tracking-wider">
                                                    {order.recipient?.name ||
                                                        "Guest User"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-12">
                                            <Link
                                                to={`/orders/success?id=${displayId}`}
                                                className="inline-flex items-center gap-4 text-sm font-bold uppercase tracking-[0.3em] text-zinc-900 group"
                                            >
                                                View Complete Summary
                                                <ArrowRight
                                                    size={14}
                                                    className="group-hover:translate-x-2 transition-transform duration-500"
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="lg:col-span-5">
                        <div className="sticky top-32 border border-zinc-100 p-8 rounded-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <Receipt size={18} className="text-zinc-900" />
                                <h2 className="text-md font-bold uppercase tracking-[0.25em] text-zinc-900">
                                    Recent Activity
                                </h2>
                            </div>

                            <div className="space-y-1">
                                {savedLoading ? (
                                    <div className="py-12 flex justify-center">
                                        <Loader2 className="animate-spin text-zinc-200" />
                                    </div>
                                ) : savedOrders.length === 0 ? (
                                    <p className="text-sm text-zinc-400 uppercase tracking-widest py-8">
                                        No recent activity on this device.
                                    </p>
                                ) : (
                                    savedOrders.map((o) => (
                                        <button
                                            key={o._id || o.id}
                                            onClick={() => {
                                                setOrder(o);
                                                setOrderId(o._id || o.id);
                                                setSearchParams({
                                                    id: o._id || o.id,
                                                });
                                            }}
                                            className="w-full flex items-center justify-between py-4 border-b border-zinc-50 hover:border-zinc-900 transition-all text-left group"
                                        >
                                            <div>
                                                <p className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-1 group-hover:pl-2 transition-all">
                                                    #{(o._id || o.id).slice(-8)}
                                                </p>
                                                <p className="text-[9px] text-zinc-400 uppercase tracking-tighter">
                                                    {o.status || "Pending"} • RS{" "}
                                                    {Number(
                                                        o.grandTotal ||
                                                            o.totalAmount ||
                                                            0,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            <ChevronRight
                                                size={14}
                                                className="text-zinc-300 group-hover:text-zinc-900 transition-colors"
                                            />
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrderPage;

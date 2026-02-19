import { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    ShoppingBag,
    Save,
    Loader2,
    Truck,
    CreditCard,
    Hash,
} from "lucide-react";
import Input from "../../UI/Input.jsx";
import Select from "../../UI/Select.jsx";
import { useProducts } from "../../features/products/product.queries.js";
import { usePlaceOrder } from "../../api/hooks/orders.api.js";
import { useNavigate } from "react-router-dom";

const AddOrderPage = () => {
    const { data, isPending: productsLoading } = useProducts();
    const { placeOrder, loading: orderLoading } = usePlaceOrder();
    const navigate = useNavigate();

    const [orderData, setOrderData] = useState({
        userId: "",
        items: [
            {
                product: "",
                quantity: 1,
                originalPrice: 0,
                discount: 0,
                price: 0,
                totalAmount: 0,
            },
        ],
        recipient: {
            name: "",
            street: "",
            addressLine2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            phone: "",
        },
        payment: { method: "COD", ispaid: false },
        taxAmount: 0,
        shippingFee: 0,
        grandTotal: 0,
        status: "pending",
    });

    const itemsSubtotal = orderData.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );
    const taxAmount = Number(orderData.taxAmount) || 0;
    const shippingFee = Number(orderData.shippingFee) || 0;
    const grandTotal = itemsSubtotal + taxAmount + shippingFee;

    const addItem = () => {
        setOrderData({
            ...orderData,
            items: [
                ...orderData.items,
                {
                    product: "",
                    quantity: 1,
                    originalPrice: 0,
                    discount: 0,
                    price: 0,
                    totalAmount: 0,
                },
            ],
        });
    };

    const removeItem = (index) => {
        const newItems = orderData.items.filter((_, i) => i !== index);
        setOrderData({ ...orderData, items: newItems });
    };

    const updateItem = (index, field, value) => {
        const newItems = [...orderData.items];
        const item = { ...newItems[index] };

        if (field === "product") {
            const selectedProd = data?.products.find((p) => p._id === value);

            item.product = value;

            const prodPrice = Number(selectedProd?.price || 0);
            const effPrice = Number(
                selectedProd?.effectivePrice ?? selectedProd?.price ?? 0,
            );

            item.originalPrice = prodPrice;

            if (effPrice < prodPrice) {
                item.discount = prodPrice - effPrice;
                item.price = effPrice;
            } else {
                item.discount = 0;
                item.price = prodPrice;
            }
        } else if (field === "discount") {
            const safeDiscount = Math.min(
                Math.max(Number(value) || 0, 0),
                item.originalPrice,
            );

            item.discount = safeDiscount;
            item.price = item.originalPrice - safeDiscount;
        } else if (field === "price") {
            const safePrice = Math.min(
                Math.max(Number(value) || 0, 0),
                item.originalPrice,
            );

            item.price = safePrice;
            item.discount = item.originalPrice - safePrice;
        } else if (field === "quantity") {
            item.quantity = Math.max(1, Number(value) || 1);
        }

        item.totalAmount =
            (Number(item.price) || 0) * (Number(item.quantity) || 0);

        newItems[index] = item;

        setOrderData({
            ...orderData,
            items: newItems,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalItems = orderData.items.map((item) => ({
            ...item,
            totalAmount:
                (Number(item.price) || 0) * (Number(item.quantity) || 0),
        }));
        // Basic client-side validation to match backend expectations
        if (!finalItems || finalItems.length === 0) {
            return alert("Order must contain at least one item");
        }
        for (const it of finalItems) {
            if (!it.product)
                return alert("Each item must have a product selected");
            if (!Number.isFinite(Number(it.price)) || Number(it.price) <= 0)
                return alert("Each item must have a valid positive price");
            if (
                !Number.isInteger(Number(it.quantity)) ||
                Number(it.quantity) <= 0
            )
                return alert("Each item must have a valid quantity");
        }

        const finalData = {
            ...orderData,
            items: finalItems,
            grandTotal,
        };
        const response = await placeOrder(finalData);
        if (response?.success) {
            navigate("/admin-dashboard/orders");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-gray-200">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600 rounded-2xl text-white">
                            <ShoppingBag size={20} />
                        </div>
                        Create Manual Order
                    </h2>
                    <p className="text-sm text-gray-500 ml-11">
                        Add a new order directly to the system
                    </p>
                </div>

                <div className="bg-blue-600 rounded-2xl p-4 min-w-[240px] shadow-sm">
                    <p className="text-xs font-medium text-blue-100 mb-1">
                        Grand Total
                    </p>
                    <p className="text-2xl font-bold text-white">
                        Rs {grandTotal.toLocaleString()}
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Left Column - Order Items */}
                <div className="xl:col-span-8 space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Hash size={16} className="text-blue-600" />
                                Order Items
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {orderData.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-3 gap-4 items-end bg-gray-50 p-4 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors"
                                >
                                    <div className="col-span-3 space-y-1.5">
                                        <label className="text-xs font-medium text-gray-700">
                                            Product
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <Select
                                                    disabled={productsLoading}
                                                    options={data?.products?.map(
                                                        (p) => ({
                                                            label: p.name,
                                                            value: p._id,
                                                        }),
                                                    )}
                                                    value={item.product}
                                                    placeholder="Select product"
                                                    onChange={(val) =>
                                                        updateItem(
                                                            index,
                                                            "product",
                                                            val,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-700">
                                            Original Price
                                        </label>
                                        <div className="w-full bg-gray-100 border border-gray-200 rounded-2xl px-3 py-2 text-sm font-medium text-gray-500">
                                            Rs {item.originalPrice}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-700">
                                            Discount per item
                                        </label>
                                        <Input
                                            type="number"
                                            value={item.discount}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    "discount",
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-700">
                                            Price
                                        </label>
                                        <Input
                                            type="number"
                                            value={item.price}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    "price",
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-700">
                                            Quantity
                                        </label>
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    "quantity",
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-xs font-medium text-gray-700">
                                            Subtotal
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 bg-gray-100 border border-gray-200 rounded-2xl px-3 py-2">
                                            Rs{" "}
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addItem}
                            className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-2xl text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            Add Item
                        </button>
                    </div>
                </div>

                {/* Right Column - Customer & Details */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6">
                        {/* Shipping Address Section */}
                        <section className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-200">
                                <Truck size={16} className="text-blue-600" />
                                Shipping Address
                            </h3>
                            <Input
                                placeholder="Recipient name"
                                value={orderData.recipient.name}
                                required
                                onChange={(e) =>
                                    setOrderData({
                                        ...orderData,
                                        recipient: {
                                            ...orderData.recipient,
                                            name: e.target.value,
                                        },
                                    })
                                }
                                className="w-full"
                            />
                            <Input
                                placeholder="Street address"
                                value={orderData.recipient.street}
                                required
                                onChange={(e) =>
                                    setOrderData({
                                        ...orderData,
                                        recipient: {
                                            ...orderData.recipient,
                                            street: e.target.value,
                                        },
                                    })
                                }
                                className="w-full"
                            />
                            <Input
                                placeholder="Apartment, suite, etc. (optional)"
                                value={orderData.recipient.addressLine2}
                                onChange={(e) =>
                                    setOrderData({
                                        ...orderData,
                                        recipient: {
                                            ...orderData.recipient,
                                            addressLine2: e.target.value,
                                        },
                                    })
                                }
                                className="w-full"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    placeholder="City"
                                    value={orderData.recipient.city}
                                    required
                                    onChange={(e) =>
                                        setOrderData({
                                            ...orderData,
                                            recipient: {
                                                ...orderData.recipient,
                                                city: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full"
                                />
                                <Input
                                    placeholder="Phone"
                                    value={orderData.recipient.phone}
                                    required
                                    onChange={(e) =>
                                        setOrderData({
                                            ...orderData,
                                            recipient: {
                                                ...orderData.recipient,
                                                phone: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    placeholder="State/Province"
                                    value={orderData.recipient.state}
                                    required
                                    onChange={(e) =>
                                        setOrderData({
                                            ...orderData,
                                            recipient: {
                                                ...orderData.recipient,
                                                state: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full"
                                />
                                <Input
                                    placeholder="Postal code"
                                    value={orderData.recipient.postalCode}
                                    onChange={(e) =>
                                        setOrderData({
                                            ...orderData,
                                            recipient: {
                                                ...orderData.recipient,
                                                postalCode: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full"
                                />
                            </div>
                            <Input
                                placeholder="Country"
                                value={orderData.recipient.country}
                                required
                                onChange={(e) =>
                                    setOrderData({
                                        ...orderData,
                                        recipient: {
                                            ...orderData.recipient,
                                            country: e.target.value,
                                        },
                                    })
                                }
                                className="w-full"
                            />
                        </section>

                        {/* Payment Section */}
                        <section className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-200">
                                <CreditCard
                                    size={16}
                                    className="text-blue-600"
                                />
                                Payment
                            </h3>
                            <Select
                                options={[
                                    { label: "Cash on Delivery", value: "COD" },
                                    {
                                        label: "Online Payment",
                                        value: "online",
                                    },
                                ]}
                                value={orderData.payment.method}
                                onChange={(val) =>
                                    setOrderData({
                                        ...orderData,
                                        payment: {
                                            ...orderData.payment,
                                            method: val,
                                        },
                                    })
                                }
                                className="w-full max-w-none"
                            />
                            {orderData.payment.method !== "COD" && (
                                <label className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={orderData.payment.ispaid}
                                        onChange={(e) =>
                                            setOrderData({
                                                ...orderData,
                                                payment: {
                                                    ...orderData.payment,
                                                    ispaid: e.target.checked,
                                                },
                                            })
                                        }
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Payment received
                                    </span>
                                </label>
                            )}
                        </section>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={orderLoading}
                            className="w-full bg-blue-600 text-white rounded-2xl py-3 font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {orderLoading ? (
                                <>
                                    <Loader2
                                        className="animate-spin"
                                        size={18}
                                    />
                                    Creating order...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Create Order
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default AddOrderPage;

import { useState, useEffect } from "react";
import { Plus, Trash2, ShoppingBag, Save, Loader2 } from "lucide-react";
import Input from "../../UI/Input.jsx";
import Button from "../../UI/Button.jsx";
import Select from "../../UI/Select.jsx";
import { useGetAllProducts } from "../../api/hooks/product.api.js";
import { usePlaceOrder } from "../../api/hooks/orders.api.js";
import { useNavigate } from "react-router-dom";

const AddOrder = () => {
    const { getAllProducts, loading: productsLoading } = useGetAllProducts();
    const { placeOrder, loading: orderLoading } = usePlaceOrder();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [orderData, setOrderData] = useState({
        items: [{ product: "", quantity: 1, price: 0, totalAmount: 0 }],
        recipient: { name: "", street: "", city: "", phone: "" },
        payment: { method: "COD", ispaid: false },
        grandTotal: 0,
        status: "pending",
    });

    // Calculate Total Automatically
    const grandTotal = orderData.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    // Add new item row
    const addItem = () => {
        setOrderData({
            ...orderData,
            items: [
                ...orderData.items,
                { product: "", quantity: 1, price: 0, totalAmount: 0 },
            ],
        });
    };

    // Remove item row
    const removeItem = (index) => {
        const newItems = orderData.items.filter((_, i) => i !== index);
        setOrderData({ ...orderData, items: newItems });
    };

    // Update specific item in the array
    const updateItem = (index, field, value) => {
        const newItems = [...orderData.items];
        if (field === "product") {
            const selectedProd = products.find((p) => p._id === value);
            newItems[index].product = value;
            newItems[index].price = selectedProd?.price || 0;
            newItems[index].totalAmount =
                newItems[index].price * newItems[index].quantity;
        } else {
            newItems[index][field] = value;
        }
        setOrderData({ ...orderData, items: newItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalData = { ...orderData, grandTotal };
        if (finalData) {
            const response = await placeOrder(finalData);

            if (response.success) {
                navigate("/admin-dashboard?tab=orders-list");
            }
        }
    };

    useEffect(() => {
        getAllProducts().then((res) => {
            setProducts(res.products);
        });
    }, []);

    return (
        <form onSubmit={handleSubmit} className="px-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center pb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <ShoppingBag className="text-blue-600" /> Create Manual
                    Order
                </h2>
                <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
                        Total Amount
                    </p>
                    <p className="text-2xl font-black text-blue-600">
                        Rs: {grandTotal.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side: Items Selection */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border border-gray-300 p-4 rounded-sm shadow-sm">
                        <h3 className="text-sm font-bold mb-4 text-gray-700">
                            Order Items
                        </h3>
                        {orderData.items.map((item, index) => (
                            <div
                                key={index}
                                className="flex gap-3 mb-3 items-end border-b pb-3 last:border-0"
                            >
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                                        Product
                                    </label>
                                    <Select
                                        disabled={productsLoading}
                                        options={products?.map((p) => ({
                                            label: p.name,
                                            value: p._id,
                                        }))}
                                        value={item.product}
                                        placeholder="Select Product"
                                        onChange={(val) =>
                                            updateItem(index, "product", val)
                                        }
                                    />
                                </div>
                                <div className="w-24">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                                        Unit Price
                                    </label>
                                    <Input
                                        type="number"
                                        className="w-full"
                                        value={item.price}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "price",
                                                parseInt(e.target.value)
                                            )
                                        }
                                    />
                                </div>
                                <div className="w-24">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                                        Qty
                                    </label>
                                    <Input
                                        type="number"
                                        className="w-full"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "quantity",
                                                parseInt(e.target.value)
                                            )
                                        }
                                    />
                                </div>
                                <div className="w-24">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                                        Total Amount
                                    </label>
                                    <div>
                                        {(
                                            item.totalAmount * item.quantity
                                        ).toFixed(2)}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="p-2 text-red-400 hover:bg-red-50 rounded"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addItem}
                            className="w-full mt-2 border-dashed"
                        >
                            <Plus size={16} /> Add Another Product
                        </Button>
                    </div>
                </div>

                {/* Right Side: Shipping & Payment */}
                <div className="space-y-4">
                    {/* Shipping Address Object */}
                    <div className="bg-white border border-gray-300 p-4 rounded-sm shadow-sm space-y-3">
                        <h3 className="text-sm font-bold text-gray-700 border-b pb-2">
                            Shipping Details
                        </h3>
                        <Input
                            placeholder="Recipient Name"
                            value={orderData.recipient.name}
                            onChange={(e) =>
                                setOrderData({
                                    ...orderData,
                                    recipient: {
                                        ...orderData.recipient,
                                        name: e.target.value,
                                    },
                                })
                            }
                            className={"w-full"}
                        />

                        <Input
                            placeholder="Street Address"
                            value={orderData.recipient.street}
                            onChange={(e) =>
                                setOrderData({
                                    ...orderData,
                                    recipient: {
                                        ...orderData.recipient,
                                        street: e.target.value,
                                    },
                                })
                            }
                            className={"w-full"}
                        />
                        <Input
                            placeholder="City"
                            value={orderData.recipient.city}
                            onChange={(e) =>
                                setOrderData({
                                    ...orderData,
                                    recipient: {
                                        ...orderData.recipient,
                                        city: e.target.value,
                                    },
                                })
                            }
                            className={"w-full"}
                        />
                        <Input
                            placeholder="Phone Number"
                            value={orderData.recipient.phone}
                            onChange={(e) =>
                                setOrderData({
                                    ...orderData,
                                    recipient: {
                                        ...orderData.recipient,
                                        phone: e.target.value,
                                    },
                                })
                            }
                            className={"w-full"}
                        />
                    </div>

                    {/* Payment & Status */}
                    <div className="bg-white border border-gray-300 p-4 rounded-sm shadow-sm space-y-3">
                        <h3 className="text-sm font-bold text-gray-700 border-b pb-2">
                            Payment & Status
                        </h3>
                        <Select
                            options={[
                                { label: "COD", value: "COD" },
                                { label: "Online", value: "online" },
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
                        />
                        {orderData.payment.method === "online" && (
                            <div className="flex items-center gap-2 py-2">
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
                                />
                                <label className="text-sm text-gray-600">
                                    Mark as Paid
                                </label>
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={orderLoading}
                        className="w-full py-4"
                    >
                        {orderLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                <Save size={18} /> Create Order
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default AddOrder;

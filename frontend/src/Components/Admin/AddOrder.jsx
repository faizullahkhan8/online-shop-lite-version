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
    User,
    Receipt,
} from "lucide-react";
import Input from "../../UI/Input.jsx";
import Select from "../../UI/Select.jsx";
import { useGetAllProducts } from "../../api/hooks/product.api.js";
import { usePlaceOrder } from "../../api/hooks/orders.api.js";
import { useGetAllUsers } from "../../api/hooks/user.api.js";
import { useNavigate } from "react-router-dom";

const AddOrder = () => {
    const { getAllProducts, loading: productsLoading } = useGetAllProducts();
    const { placeOrder, loading: orderLoading } = usePlaceOrder();
    const { getAllUsers, loading: usersLoading } = useGetAllUsers();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orderData, setOrderData] = useState({
        userId: "",
        items: [{ product: "", quantity: 1, price: 0, totalAmount: 0 }],
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
        shippingMethod: "standard",
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
                { product: "", quantity: 1, price: 0, totalAmount: 0 },
            ],
        });
    };

    const removeItem = (index) => {
        const newItems = orderData.items.filter((_, i) => i !== index);
        setOrderData({ ...orderData, items: newItems });
    };

    const updateItem = (index, field, value) => {
        const newItems = [...orderData.items];
        if (field === "product") {
            const selectedProd = products.find((p) => p._id === value);
            newItems[index].product = value;
            newItems[index].price = selectedProd?.price || 0;
        } else {
            newItems[index][field] = value;
        }
        newItems[index].totalAmount =
            (Number(newItems[index].price) || 0) *
            (Number(newItems[index].quantity) || 0);
        setOrderData({ ...orderData, items: newItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalItems = orderData.items.map((item) => ({
            ...item,
            totalAmount:
                (Number(item.price) || 0) * (Number(item.quantity) || 0),
        }));
        const finalData = {
            ...orderData,
            items: finalItems,
            grandTotal,
        };
        const response = await placeOrder(finalData);
        if (response.success) {
            navigate("/admin-dashboard?tab=orders-list");
        }
    };

    useEffect(() => {
        getAllProducts().then((res) => {
            setProducts(res.products);
        });
        getAllUsers().then((res) => {
            setUsers(res.users || []);
        });
    }, []);

    const handleUserSelect = (value) => {
        const selectedUser = users.find((u) => u._id === value);
        setOrderData((prev) => ({
            ...prev,
            userId: value,
            recipient: {
                ...prev.recipient,
                name: selectedUser?.name || prev.recipient.name,
                phone: selectedUser?.phone || prev.recipient.phone,
                street:
                    selectedUser?.addresses?.[0]?.street ||
                    prev.recipient.street,
                addressLine2:
                    selectedUser?.addresses?.[0]?.addressLine2 ||
                    prev.recipient.addressLine2,
                city:
                    selectedUser?.addresses?.[0]?.city || prev.recipient.city,
                state:
                    selectedUser?.addresses?.[0]?.state || prev.recipient.state,
                postalCode:
                    selectedUser?.addresses?.[0]?.postalCode ||
                    prev.recipient.postalCode,
                country:
                    selectedUser?.addresses?.[0]?.country ||
                    prev.recipient.country,
            },
        }));
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500"
        >
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4">
                        <div className="p-3 bg-primary rounded-2xl text-white shadow-xl shadow-primary/20">
                            <ShoppingBag size={28} />
                        </div>
                        Manual{" "}
                        <span className="text-primary text-outline-1">
                            Provisioning
                        </span>
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">
                        System-Level Order Override
                    </p>
                </div>

                <div className="bg-slate-900 rounded-[2rem] p-6 text-right min-w-[280px] shadow-2xl shadow-slate-900/20 border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                        Aggregate Liability
                    </p>
                    <p className="text-3xl font-black text-white tracking-tighter">
                        <span className="text-primary mr-2">PKR</span>
                        {grandTotal.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                        })}
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                <div className="xl:col-span-8 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Hash size={14} className="text-primary" />{" "}
                                Manifest Items
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {orderData.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="group grid grid-cols-12 gap-4 items-end bg-slate-50/50 p-6 rounded-3xl transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100 border border-transparent hover:border-slate-100"
                                >
                                    <div className="col-span-12 lg:col-span-5 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Item Select
                                        </label>
                                        <Select
                                            disabled={productsLoading}
                                            options={products?.map((p) => ({
                                                label: p.name,
                                                value: p._id,
                                            }))}
                                            value={item.product}
                                            placeholder="Choose Inventory Node"
                                            onChange={(val) =>
                                                updateItem(
                                                    index,
                                                    "product",
                                                    val,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="col-span-4 lg:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Unit Price
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
                                    <div className="col-span-4 lg:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
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
                                    <div className="col-span-3 lg:col-span-2 pb-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                            Subtotal
                                        </p>
                                        <p className="font-black text-slate-900 text-sm">
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="col-span-1 lg:col-span-1 pb-2 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="p-3 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all"
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
                            className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 group"
                        >
                            <Plus
                                size={16}
                                className="group-hover:rotate-90 transition-transform"
                            />
                            Append Data Row
                        </button>
                    </div>
                </div>

                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
                        <section className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-50 pb-4">
                                <User size={14} className="text-primary" />{" "}
                                Customer Assignment
                            </h3>
                            <Select
                                disabled={usersLoading}
                                options={users?.map((u) => ({
                                    label: `${u.name} • ${u.email}`,
                                    value: u._id,
                                }))}
                                value={orderData.userId}
                                placeholder="Select Customer"
                                onChange={handleUserSelect}
                                className="w-full max-w-none"
                            />
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-50 pb-4">
                                <Truck size={14} className="text-primary" />{" "}
                                Delivery Logistics
                            </h3>
                            <Input
                                placeholder="Recipient Designation"
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
                                className="w-full"
                            />
                            <Input
                                placeholder="Sector/Street Address"
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
                                className="w-full"
                            />
                            <Input
                                placeholder="Apartment / Suite / Landmark"
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
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    placeholder="City Node"
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
                                    className="w-full"
                                />
                                <Input
                                    placeholder="Comms Link"
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
                                    className="w-full"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    placeholder="State / Province"
                                    value={orderData.recipient.state}
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
                                    placeholder="Postal Code"
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

                        <section className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-50 pb-4">
                                <CreditCard
                                    size={14}
                                    className="text-primary"
                                />{" "}
                                Transaction Protocol
                            </h3>
                            <Select
                                options={[
                                    { label: "Cash on Delivery", value: "COD" },
                                    {
                                        label: "Online Clearance",
                                        value: "online",
                                    },
                                    { label: "Card Payment", value: "card" },
                                    { label: "Bank Transfer", value: "bank" },
                                    { label: "Wallet", value: "wallet" },
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
                                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer group">
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
                                        className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary/20 transition-all"
                                    />
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                        Verify Payment Fulfillment
                                    </span>
                                </label>
                            )}
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-50 pb-4">
                                <Receipt size={14} className="text-primary" />{" "}
                                Charges & Routing
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    type="number"
                                    placeholder="Tax Amount"
                                    value={orderData.taxAmount}
                                    onChange={(e) =>
                                        setOrderData({
                                            ...orderData,
                                            taxAmount: Number(e.target.value),
                                        })
                                    }
                                    className="w-full"
                                />
                                <Input
                                    type="number"
                                    placeholder="Shipping Fee"
                                    value={orderData.shippingFee}
                                    onChange={(e) =>
                                        setOrderData({
                                            ...orderData,
                                            shippingFee: Number(
                                                e.target.value,
                                            ),
                                        })
                                    }
                                    className="w-full"
                                />
                            </div>
                            <Select
                                options={[
                                    {
                                        label: "Standard Ground",
                                        value: "standard",
                                    },
                                    { label: "Express Air", value: "express" },
                                    { label: "In-Store Pickup", value: "pickup" },
                                ]}
                                value={orderData.shippingMethod}
                                onChange={(val) =>
                                    setOrderData({
                                        ...orderData,
                                        shippingMethod: val,
                                    })
                                }
                                className="w-full max-w-none"
                            />
                            <div className="bg-slate-50 rounded-2xl p-4">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Items Subtotal</span>
                                    <span>
                                        PKR{" "}
                                        {itemsSubtotal.toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 2,
                                            },
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                                    <span>Tax</span>
                                    <span>
                                        PKR{" "}
                                        {taxAmount.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                                    <span>Shipping</span>
                                    <span>
                                        PKR{" "}
                                        {shippingFee.toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 2,
                                            },
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-900 mt-4">
                                    <span>Grand Total</span>
                                    <span>
                                        PKR{" "}
                                        {grandTotal.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={orderLoading}
                            className="group w-full bg-slate-900 text-white rounded-3xl py-6 font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-2xl shadow-slate-900/20 active:scale-[0.98] disabled:opacity-50"
                        >
                            {orderLoading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    <Save
                                        size={18}
                                        className="group-hover:scale-110 transition-transform"
                                    />
                                    Authorize Order
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default AddOrder;

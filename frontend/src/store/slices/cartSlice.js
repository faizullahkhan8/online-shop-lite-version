import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalAmount: 0,
    selectedTotalAmount: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const priceToUse =
                newItem.effectivePrice !== undefined
                    ? newItem.effectivePrice
                    : newItem.price;
            const quantityToAdd = Math.max(1, Number(newItem.quantity) || 1);
            const existingItem = state.items.find(
                (item) => item._id === newItem._id,
            );
            const originalPrice = Number(newItem.price) || 0;
            const unitPrice = Number(priceToUse) || 0;
            const promotion = newItem.promotion || null;
            const discountPerUnit = Math.max(0, originalPrice - unitPrice);
            if (!existingItem) {
                const initialQuantity = Math.min(
                    quantityToAdd,
                    Math.max(0, Number(newItem.stock) || quantityToAdd),
                );
                state.items.push({
                    _id: newItem._id,
                    name: newItem.name,
                    price: unitPrice,
                    originalPrice,
                    promotion,
                    discountPerUnit,
                    stock: newItem.stock,
                    image: newItem.image,
                    quantity: initialQuantity,
                    totalPrice: unitPrice * initialQuantity,
                    discountTotal: discountPerUnit * initialQuantity,
                    selected: true, // New items are selected by default
                });
            } else {
                const newQuantity = Math.min(
                    existingItem.quantity + quantityToAdd,
                    Math.max(0, Number(existingItem.stock) || Infinity),
                );
                existingItem.quantity = newQuantity;
                existingItem.totalPrice = existingItem.price * newQuantity;
                existingItem.discountTotal =
                    (existingItem.discountPerUnit || 0) * newQuantity;
            }
            state.totalAmount = state.items.reduce(
                (total, item) => total + item.totalPrice,
                0,
            );
            state.selectedTotalAmount = state.items.reduce(
                (total, item) => total + (item.selected ? item.totalPrice : 0),
                0,
            );
        },
        removeFromCart: (state, action) => {
            const { _id } = action.payload;
            const existingItem = state.items.find((item) => item._id === _id);
            if (existingItem) {
                state.items = state.items.filter((item) => item._id !== _id);
                state.totalAmount = state.items.reduce(
                    (total, item) => total + item.totalPrice,
                    0,
                );
                state.selectedTotalAmount = state.items.reduce(
                    (total, item) =>
                        total + (item.selected ? item.totalPrice : 0),
                    0,
                );
            }
        },
        updateQuantity: (state, action) => {
            const { _id, quantity } = action.payload;
            const existingItem = state.items.find((item) => item._id === _id);
            const nextQuantity = Math.max(1, Number(quantity) || 1);
            if (existingItem) {
                existingItem.quantity = Math.min(
                    nextQuantity,
                    Math.max(0, Number(existingItem.stock) || Infinity),
                );
                existingItem.totalPrice =
                    existingItem.price * existingItem.quantity;
                existingItem.discountTotal =
                    (existingItem.discountPerUnit || 0) *
                    existingItem.quantity;
                state.totalAmount = state.items.reduce(
                    (total, item) => total + item.totalPrice,
                    0,
                );
                state.selectedTotalAmount = state.items.reduce(
                    (total, item) =>
                        total + (item.selected ? item.totalPrice : 0),
                    0,
                );
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
            state.selectedTotalAmount = 0;
        },
        toggleItemSelection: (state, action) => {
            const { _id } = action.payload;
            const item = state.items.find((item) => item._id === _id);
            if (item) {
                item.selected = !item.selected;
                state.selectedTotalAmount = state.items.reduce(
                    (total, item) =>
                        total + (item.selected ? item.totalPrice : 0),
                    0,
                );
            }
        },
        toggleAllSelection: (state, action) => {
            const { selected } = action.payload;
            state.items.forEach((item) => {
                item.selected = selected;
            });
            state.selectedTotalAmount = selected ? state.totalAmount : 0;
        },
        removeSelectedItems: (state, action) => {
            const { productIds } = action.payload;
            state.items = state.items.filter(
                (item) => !productIds.includes(item._id),
            );
            state.totalAmount = state.items.reduce(
                (total, item) => total + item.totalPrice,
                0,
            );
            state.selectedTotalAmount = state.items.reduce(
                (total, item) => total + (item.selected ? item.totalPrice : 0),
                0,
            );
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleItemSelection,
    toggleAllSelection,
    removeSelectedItems,
} = cartSlice.actions;
export default cartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalAmount: 0,
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
            const existingItem = state.items.find(
                (item) => item._id === newItem._id,
            );
            if (!existingItem) {
                state.items.push({
                    _id: newItem._id,
                    name: newItem.name,
                    price: priceToUse,
                    originalPrice: newItem.price,
                    image: newItem.image,
                    quantity: 1,
                    totalPrice: priceToUse,
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice = existingItem.price * existingItem.quantity;
            }
            state.totalAmount = state.items.reduce(
                (total, item) => total + item.totalPrice,
                0,
            );
        },
        removeFromCart: (state, action) => {
            const { _id } = action.payload;
            const existingItem = state.items.find((item) => item._id === _id);
            if (existingItem) {
                state.items = state.items.filter((item) => item._id !== _id);
                state.totalAmount -= existingItem.totalPrice;
            }
        },
        updateQuantity: (state, action) => {
            const { _id, quantity } = action.payload;
            const existingItem = state.items.find((item) => item._id === _id);
            if (existingItem && quantity > 0) {
                existingItem.quantity = quantity;
                existingItem.totalPrice = existingItem.price * quantity;
                state.totalAmount = state.items.reduce(
                    (total, item) => total + item.totalPrice,
                    0
                );
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
    cartSlice.actions;
export default cartSlice.reducer;

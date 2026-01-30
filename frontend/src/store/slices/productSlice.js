import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    selectedProduct: null,
    categories: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    },
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            // Check if payload has pagination structure
            if (action.payload.data) {
                state.products = action.payload.data;
                state.pagination = {
                    currentPage: action.payload.page,
                    totalPages: action.payload.totalPages,
                    totalItems: action.payload.total
                };
            } else {
                // Fallback for simple array (if needed)
                state.products = action.payload;
            }
        },
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        }
    }
});

export const {    } = productSlice.actions;
export default productSlice.reducer;

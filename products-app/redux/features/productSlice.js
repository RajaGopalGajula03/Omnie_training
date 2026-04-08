import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
    "products/fetchProducts", async ({ search, page, limit, sortBy, order, category }) => {
        const skip = page * limit;

        let baseUrl = "https://dummyjson.com/products";

        if (search) {
            baseUrl = `https://dummyjson.com/products/search?q=${search}`;
        } else if (category) {
            baseUrl = `https://dummyjson.com/products/category/${category}`;
        }

        const separator = baseUrl.includes("?") ? "&" : "?";

        let url = `${baseUrl}${separator}limit=${limit}&skip=${skip}`;

        if (sortBy && order) {
            url += `&sortBy=${sortBy}&order=${order}`;
        }

        const res = await fetch(url);
        return res.json();
    }
);


export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (id) => {
        await fetch(`https://dummyjson.com/products/${id}`, {
            method: "DELETE",
        });
        return id;
    }
);

const productSlice = createSlice({
    name:'products',
    initialState:{
        items:[],
        total:0,
        loading:false,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchProducts.pending,(state)=>{
            state.loading = true;
        })
        .addCase(fetchProducts.fulfilled,(state,action)=>{
            state.loading = false;
            state.items = action.payload.products;
            state.total = action.payload.total;
        })
        .addCase(fetchProducts.rejected,(state)=>{
            state.loading = false;
        })
        .addCase(deleteProduct.fulfilled,(state,action)=>{
            state.items = state.items.filter(
                (p)=> p.id !== action.payload
            )
        })
    }
})

export default productSlice.reducer;
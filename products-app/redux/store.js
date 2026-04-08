
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from  "./counterSlice";
import todoReducer from "./todoSlice";
import productReducer from './features/productSlice';

export const store = configureStore({
    reducer:{
        counter: counterReducer,
        todo:todoReducer,
        products: productReducer,
    }
});
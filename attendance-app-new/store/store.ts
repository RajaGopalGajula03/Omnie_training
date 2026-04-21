import {configureStore} from "@reduxjs/toolkit";
import employeeReducer from "./employeeSlice";
import leaveReducer from "./leaveSlice"

export const store = configureStore({
    reducer:{
        employee:employeeReducer,
        leave:leaveReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
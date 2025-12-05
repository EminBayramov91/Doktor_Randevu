import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { baseApi } from "@/store/api/baseApi";
import "@/store/api/authApi";
import "@/store/api/simplybookApi";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});

export const rootDispatch = store.dispatch;

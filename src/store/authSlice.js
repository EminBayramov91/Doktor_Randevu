import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    refreshToken: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken || null;
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
        },
    },
});

export const { loginSuccess, logOut } = authSlice.actions;
export default authSlice.reducer;

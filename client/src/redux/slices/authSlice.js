import { createSlice } from "@reduxjs/toolkit";

import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
} from "../thunks/authThunk";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(
                registerUser.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.user = action.payload.data;
                    state.isAuthenticated = true;
                }
            )

            .addCase(
                registerUser.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(
                loginUser.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.user = action.payload.data;
                    state.isAuthenticated = true;
                }
            )

            .addCase(
                loginUser.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )

            .addCase(
                getCurrentUser.pending,
                (state) => {
                    state.loading = true;
                }
            )

            .addCase(
                getCurrentUser.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.user = action.payload.data;
                    state.isAuthenticated = true;
                }
            )

            .addCase(
                getCurrentUser.rejected,
                (state) => {
                    state.loading = false;
                    state.user = null;
                    state.isAuthenticated = false;
                }
            )

            .addCase(
                logoutUser.fulfilled,
                (state) => {
                    state.user = null;
                    state.isAuthenticated = false;
                    state.error = null;
                }
            );
    },
});

export default authSlice.reducer;
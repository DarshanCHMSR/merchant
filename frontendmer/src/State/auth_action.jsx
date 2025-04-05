import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user:null,
        token:'',
    },
    reducers: {
        setAuth: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },

        clearAuth: (state) => {
            state.user = null;
            state.token = '';
        },
    },
});

export const {setAuth,clearAuth} = authSlice.actions;

export default authSlice.reducer;

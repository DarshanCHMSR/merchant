import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../Components/backend_link/data";

// Async thunk for fetching search results
export const fetchSearchResults = createAsyncThunk(
    'search/fetchSearchResults',
    async (keyword) => {
        const response = await axios.get(`${url}/api/v2/products/search/${keyword}`);
        return response.data;
    }
);

// Async thunk for fetching autocomplete suggestions
export const fetchAutocompleteSuggestions = createAsyncThunk(
    'search/fetchAutocompleteSuggestions',
    async (keyword) => {
        const response = await axios.get(`${url}/api/v2/products/suggest-product/${keyword}`);
        return response.data;
    }
);

const searchSlice = createSlice({
    name: "search",
    initialState: {
        keyword: '',
        results: [],
        suggestions: [],  // For storing autocomplete suggestions
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        setKeyword: (state, action) => {
            state.keyword = action.payload;
        },
        clearSuggestions: (state) => {
            state.suggestions = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchResults.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.results = action.payload;
            })
            .addCase(fetchSearchResults.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchAutocompleteSuggestions.fulfilled, (state, action) => {
                state.suggestions = action.payload;
            })
            .addCase(fetchAutocompleteSuggestions.rejected, (state, action) => {
                state.suggestions = [];
                state.error = action.error.message;
            });
    },
});

export const { setKeyword, clearSuggestions } = searchSlice.actions;
export default searchSlice.reducer;

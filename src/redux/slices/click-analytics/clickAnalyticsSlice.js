import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const getAllClickAnalytics = createAsyncThunk(
    "clickAnalytics/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/click-analytics");
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    },
);

const clickAnalyticsSlice = createSlice({
    name: "clickAnalytics",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllClickAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllClickAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
            })
            .addCase(getAllClickAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default clickAnalyticsSlice.reducer;

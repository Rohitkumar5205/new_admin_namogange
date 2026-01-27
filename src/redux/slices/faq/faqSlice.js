import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

// CREATE
export const createFaq = createAsyncThunk(
    "faq/create",
    async (faqData, { dispatch, rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) return rejectWithValue("No token provided");
        try {
            const res = await api.post("/faq/create", faqData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            dispatch(
                createActivityLogThunk({
                    user_id: faqData.user_id,
                    message: "FAQ created",
                    link: `${import.meta.env.VITE_API_FRONT_URL}/faq`,
                    section: "FAQ",
                })
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// GET ALL
export const getAllFaqs = createAsyncThunk(
    "faq/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/faq");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// GET BY ID
export const getFaqById = createAsyncThunk(
    "faq/getById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/faq/${id}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// UPDATE
export const updateFaq = createAsyncThunk(
    "faq/update",
    async ({ id, data }, { dispatch, rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) return rejectWithValue("No token provided");
        try {
            const res = await api.put(`/faq/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            dispatch(
                createActivityLogThunk({
                    user_id: data.user_id,
                    message: "FAQ updated",
                    link: `${import.meta.env.VITE_API_FRONT_URL}/faq`,
                    section: "FAQ",
                })
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// DELETE
export const deleteFaq = createAsyncThunk(
    "faq/delete",
    async ({ id, user_id }, { dispatch, rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) return rejectWithValue("No token provided");
        try {
            await api.delete(`/faq/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            dispatch(
                createActivityLogThunk({
                    user_id,
                    message: "FAQ deleted",
                    link: `${import.meta.env.VITE_API_FRONT_URL}/faq`,
                    section: "FAQ",
                })
            );
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// TOGGLE STATUS
export const toggleFaqStatus = createAsyncThunk(
    "faq/toggleStatus",
    async ({ id, user_id }, { dispatch, rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) return rejectWithValue("No token provided");
        try {
            const res = await api.put(`/faq/status/${id}`, { user_id }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            dispatch(
                createActivityLogThunk({
                    user_id,
                    message: `FAQ status toggled`,
                    link: `${import.meta.env.VITE_API_FRONT_URL}/faq`,
                    section: "FAQ",
                })
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const faqSlice = createSlice({
    name: "faq",
    initialState: {
        faqs: [],
        singleFaq: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        const thunks = [createFaq, getAllFaqs, getFaqById, updateFaq, deleteFaq, toggleFaqStatus];
        thunks.forEach(thunk => {
            builder
                .addCase(thunk.pending, (state) => {
                    state.loading = true;
                })
                .addCase(thunk.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                });
        });

        builder
            .addCase(createFaq.fulfilled, (state, action) => {
                state.loading = false;
                state.faqs.unshift(action.payload);
            })
            .addCase(getAllFaqs.fulfilled, (state, action) => {
                state.loading = false;
                state.faqs = action.payload;
            })
            .addCase(getFaqById.fulfilled, (state, action) => {
                state.loading = false;
                state.singleFaq = action.payload;
            })
            .addCase(updateFaq.fulfilled, (state, action) => {
                state.loading = false;
                state.faqs = state.faqs.map((faq) =>
                    faq._id === action.payload._id ? action.payload : faq
                );
            })
            .addCase(deleteFaq.fulfilled, (state, action) => {
                state.loading = false;
                state.faqs = state.faqs.filter((faq) => faq._id !== action.payload);
            })
            .addCase(toggleFaqStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.faqs = state.faqs.map((faq) =>
                    faq._id === action.payload._id ? action.payload : faq
                );
            });
    },
});

export default faqSlice.reducer;

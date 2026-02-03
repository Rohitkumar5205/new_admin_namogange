import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ===============================
   CREATE SIDEBAR ITEM
================================ */
export const createSidebar = createAsyncThunk(
    "sidebar/create",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.post("/sidebar/create", data);
            dispatch(
                createActivityLogThunk({
                    user_id: data.created_by,
                    message: `Sidebar item created: ${data.label}`,
                    link: `${import.meta.env.VITE_API_FRONT_URL}/add-sidebar`,
                    section: "Sidebar",
                })
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===============================
   GET ALL SIDEBAR ITEMS
================================ */
export const getAllSidebars = createAsyncThunk(
    "sidebar/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/sidebar");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===============================
   UPDATE SIDEBAR ITEM
================================ */
export const updateSidebar = createAsyncThunk(
    "sidebar/update",
    async ({ id, data }, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.put(`/sidebar/${id}`, data);
            dispatch(
                createActivityLogThunk({
                    user_id: data.updated_by,
                    message: `Sidebar item updated: ${data.label}`,
                    link: `${import.meta.env.VITE_API_FRONT_URL}/add-sidebar`,
                    section: "Sidebar",
                })
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===============================
   DELETE SIDEBAR ITEM
================================ */
export const deleteSidebar = createAsyncThunk(
    "sidebar/delete",
    async ({ id, user_id }, { dispatch, rejectWithValue }) => {
        try {
            await api.delete(`/sidebar/${id}`);
            dispatch(
                createActivityLogThunk({
                    user_id,
                    message: "Sidebar item deleted",
                    link: `${import.meta.env.VITE_API_FRONT_URL}/add-sidebar`,
                    section: "Sidebar",
                })
            );
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const addSidebarSlice = createSlice({
    name: "sidebar",
    initialState: {
        sidebars: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createSidebar.pending, (state) => {
                state.loading = true;
            })
            .addCase(createSidebar.fulfilled, (state, action) => {
                state.loading = false;
                state.sidebars.unshift(action.payload);
            })
            .addCase(createSidebar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllSidebars.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllSidebars.fulfilled, (state, action) => {
                state.loading = false;
                state.sidebars = action.payload;
            })
            .addCase(getAllSidebars.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateSidebar.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateSidebar.fulfilled, (state, action) => {
                state.loading = false;
                state.sidebars = state.sidebars.map((item) =>
                    item._id === action.payload._id ? action.payload : item
                );
            })
            .addCase(updateSidebar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteSidebar.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteSidebar.fulfilled, (state, action) => {
                state.loading = false;
                state.sidebars = state.sidebars.filter(
                    (item) => item._id !== action.payload
                );
            })
            .addCase(deleteSidebar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default addSidebarSlice.reducer;

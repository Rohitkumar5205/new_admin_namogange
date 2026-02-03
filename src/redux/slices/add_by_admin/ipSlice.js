import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";


/* ===============================
   CREATE IP
================================ */
export const createIP = createAsyncThunk(
    "ip/create",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.post("/ip/create", data);

            // 🔹 Activity Log
            dispatch(
                createActivityLogThunk({
                    user_id: data.created_by,
                    message: `IP created: ${data.ip_name} (${data.ip_address})`,
                    link: `${import.meta.env.VITE_API_FRONT_URL}/ip`,
                    section: "IP",
                })
            );

            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===============================
   GET ALL IPs
================================ */
export const getAllIPs = createAsyncThunk(
    "ip/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/ip");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===============================
   UPDATE IP
================================ */
export const updateIP = createAsyncThunk(
    "ip/update",
    async ({ id, data }, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.put(`/ip/${id}`, data);

            // 🔹 Activity Log
            dispatch(
                createActivityLogThunk({
                    user_id: data.updated_by,
                    message: `IP updated: ${data.ip_name} (${data.ip_address})`,
                    link: `${import.meta.env.VITE_API_FRONT_URL}/ip`,
                    section: "IP",
                })
            );

            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===============================
   DELETE IP
================================ */
export const deleteIP = createAsyncThunk(
    "ip/delete",
    async ({ id, user_id }, { dispatch, rejectWithValue }) => {
        try {
            await api.delete(`/ip/${id}`);

            // 🔹 Activity Log
            dispatch(
                createActivityLogThunk({
                    user_id,
                    message: "IP deleted",
                    link: `${import.meta.env.VITE_API_FRONT_URL}/ip`,
                    section: "IP",
                })
            );

            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===============================
   SLICE
================================ */
const ipSlice = createSlice({
    name: "ip",
    initialState: {
        ips: [],
        loading: false,
        error: null,
    },
    reducers: {
        /*************  ✨ Windsurf Command ⭐  *************/
        /**
         * Clears the error state of the IP slice.
         * @param {object} state The state of the IP slice.
         */
        /*******  a938cf50-7a46-4dc1-bb0f-67f2b697cdb0  *******/
        clearIPError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            /* CREATE */
            .addCase(createIP.pending, (state) => {
                state.loading = true;
            })
            .addCase(createIP.fulfilled, (state, action) => {
                state.loading = false;
                state.ips.unshift(action.payload);
            })
            .addCase(createIP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* GET ALL */
            .addCase(getAllIPs.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllIPs.fulfilled, (state, action) => {
                state.loading = false;
                state.ips = action.payload;
            })
            .addCase(getAllIPs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* UPDATE */
            .addCase(updateIP.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateIP.fulfilled, (state, action) => {
                state.loading = false;
                state.ips = state.ips.map((item) =>
                    item._id === action.payload._id ? action.payload : item
                );
            })
            .addCase(updateIP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* DELETE */
            .addCase(deleteIP.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteIP.fulfilled, (state, action) => {
                state.loading = false;
                state.ips = state.ips.filter((item) => item._id !== action.payload);
            })
            .addCase(deleteIP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearIPError } = ipSlice.actions;
export default ipSlice.reducer;

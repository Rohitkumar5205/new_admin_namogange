import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ===============================
   CREATE ROLE
================================ */
export const createRole = createAsyncThunk(
    "role/create",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.post("/role/create", data);

            // 🔹 Activity Log
            dispatch(
                createActivityLogThunk({
                    user_id: data.user_id,
                    message: `Role created: ${data.role_name} (${data.role})`,
                    link: `${import.meta.env.VITE_API_FRONT_URL}/roles`,
                    section: "Role",
                })
            );

            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===============================
   GET ALL ROLES
================================ */
export const getAllRoles = createAsyncThunk(
    "role/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/role");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===============================
   UPDATE ROLE
================================ */
export const updateRole = createAsyncThunk(
    "role/update",
    async ({ id, data }, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.put(`/role/${id}`, data);

            // 🔹 Activity Log
            dispatch(
                createActivityLogThunk({
                    user_id: data.user_id,
                    message: `Role updated: ${data.role_name} (${data.role})`,
                    link: `${import.meta.env.VITE_API_FRONT_URL}/roles`,
                    section: "Role",
                })
            );

            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===============================
   DELETE ROLE
================================ */
export const deleteRole = createAsyncThunk(
    "role/delete",
    async ({ id, user_id }, { dispatch, rejectWithValue }) => {
        try {
            await api.delete(`/role/${id}`);

            // 🔹 Activity Log
            dispatch(
                createActivityLogThunk({
                    user_id,
                    message: "Role deleted",
                    link: `${import.meta.env.VITE_API_FRONT_URL}/roles`,
                    section: "Role",
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
const roleSlice = createSlice({
    name: "role",
    initialState: {
        roles: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearRoleError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            /* CREATE */
            .addCase(createRole.pending, (state) => {
                state.loading = true;
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.loading = false;
                state.roles.unshift(action.payload);
            })
            .addCase(createRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* GET ALL */
            .addCase(getAllRoles.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload;
            })
            .addCase(getAllRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* UPDATE */
            .addCase(updateRole.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = state.roles.map((item) =>
                    item._id === action.payload._id ? action.payload : item
                );
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* DELETE */
            .addCase(deleteRole.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = state.roles.filter((item) => item._id !== action.payload);
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearRoleError } = roleSlice.actions;
export default roleSlice.reducer;

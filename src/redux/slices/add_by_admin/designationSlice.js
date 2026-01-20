import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ===============================
   CREATE DESIGNATION
================================ */
export const createDesignation = createAsyncThunk(
  "designations/create",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/designations", data);

      // 🔹 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id: data.created_by,
          message: "Designation created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/designations`,
          section: "Designation",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   GET ALL DESIGNATIONS
================================ */
export const getAllDesignations = createAsyncThunk(
  "designations/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/designations");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   UPDATE DESIGNATION
================================ */
export const updateDesignation = createAsyncThunk(
  "designation/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/designations/${id}`, data);

      // 🔹 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id: data.updated_by,
          message: "Designation updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/designations`,
          section: "Designation",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   DELETE DESIGNATION
================================ */
export const deleteDesignation = createAsyncThunk(
  "designation/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/designations/${id}`);

      // 🔹 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Designation deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/designations`,
          section: "Designation",
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
const designationSlice = createSlice({
  name: "designation",
  initialState: {
    designations: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearDesignationError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createDesignation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDesignation.fulfilled, (state, action) => {
        state.loading = false;
        state.designations.unshift(action.payload);
      })
      .addCase(createDesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllDesignations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDesignations.fulfilled, (state, action) => {
        state.loading = false;
        state.designations = action.payload;
      })
      .addCase(getAllDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateDesignation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDesignation.fulfilled, (state, action) => {
        state.loading = false;
        state.designations = state.designations.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateDesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteDesignation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.loading = false;
        state.designations = state.designations.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteDesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDesignationError } = designationSlice.actions;
export default designationSlice.reducer;

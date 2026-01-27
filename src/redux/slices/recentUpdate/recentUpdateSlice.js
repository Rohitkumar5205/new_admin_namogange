import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE RECENT UPDATE
============================== */
export const createRecentUpdate = createAsyncThunk(
  "recentUpdate/create",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await api.post("/recent-updates", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔥 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id: payload.get("user_id"),
          message: "Recent Update created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/recent-updates`,
          section: "Recent Update",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   GET ALL RECENT UPDATES
============================== */
export const getAllRecentUpdates = createAsyncThunk(
  "recentUpdate/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/recent-updates");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   UPDATE RECENT UPDATE
============================== */
export const updateRecentUpdate = createAsyncThunk(
  "recentUpdate/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await api.put(`/recent-updates/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔥 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id: data.get("user_id"),
          message: "Recent Update updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/recent-updates`,
          section: "Recent Update",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   DELETE RECENT UPDATE
============================== */
export const deleteRecentUpdate = createAsyncThunk(
  "recentUpdate/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await api.delete(`/recent-updates/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔥 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Recent Update deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/recent-updates`,
          section: "Recent Update",
        })
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   SLICE
============================== */
const recentUpdateSlice = createSlice({
  name: "recentUpdate",
  initialState: {
    recentUpdates: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetRecentUpdateError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createRecentUpdate.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRecentUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.recentUpdates.unshift(action.payload);
      })
      .addCase(createRecentUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllRecentUpdates.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRecentUpdates.fulfilled, (state, action) => {
        state.loading = false;
        state.recentUpdates = action.payload;
      })
      .addCase(getAllRecentUpdates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateRecentUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.recentUpdates = state.recentUpdates.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })

      /* DELETE */
      .addCase(deleteRecentUpdate.fulfilled, (state, action) => {
        state.recentUpdates = state.recentUpdates.filter((item) => item._id !== action.payload);
      });
  },
});

export const { resetRecentUpdateError } = recentUpdateSlice.actions;
export default recentUpdateSlice.reducer;

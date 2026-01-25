import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE PUBLISHED
============================== */
export const createPublished = createAsyncThunk(
  "published/create",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token provided");

      const res = await api.post("/published", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(
        createActivityLogThunk({
          user_id: payload.user_id,
          message: "Published created",
          section: "Published",
          link: `${import.meta.env.VITE_API_FRONT_URL}/published`,
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   GET ALL PUBLISHED
============================== */
export const getAllPublished = createAsyncThunk(
  "published/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/published");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   UPDATE PUBLISHED
============================== */
export const updatePublished = createAsyncThunk(
  "published/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token provided");

      const res = await api.put(`/published/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "Published updated",
          section: "Published",
          link: `${import.meta.env.VITE_API_FRONT_URL}/published`,
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   DELETE PUBLISHED
============================== */
export const deletePublished = createAsyncThunk(
  "published/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token provided");

      await api.delete(`/published/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Published deleted",
          section: "Published",
          link: `${import.meta.env.VITE_API_FRONT_URL}/published`,
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
const publishedSlice = createSlice({
  name: "published",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createPublished.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPublished.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createPublished.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllPublished.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPublished.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getAllPublished.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updatePublished.fulfilled, (state, action) => {
        state.list = state.list.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })

      /* DELETE */
      .addCase(deletePublished.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export default publishedSlice.reducer;

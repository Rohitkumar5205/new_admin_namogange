import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE SOURCE
============================== */
export const createSource = createAsyncThunk(
  "source/create",
  async (data, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.post("/sources/create", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "Source created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/sources`,
          section: "Source",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   GET ALL SOURCES
============================== */
export const getAllSources = createAsyncThunk(
  "source/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/sources");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   GET SOURCE BY ID
============================== */
export const getSourceById = createAsyncThunk(
  "source/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/sources/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   UPDATE SOURCE
============================== */
export const updateSource = createAsyncThunk(
  "source/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.put(`/sources/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "Source updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/sources`,
          section: "Source",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   DELETE SOURCE
============================== */
export const deleteSource = createAsyncThunk(
  "source/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      await api.delete(`/sources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Source deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/sources`,
          section: "Source",
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
const sourceSlice = createSlice({
  name: "source",
  initialState: {
    sources: [],
    singleSource: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createSource.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSource.fulfilled, (state, action) => {
        state.loading = false;
        state.sources.unshift(action.payload);
      })
      .addCase(createSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllSources.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSources.fulfilled, (state, action) => {
        state.loading = false;
        state.sources = action.payload;
      })
      .addCase(getAllSources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET BY ID */
      .addCase(getSourceById.fulfilled, (state, action) => {
        state.singleSource = action.payload;
      })

      /* UPDATE */
      .addCase(updateSource.fulfilled, (state, action) => {
        state.loading = false;
        state.sources = state.sources.map((s) =>
          s._id === action.payload._id ? action.payload : s
        );
      })

      /* DELETE */
      .addCase(deleteSource.fulfilled, (state, action) => {
        state.loading = false;
        state.sources = state.sources.filter(
          (s) => s._id !== action.payload
        );
      });
  },
});

export default sourceSlice.reducer;

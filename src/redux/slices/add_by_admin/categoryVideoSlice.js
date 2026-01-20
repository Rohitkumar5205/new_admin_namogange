import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const createCategoryVideo = createAsyncThunk(
  "categoryVideo/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/category-video/create", data);
      // backend: { success, message, data }
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAllCategoryVideos = createAsyncThunk(
  "categoryVideo/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/category-video");
      // backend: { success, data }
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getCategoryVideoById = createAsyncThunk(
  "categoryVideo/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/category-video/${id}`);
      // backend: { success, data }
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateCategoryVideo = createAsyncThunk(
  "categoryVideo/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/category-video/${id}`, data);
      // backend: { success, message, data }
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteCategoryVideo = createAsyncThunk(
  "categoryVideo/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/category-video/${id}`);
      return id; // state se remove karne ke liye
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const categoryVideoSlice = createSlice({
  name: "categoryVideo",

  initialState: {
    list: [],
    single: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearCategoryVideoError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createCategoryVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategoryVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createCategoryVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllCategoryVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCategoryVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getAllCategoryVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getCategoryVideoById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategoryVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.single = action.payload;
      })
      .addCase(getCategoryVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateCategoryVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategoryVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateCategoryVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteCategoryVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategoryVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteCategoryVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryVideoError } = categoryVideoSlice.actions;
export default categoryVideoSlice.reducer;

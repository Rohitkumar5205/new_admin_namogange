import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

// ==============================
// 1) CREATE BANNER (with file)
// ==============================
export const createBanner = createAsyncThunk(
  "banner/create",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/banner/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id: formData.get("created_by"),
          message: "Home Banner created",
          // link: "/objectives",
          // link: `${api.defaults.baseURL}/objective`,
          link: `${import.meta.env.VITE_API_FRONT_URL}/banner`,
          section: "Home Banner",
        })
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==============================
// 2) GET ALL BANNERS
// ==============================
export const getAllBanners = createAsyncThunk(
  "banner/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/banner");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==============================
// 3) GET BANNER BY ID
// ==============================
export const getBannerById = createAsyncThunk(
  "banner/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/banner/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==============================
// 4) UPDATE BANNER (with file)
// ==============================
export const updateBanner = createAsyncThunk(
  "banner/update",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/banner/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(
        createActivityLogThunk({
          user_id: formData.get("updated_by"),
          message: "Home banner updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/banner`,
          section: "Home Banner",
        })
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==============================
// 5) DELETE BANNER
// ==============================
export const deleteBanner = createAsyncThunk(
  "banner/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/banner/${id}`);

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Home banner deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/banner`,
          section: "Home Banner",
        })
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==============================
// SLICE
// ==============================
const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    banners: [],
    singleBanner: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.unshift(action.payload);
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(getAllBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getBannerById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBannerById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleBanner = action.payload;
      })
      .addCase(getBannerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bannerSlice.reducer;

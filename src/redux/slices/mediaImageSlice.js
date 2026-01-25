import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import { createActivityLogThunk } from "./activityLog/activityLogSlice";

// ==============================
// 1) CREATE GALLERY IMAGE
// ==============================
export const createGallery = createAsyncThunk(
  "gallery/create",
  async (formData, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      const res = await api.post("/galleryImage/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id: formData.get("user_id"),
          message: "Gallery Image created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/galleryImage`,
          section: "Gallery Image",
        })
      );
      return res.data.gallery;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==============================
// 2) GET ALL GALLERY
// ==============================
export const getAllGallery = createAsyncThunk(
  "gallery/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/galleryImage");
      return res.data.gallery;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==============================
// 3) GET GALLERY BY ID
// ==============================
export const getGalleryById = createAsyncThunk(
  "gallery/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/galleryImage/${id}`);
      return res.data.gallery;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==============================
// 4) UPDATE GALLERY
// ==============================
export const updateGallery = createAsyncThunk(
  "gallery/update",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      const res = await api.put(`/galleryImage/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id: formData.get("user_id"),
          message: "Gallery Image updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/galleryImage`,
          section: "Gallery Image",
        })
      );
      return res.data.gallery;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==============================
// 5) DELETE GALLERY
// ==============================
export const deleteGallery = createAsyncThunk(
  "gallery/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      await api.delete(`/galleryImage/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Gallery Image deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/galleryImage`,
          section: "Gallery Image",
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
const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    gallery: [],
    singleGallery: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // ✅ CREATE
      .addCase(createGallery.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.gallery.unshift(action.payload);
      })
      .addCase(createGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ GET ALL
      .addCase(getAllGallery.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.gallery = action.payload;
      })
      .addCase(getAllGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ GET BY ID
      .addCase(getGalleryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGalleryById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleGallery = action.payload;
      })
      .addCase(getGalleryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ UPDATE
      .addCase(updateGallery.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.gallery = state.gallery.map((g) =>
          g._id === action.payload._id ? action.payload : g
        );
      })
      .addCase(updateGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ DELETE
      .addCase(deleteGallery.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.gallery = state.gallery.filter((g) => g._id !== action.payload);
      })
      .addCase(deleteGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default gallerySlice.reducer;

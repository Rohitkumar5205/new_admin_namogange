import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

/* ===========================
   CREATE GALLERY VIDEO
=========================== */
export const createGalleryVideo = createAsyncThunk(
  "galleryVideo/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/gallery-video/create", data); 
      // backend: { success, message, video }
      return res.data.video;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===========================
   GET ALL VIDEOS
=========================== */
export const getAllGalleryVideos = createAsyncThunk(
  "galleryVideo/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/gallery-video");
      // backend: { success, videos }
      return res.data.videos;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===========================
   GET VIDEO BY ID
=========================== */
export const getGalleryVideoById = createAsyncThunk(
  "galleryVideo/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/gallery-video/${id}`);
      // backend: { success, video }
      return res.data.video;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===========================
   UPDATE VIDEO
=========================== */
export const updateGalleryVideo = createAsyncThunk(
  "galleryVideo/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/gallery-video/${id}`, data);
      // backend: { success, message, video }
      return res.data.video;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===========================
   DELETE VIDEO
=========================== */
export const deleteGalleryVideo = createAsyncThunk(
  "galleryVideo/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/gallery-video/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===========================
   SLICE
=========================== */

const galleryVideoSlice = createSlice({
  name: "galleryVideo",

  initialState: {
    videos: [],
    singleVideo: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createGalleryVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGalleryVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos.unshift(action.payload);
      })
      .addCase(createGalleryVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllGalleryVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllGalleryVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(getAllGalleryVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getGalleryVideoById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGalleryVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleVideo = action.payload;
      })
      .addCase(getGalleryVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateGalleryVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGalleryVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = state.videos.map((v) =>
          v._id === action.payload._id ? action.payload : v
        );
      })
      .addCase(updateGalleryVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteGalleryVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGalleryVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = state.videos.filter(
          (v) => v._id !== action.payload
        );
      })
      .addCase(deleteGalleryVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default galleryVideoSlice.reducer;

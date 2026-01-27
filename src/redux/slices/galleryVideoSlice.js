import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import { createActivityLogThunk } from "./activityLog/activityLogSlice";

// CREATE
export const createGalleryVideo = createAsyncThunk(
  "galleryVideo/create",
  async (videoData, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");
    try {
      const res = await api.post("/gallery-video/create", videoData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(
        createActivityLogThunk({
          user_id: videoData.user_id,
          message: "Gallery Video created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/galleryVideo`,
          section: "Gallery Video",
        })
      );
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

// UPDATE
export const updateGalleryVideo = createAsyncThunk(
  "galleryVideo/update",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");
    try {
      const res = await api.put(`/gallery-video/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(
        createActivityLogThunk({
          user_id: formData.user_id,
          message: "Gallery Video updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/galleryVideo`,
          section: "Gallery Video",
        })
      );
      return res.data.video;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// DELETE
export const deleteGalleryVideo = createAsyncThunk(
  "galleryVideo/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");
    try {
      await api.delete(`/gallery-video/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Gallery Video deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/galleryVideo`,
          section: "Gallery Video",
        })
      );
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
    const thunks = [
      createGalleryVideo,
      getAllGalleryVideos,
      getGalleryVideoById,
      updateGalleryVideo,
      deleteGalleryVideo,
    ];
    thunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    });

    builder
      .addCase(createGalleryVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos.unshift(action.payload);
      })
      .addCase(getAllGalleryVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(getGalleryVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleVideo = action.payload;
      })
      .addCase(updateGalleryVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = state.videos.map((v) =>
          v._id === action.payload._id ? action.payload : v
        );
      })
      .addCase(deleteGalleryVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = state.videos.filter((v) => v._id !== action.payload);
      });
  },
});

export default galleryVideoSlice.reducer;

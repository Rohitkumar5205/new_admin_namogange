import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ================= GET ALL ================= */
export const fetchAbouts = createAsyncThunk(
  "about/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/about-us");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

/* ================= CREATE ================= */
export const createAboutThunk = createAsyncThunk(
  "about/create",
  async (formData, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.post("/about-us/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Activity Log
      dispatch(
        createActivityLogThunk({
          user_id: formData.get("user_id"),
          message: "About section created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/about-us`,
          section: "About",
          data: {
            action: "CREATE",
            entity: "About",
            new_data: res.data.data,
          },
        }),
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

/* ================= UPDATE ================= */
export const updateAboutThunk = createAsyncThunk(
  "about/update",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.put(`/about-us/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: formData.get("user_id"),
          message: "About section updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/about-us`,
          section: "About",
          data: {
            action: "UPDATE",
            entity: "About",
            new_data: res.data.data,
          },
        }),
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

/* ================= DELETE ================= */
export const deleteAboutThunk = createAsyncThunk(
  "about/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      await api.delete(`/about-us/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "About section deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/about-us`,
          section: "About",
          data: {
            action: "DELETE",
            entity: "About",
            deleted_data: id,
          },
        }),
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

/* ================= SLICE ================= */
const aboutSlice = createSlice({
  name: "about",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchAbouts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAbouts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAbouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CREATE */
      .addCase(createAboutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAboutThunk.fulfilled, (state, action) => {
        state.data.unshift(action.payload);
      })
      .addCase(createAboutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateAboutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAboutThunk.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(updateAboutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteAboutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAboutThunk.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteAboutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default aboutSlice.reducer;

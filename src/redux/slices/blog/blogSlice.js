import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ================= CREATE BLOG ================= */
export const createBlog = createAsyncThunk(
  "blog/create",
  async (formData, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      const res = await api.post("/blog/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(
        createActivityLogThunk({
          user_id: formData.get("user_id"),
          message: "Blog created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/blogs/blog-list`,
          section: "Blog",
          data: {
            action: "CREATE",
            entity: "Blog",
            new_data: res.data.data,
          },
        }),
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

/* ================= GET ALL BLOGS ================= */
export const getAllBlogs = createAsyncThunk(
  "blog/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/blog");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

/* ================= GET BLOG BY ID ================= */
export const getBlogById = createAsyncThunk(
  "blog/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/blog/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

/* ================= UPDATE BLOG ================= */
export const updateBlog = createAsyncThunk(
  "blog/update",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      const res = await api.put(`/blog/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(
        createActivityLogThunk({
          user_id: formData.get("user_id"),
          message: "Blog updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/blogs/blog-list`,
          section: "Blog",
          data: {
            action: "UPDATE",
            entity: "Blog",
            new_data: res.data.data,
          },
        }),
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

/* ================= DELETE BLOG ================= */
export const deleteBlog = createAsyncThunk(
  "blog/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      await api.delete(`/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Blog deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/blogs/blog-list`,
          section: "Blog",
          data: {
            action: "DELETE",
            entity: "Blog",
            new_data: id,
          },
        }),
      );
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

/* ================= SLICE ================= */
const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    singleBlog: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearBlogError: (state) => {
      state.error = null;
    },
    clearSingleBlog: (state) => {
      state.singleBlog = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.unshift(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getBlogById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleBlog = action.payload;
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.map((b) =>
          b._id === action.payload._id ? action.payload : b,
        );
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBlogError, clearSingleBlog } = blogSlice.actions;
export default blogSlice.reducer;

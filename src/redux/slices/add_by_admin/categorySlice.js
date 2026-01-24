import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ===============================
   CREATE CATEGORY
================================ */
export const createCategory = createAsyncThunk(
  "category/create",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/categories/create", data);

      // 🔹 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "Category created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/categories`,
          section: "Category",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   GET ALL CATEGORIES
================================ */
export const getAllCategories = createAsyncThunk(
  "category/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/categories");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   UPDATE CATEGORY
================================ */
export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/categories/${id}`, data);

      // 🔹 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "Category updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/categories`,
          section: "Category",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   DELETE CATEGORY
================================ */
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/categories/${id}`);

      // 🔹 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Category deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/categories`,
          section: "Category",
        })
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   SLICE
================================ */
const categorySlice = createSlice({
  name: "category",

  initialState: {
    categories: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.unshift(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;

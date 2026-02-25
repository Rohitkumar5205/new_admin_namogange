import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

export const createCategoryImage = createAsyncThunk(
  "categoryImage/create",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/category-image/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // backend: { success, message, categoryImage }
      // Activity Log
      dispatch(
        createActivityLogThunk({
          user_id: formData.get("user_id"),
          message: "Category Image created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/category-image`,
          section: "CategoryImage",
          data: {
            action: "CREATE",
            entity: "Recent Update",
            entity_id: res.data.categoryImage,
          },
        }),
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const getAllCategoryImages = createAsyncThunk(
  "categoryImage/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/category-image");
      // backend: { success, data }
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const getCategoryImageById = createAsyncThunk(
  "categoryImage/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/category-image/${id}`);
      // backend: { success, data }
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const updateCategoryImage = createAsyncThunk(
  "categoryImage/update",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/category-image/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // backend: { success, message, data }
      // Activity Log
      dispatch(
        createActivityLogThunk({
          user_id: formData.get("user_id"),
          message: "Category Image updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/category-image`,
          section: "CategoryImage",
          data: {
            action: "UPDATE",
            entity: "Recent Update",
            entity_id: res.data.data,
          },
        }),
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteCategoryImage = createAsyncThunk(
  "categoryImage/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/category-image/${id}`);
      // backend: { success, message }
      // Activity Log
      dispatch(
        createActivityLogThunk({
          user_id: user_id,
          message: "Category Image deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/category-image`,
          section: "CategoryImage",
          data: {
            action: "DELETE",
            entity: "Recent Update",
            entity_id: id,
          },
        }),
      );
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const categoryImageSlice = createSlice({
  name: "categoryImage",
  initialState: {
    categoryImages: [],
    singleCategoryImage: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // ✅ CREATE
      .addCase(createCategoryImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategoryImage.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryImages.unshift(action.payload);
      })
      .addCase(createCategoryImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ GET ALL
      .addCase(getAllCategoryImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCategoryImages.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryImages = action.payload;
      })
      .addCase(getAllCategoryImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ GET BY ID
      .addCase(getCategoryImageById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategoryImageById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleCategoryImage = action.payload;
      })
      .addCase(getCategoryImageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ UPDATE
      .addCase(updateCategoryImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategoryImage.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryImages = state.categoryImages.map((item) =>
          item._id === action.payload._id ? action.payload : item,
        );
      })
      .addCase(updateCategoryImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ DELETE
      .addCase(deleteCategoryImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategoryImage.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryImages = state.categoryImages.filter(
          (item) => item._id !== action.payload,
        );
      })
      .addCase(deleteCategoryImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categoryImageSlice.reducer;

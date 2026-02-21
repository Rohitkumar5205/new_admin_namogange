import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ================= CREATE ================= */

export const createSeo = createAsyncThunk(
  "seo/create",
  async (formData, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      const token = localStorage.getItem("token");

      const res = await api.post("/seo/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔥 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id: formData?.user_id || null,
          message: `SEO Created (${formData.page_name})`,
          link: `${import.meta.env.VITE_API_FRONT_URL}/seo`,
          section: "SEO",
        }),
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

/* ================= GET ALL ================= */

export const getAllSeo = createAsyncThunk(
  "seo/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/seo");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

/* ================= GET BY ID ================= */

export const getSeoById = createAsyncThunk(
  "seo/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/seo/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

/* ================= UPDATE ================= */

export const updateSeo = createAsyncThunk(
  "seo/update",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      const res = await api.put(`/seo/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: formData?.user_id || null,
          message: `SEO Updated (${formData.page_name})`,
          link: `${import.meta.env.VITE_API_FRONT_URL}/seo`,
          section: "SEO",
        }),
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

/* ================= DELETE ================= */

export const deleteSeo = createAsyncThunk(
  "seo/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      
      await api.delete(`/seo/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "SEO Deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/seo`,
          section: "SEO",
        }),
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

/* ================= SLICE ================= */

const seoSlice = createSlice({
  name: "seo",
  initialState: {
    seoList: [],
    singleSeo: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSingleSeo: (state) => {
      state.singleSeo = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // CREATE
      .addCase(createSeo.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSeo.fulfilled, (state, action) => {
        state.loading = false;
        state.seoList.unshift(action.payload);
      })
      .addCase(createSeo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllSeo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSeo.fulfilled, (state, action) => {
        state.loading = false;
        state.seoList = action.payload;
      })
      .addCase(getAllSeo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getSeoById.fulfilled, (state, action) => {
        state.singleSeo = action.payload;
      })

      // UPDATE
      .addCase(updateSeo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSeo.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.seoList.findIndex(
          (item) => item._id === action.payload._id,
        );

        if (index !== -1) {
          state.seoList[index] = action.payload;
        }

        state.singleSeo = action.payload;
      })
      .addCase(updateSeo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteSeo.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSeo.fulfilled, (state, action) => {
        state.loading = false;
        state.seoList = state.seoList.filter(
          (item) => item._id !== action.payload,
        );
      })
      .addCase(deleteSeo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSingleSeo } = seoSlice.actions;

export default seoSlice.reducer;

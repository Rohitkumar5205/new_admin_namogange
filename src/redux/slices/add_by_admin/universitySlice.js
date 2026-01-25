import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE UNIVERSITY
============================== */
export const createUniversity = createAsyncThunk(
  "university/create",
  async (data, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.post("/universities/create", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "University created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/universities`,
          section: "University",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   GET ALL UNIVERSITIES
============================== */
export const getAllUniversities = createAsyncThunk(
  "university/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/universities");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   GET UNIVERSITY BY ID
============================== */
export const getUniversityById = createAsyncThunk(
  "university/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/universities/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   UPDATE UNIVERSITY
============================== */
export const updateUniversity = createAsyncThunk(
  "university/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.put(`/universities/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "University updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/universities`,
          section: "University",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   DELETE UNIVERSITY
============================== */
export const deleteUniversity = createAsyncThunk(
  "university/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      await api.delete(`/universities/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "University deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/universities`,
          section: "University",
        })
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   SLICE
============================== */
const universitySlice = createSlice({
  name: "university",
  initialState: {
    universities: [],
    singleUniversity: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createUniversity.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUniversity.fulfilled, (state, action) => {
        state.loading = false;
        state.universities.unshift(action.payload);
      })
      .addCase(createUniversity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllUniversities.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUniversities.fulfilled, (state, action) => {
        state.loading = false;
        state.universities = action.payload;
      })
      .addCase(getAllUniversities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET BY ID */
      .addCase(getUniversityById.fulfilled, (state, action) => {
        state.singleUniversity = action.payload;
      })

      /* UPDATE */
      .addCase(updateUniversity.fulfilled, (state, action) => {
        state.universities = state.universities.map((u) =>
          u._id === action.payload._id ? action.payload : u
        );
      })

      /* DELETE */
      .addCase(deleteUniversity.fulfilled, (state, action) => {
        state.universities = state.universities.filter(
          (u) => u._id !== action.payload
        );
      });
  },
});

export default universitySlice.reducer;

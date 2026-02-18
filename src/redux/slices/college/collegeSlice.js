import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE COLLEGE
============================== */
export const createCollege = createAsyncThunk(
  "college/create",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/colleges/create", data);
      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "New College Added",
          link: `${import.meta.env.VITE_API_FRONT_URL}/collage/college-list`,
          section: "College",
        })
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/* ==============================
   GET ALL COLLEGES
============================== */
export const getAllColleges = createAsyncThunk(
  "college/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/colleges");
      // Handle potential response structures: { data: [...] } or [...]
      return response.data?.data || response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/* ==============================
   UPDATE COLLEGE
============================== */
export const updateCollege = createAsyncThunk(
  "college/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/colleges/${id}`, data);
      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "College Updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/collage/college-list`,
          section: "College",
        })
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/* ==============================
   DELETE COLLEGE
============================== */
export const deleteCollege = createAsyncThunk(
  "college/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/colleges/${id}`);
      dispatch(
        createActivityLogThunk({
          user_id,
          message: "College Deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/collage/college-list`,
          section: "College",
        })
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const collegeSlice = createSlice({
  name: "college",
  initialState: {
    colleges: [],
    loading: false,
    error: null,
    singleCollege: null,
  },
  reducers: {
    clearSingleCollege: (state) => {
      state.singleCollege = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createCollege.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCollege.fulfilled, (state, action) => {
        state.loading = false;
        const newCollege = action.payload?.data || action.payload;
        if (newCollege) {
          state.colleges.push(newCollege);
        }
      })
      .addCase(createCollege.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* GET ALL */
      .addCase(getAllColleges.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllColleges.fulfilled, (state, action) => {
        state.loading = false;
        state.colleges = action.payload;
      })
      .addCase(getAllColleges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* UPDATE */
      .addCase(updateCollege.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCollege.fulfilled, (state, action) => {
        state.loading = false;
      })
        .addCase(updateCollege.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })  
      /* DELETE */
         .addCase(deleteCollege.pending, (state) => {
        state.loading = true;
      })    
      .addCase(deleteCollege.fulfilled, (state, action) => {
        state.loading = false;
        state.colleges = state.colleges.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCollege.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete college";
        });
  },
});

export const { clearSingleCollege } = collegeSlice.actions;
export default collegeSlice.reducer;
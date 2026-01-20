import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const createUniversity = createAsyncThunk(
  "university/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/universities", data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAllUniversities = createAsyncThunk(
  "university/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/universities");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getUniversityById = createAsyncThunk(
  "university/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/universities/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateUniversity = createAsyncThunk(
  "university/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/universities/${id}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteUniversity = createAsyncThunk(
  "university/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/universities/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   SLICE
================================ */
const universitySlice = createSlice({
  name: "university",

  initialState: {
    universities: [],
    singleUniversity: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearUniversityError: (state) => {
      state.error = null;
    },
    clearSingleUniversity: (state) => {
      state.singleUniversity = null;
    },
  },

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
      .addCase(getUniversityById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUniversityById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleUniversity = action.payload;
      })
      .addCase(getUniversityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateUniversity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUniversity.fulfilled, (state, action) => {
        state.loading = false;
        state.universities = state.universities.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateUniversity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteUniversity.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUniversity.fulfilled, (state, action) => {
        state.loading = false;
        state.universities = state.universities.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteUniversity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearUniversityError,
  clearSingleUniversity,
} = universitySlice.actions;

export default universitySlice.reducer;

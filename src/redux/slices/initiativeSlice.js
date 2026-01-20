import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

// ==============================
// 1) CREATE INITIATIVE
// ==============================
export const createInitiative = createAsyncThunk(
  "initiative/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/initiatives/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.initiative;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==============================
// 2) GET ALL INITIATIVES
// ==============================
export const getAllInitiatives = createAsyncThunk(
  "initiative/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/initiatives");
      return res.data.initiatives;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==============================
// 3) GET SINGLE INITIATIVE
// ==============================
export const getInitiativeById = createAsyncThunk(
  "initiative/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/initiatives/${id}`);
      return res.data.initiative;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==============================
// 4) UPDATE INITIATIVE
// ==============================
export const updateInitiative = createAsyncThunk(
  "initiative/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/initiatives/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.initiative;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==============================
// 5) DELETE INITIATIVE
// ==============================
export const deleteInitiative = createAsyncThunk(
  "initiative/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/initiatives/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==============================
// SLICE
// ==============================
const initiativeSlice = createSlice({
  name: "initiative",
  initialState: {
    initiatives: [],
    singleInitiative: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createInitiative.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInitiative.fulfilled, (state, action) => {
        state.loading = false;
        state.initiatives.unshift(action.payload);
      })
      .addCase(createInitiative.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllInitiatives.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllInitiatives.fulfilled, (state, action) => {
        state.loading = false;
        state.initiatives = action.payload;
      })
      .addCase(getAllInitiatives.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getInitiativeById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInitiativeById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleInitiative = action.payload;
      })
      .addCase(getInitiativeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateInitiative.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateInitiative.fulfilled, (state, action) => {
        state.loading = false;
        state.initiatives = state.initiatives.map((i) =>
          i._id === action.payload._id ? action.payload : i
        );
      })
      .addCase(updateInitiative.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteInitiative.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteInitiative.fulfilled, (state, action) => {
        state.loading = false;
        state.initiatives = state.initiatives.filter(
          (i) => i._id !== action.payload
        );
      })
      .addCase(deleteInitiative.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default initiativeSlice.reducer;

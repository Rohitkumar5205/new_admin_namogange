import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const createStatusOption = createAsyncThunk(
  "statusOption/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/status-option", data);
      // backend: { message, data }
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getStatusOptions = createAsyncThunk(
  "statusOption/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/status-option");
      // backend returns array directly
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getStatusOptionById = createAsyncThunk(
  "statusOption/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/status-option/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateStatusOption = createAsyncThunk(
  "statusOption/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/status-option/${id}`, data);
      // backend: { message, data }
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteStatusOption = createAsyncThunk(
  "statusOption/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/status-option/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const statusOptionSlice = createSlice({
  name: "statusOption",

  initialState: {
    statusOptions: [],
    single: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearStatusOptionError: (state) => {
      state.error = null;
    },
    clearSingleStatusOption: (state) => {
      state.single = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createStatusOption.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStatusOption.fulfilled, (state, action) => {
        state.loading = false;
        state.statusOptions.unshift(action.payload);
      })
      .addCase(createStatusOption.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getStatusOptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStatusOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.statusOptions = action.payload;
      })
      .addCase(getStatusOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getStatusOptionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStatusOptionById.fulfilled, (state, action) => {
        state.loading = false;
        state.single = action.payload;
      })
      .addCase(getStatusOptionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateStatusOption.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStatusOption.fulfilled, (state, action) => {
        state.loading = false;
        state.statusOptions = state.statusOptions.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateStatusOption.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteStatusOption.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStatusOption.fulfilled, (state, action) => {
        state.loading = false;
        state.statusOptions = state.statusOptions.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteStatusOption.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStatusOptionError, clearSingleStatusOption } =
  statusOptionSlice.actions;

export default statusOptionSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const createData = createAsyncThunk(
  "data/create",
  async (body, { rejectWithValue }) => {
    try {
      const res = await api.post("/data", body, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAllData = createAsyncThunk(
  "data/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/data");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getDataById = createAsyncThunk(
  "data/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/data/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateData = createAsyncThunk(
  "data/update",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/data/${id}`, body, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteData = createAsyncThunk(
  "data/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/data/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState: {
    list: [],
    single: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearDataError: (state) => {
      state.error = null;
    },
    clearSingleData: (state) => {
      state.single = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createData.pending, (state) => {
        state.loading = true;
      })
      .addCase(createData.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllData.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getAllData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET BY ID */
      .addCase(getDataById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDataById.fulfilled, (state, action) => {
        state.loading = false;
        state.single = action.payload;
      })
      .addCase(getDataById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateData.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteData.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDataError, clearSingleData } = dataSlice.actions;

export default dataSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE STATUS OPTION
============================== */
export const createStatusOption = createAsyncThunk(
  "statusOption/create",
  async (data, { dispatch, rejectWithValue }) => {
    const token = sessionStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.post("/status-option/create", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "Status option created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/status-option`,
          section: "Status Option",
        }),
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

/* ==============================
   GET ALL STATUS OPTIONS
============================== */
export const getAllStatusOptions = createAsyncThunk(
  "statusOption/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/status-option");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

/* ==============================
   GET STATUS OPTION BY ID
============================== */
export const getStatusOptionById = createAsyncThunk(
  "statusOption/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/status-option/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

/* ==============================
   UPDATE STATUS OPTION
============================== */
export const updateStatusOption = createAsyncThunk(
  "statusOption/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    const token = sessionStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.put(`/status-option/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "Status option updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/status-option`,
          section: "Status Option",
        }),
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

/* ==============================
   DELETE STATUS OPTION
============================== */
export const deleteStatusOption = createAsyncThunk(
  "statusOption/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = sessionStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      await api.delete(`/status-option/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Status option deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/status-option`,
          section: "Status Option",
        }),
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

/* ==============================
   SLICE
============================== */
const statusOptionSlice = createSlice({
  name: "statusOption",
  initialState: {
    statusOptions: [],
    singleStatusOption: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* CREATE */
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

      /* GET ALL */
      .addCase(getAllStatusOptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllStatusOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.statusOptions = action.payload;
      })
      .addCase(getAllStatusOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET BY ID */
      .addCase(getStatusOptionById.fulfilled, (state, action) => {
        state.singleStatusOption = action.payload;
      })

      /* UPDATE */
      .addCase(updateStatusOption.fulfilled, (state, action) => {
        state.statusOptions = state.statusOptions.map((s) =>
          s._id === action.payload._id ? action.payload : s,
        );
      })

      /* DELETE */
      .addCase(deleteStatusOption.fulfilled, (state, action) => {
        state.statusOptions = state.statusOptions.filter(
          (s) => s._id !== action.payload,
        );
      });
  },
});

export default statusOptionSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

export const createData = createAsyncThunk(
  "data/create",
  async (payload, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.post("/data/craete", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: payload.user_id,
          message: "Data created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/data`,
          section: "Data",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
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
      return rejectWithValue(err.response?.data?.message || err.message);
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
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateData = createAsyncThunk(
  "data/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.put(`/data/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "Data updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/data`,
          section: "Data",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteData = createAsyncThunk(
  "data/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      await api.delete(`/data/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Data deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/data`,
          section: "Data",
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
const dataSlice = createSlice({
  name: "data",
  initialState: {
    list: [],
    singleData: null,
    loading: false,
    error: null,
  },
  reducers: {},
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
      .addCase(getDataById.fulfilled, (state, action) => {
        state.singleData = action.payload;
      })

      /* UPDATE */
      .addCase(updateData.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })

      /* DELETE */
      .addCase(deleteData.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((item) => item._id !== action.payload);
      });
  },
});

export default dataSlice.reducer;

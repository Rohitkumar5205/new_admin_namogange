import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE CALL TARGET
============================== */
export const createCallTarget = createAsyncThunk(
  "callTarget/create",
  async (payload, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.post("/call-target/create", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔹 Activity log
      dispatch(
        createActivityLogThunk({
          user_id: payload.user_id,
          message: "Call target created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/call-target`,
          section: "Call Target",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   GET ALL CALL TARGETS
============================== */
export const getAllCallTargets = createAsyncThunk(
  "callTarget/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/call-target");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   GET CALL TARGET BY ID
============================== */
export const getCallTargetById = createAsyncThunk(
  "callTarget/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/call-target/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   UPDATE CALL TARGET
============================== */
export const updateCallTarget = createAsyncThunk(
  "callTarget/update",
  async ({ id, payload }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.put(`/call-target/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: payload.user_id,
          message: "Call target updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/call-target`,
          section: "Call Target",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   DELETE CALL TARGET
============================== */
export const deleteCallTarget = createAsyncThunk(
  "callTarget/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      await api.delete(`/call-target/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Call target deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/call-target`,
          section: "Call Target",
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
const callTargetSlice = createSlice({
  name: "callTarget",
  initialState: {
    list: [],
    singleCallTarget: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createCallTarget.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCallTarget.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createCallTarget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllCallTargets.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCallTargets.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getAllCallTargets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET BY ID */
      .addCase(getCallTargetById.fulfilled, (state, action) => {
        state.singleCallTarget = action.payload;
      })

      /* UPDATE */
      .addCase(updateCallTarget.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })

      /* DELETE */
      .addCase(deleteCallTarget.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export default callTargetSlice.reducer;

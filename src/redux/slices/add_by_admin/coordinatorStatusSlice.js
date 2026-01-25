import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE COORDINATOR STATUS
============================== */
export const createCoordinatorStatus = createAsyncThunk(
  "coordinatorStatus/create",
  async (payload, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.post("/coordinator-status/create", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id: payload.user_id,
          message: "Coordinator Status created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/coordinator-status`,
          section: "Coordinator Status",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   GET ALL COORDINATOR STATUS
============================== */
export const getAllCoordinatorStatus = createAsyncThunk(
  "coordinatorStatus/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/coordinator-status");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   UPDATE COORDINATOR STATUS
============================== */
// export const updateCoordinatorStatus = createAsyncThunk(
//   "coordinatorStatus/update",
//   async ({ id, payload }, { dispatch, rejectWithValue }) => {
//     const token = localStorage.getItem("token");
//     if (!token) return rejectWithValue("No token provided");

//     try {
//       const res = await api.put(`/coordinator-status/${id}`, payload, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       dispatch(
//         createActivityLogThunk({
//           user_id: payload.user_id,
//           message: "Coordinator Status updated",
//           link: `${import.meta.env.VITE_API_FRONT_URL}/coordinator-status`,
//           section: "Coordinator Status",
//         })
//       );

//       return res.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );
export const updateCoordinatorStatus = createAsyncThunk(
  "coordinatorStatus/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.put(`/coordinator-status/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "Coordinator Status updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/coordinator-status`,
          section: "Coordinator Status",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   DELETE COORDINATOR STATUS
============================== */
export const deleteCoordinatorStatus = createAsyncThunk(
  "coordinatorStatus/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      await api.delete(`/coordinator-status/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Coordinator Status deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/coordinator-status`,
          section: "Coordinator Status",
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
const coordinatorStatusSlice = createSlice({
  name: "coordinatorStatus",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createCoordinatorStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCoordinatorStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createCoordinatorStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllCoordinatorStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCoordinatorStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getAllCoordinatorStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateCoordinatorStatus.fulfilled, (state, action) => {
        state.list = state.list.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })

      /* DELETE */
      .addCase(deleteCoordinatorStatus.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item._id !== action.payload);
      });
  },
});

export default coordinatorStatusSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE OCCUPATION
============================== */
export const createOccupation = createAsyncThunk(
  "occupation/create",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/occupations/create", payload);

      // 🔹 ACTIVITY LOG (initiative jaisa)
      dispatch(
        createActivityLogThunk({
          user_id: payload.user_id,
          message: "Occupation created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/occupations`,
          section: "Occupation",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create occupation"
      );
    }
  }
);

/* ==============================
   GET ALL OCCUPATIONS
============================== */
export const getAllOccupations = createAsyncThunk(
  "occupation/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/occupations");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch occupations"
      );
    }
  }
);

/* ==============================
   UPDATE OCCUPATION
============================== */
export const updateOccupation = createAsyncThunk(
  "occupation/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/occupations/${id}`, data);

      // 🔹 ACTIVITY LOG
      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "Occupation updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/occupations`,
          section: "Occupation",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update occupation"
      );
    }
  }
);

/* ==============================
   DELETE OCCUPATION
============================== */
export const deleteOccupation = createAsyncThunk(
  "occupation/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/occupations/${id}`);

      // 🔹 ACTIVITY LOG
      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Occupation deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/occupations`,
          section: "Occupation",
        })
      );

      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete occupation"
      );
    }
  }
);

/* ==============================
   SLICE
============================== */
const occupationSlice = createSlice({
  name: "occupation",
  initialState: {
    occupations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createOccupation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOccupation.fulfilled, (state, action) => {
        state.loading = false;
        state.occupations.unshift(action.payload);
      })
      .addCase(createOccupation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllOccupations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllOccupations.fulfilled, (state, action) => {
        state.loading = false;
        state.occupations = action.payload;
      })
      .addCase(getAllOccupations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateOccupation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOccupation.fulfilled, (state, action) => {
        state.loading = false;
        state.occupations = state.occupations.map((o) =>
          o._id === action.payload._id ? action.payload : o
        );
      })
      .addCase(updateOccupation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteOccupation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOccupation.fulfilled, (state, action) => {
        state.loading = false;
        state.occupations = state.occupations.filter(
          (o) => o._id !== action.payload
        );
      })
      .addCase(deleteOccupation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default occupationSlice.reducer;

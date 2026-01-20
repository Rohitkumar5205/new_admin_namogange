import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE OCCUPATION
============================== */
export const createOccupation = createAsyncThunk(
  "occupation/create",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/occupations/create", formData);

      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id: formData.created_by,
          message: "Occupation created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/occupations`,
          section: "Occupation",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
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
      return rejectWithValue(err.response?.data || err.message);
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

      dispatch(
        createActivityLogThunk({
          user_id: data.updated_by,
          message: "Occupation updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/occupation`,
          section: "Occupation",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
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

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Occupation deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/occupation`,
          section: "Occupation",
        })
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
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
      .addCase(updateOccupation.fulfilled, (state, action) => {
        state.occupations = state.occupations.map((o) =>
          o._id === action.payload._id ? action.payload : o
        );
      })

      /* DELETE */
      .addCase(deleteOccupation.fulfilled, (state, action) => {
        state.occupations = state.occupations.filter(
          (o) => o._id !== action.payload
        );
      });
  },
});

export default occupationSlice.reducer;

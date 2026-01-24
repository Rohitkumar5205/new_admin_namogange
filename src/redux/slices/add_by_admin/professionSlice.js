import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ===============================
   CREATE PROFESSION
================================ */
export const createProfession = createAsyncThunk(
  "profession/create",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/professions/create", data);

      // 🔹 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "Profession created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/professions`,
          section: "Profession",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   GET ALL PROFESSIONS
================================ */
export const getAllProfessions = createAsyncThunk(
  "profession/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/professions");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   UPDATE PROFESSION
================================ */
export const updateProfession = createAsyncThunk(
  "profession/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/professions/${id}`, data);

      // 🔹 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "Profession updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/professions`,
          section: "Profession",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   DELETE PROFESSION
================================ */
export const deleteProfession = createAsyncThunk(
  "profession/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/professions/${id}`);

      // 🔹 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Profession deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/professions`,
          section: "Profession",
        })
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   SLICE
================================ */
const professionSlice = createSlice({
  name: "profession",

  initialState: {
    professions: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearProfessionError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createProfession.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProfession.fulfilled, (state, action) => {
        state.loading = false;
        state.professions.unshift(action.payload);
      })
      .addCase(createProfession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllProfessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProfessions.fulfilled, (state, action) => {
        state.loading = false;
        state.professions = action.payload;
      })
      .addCase(getAllProfessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateProfession.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfession.fulfilled, (state, action) => {
        state.loading = false;
        state.professions = state.professions.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateProfession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteProfession.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProfession.fulfilled, (state, action) => {
        state.loading = false;
        state.professions = state.professions.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteProfession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfessionError } = professionSlice.actions;
export default professionSlice.reducer;

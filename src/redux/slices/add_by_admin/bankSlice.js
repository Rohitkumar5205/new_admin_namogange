import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE BANK
============================== */
export const createBank = createAsyncThunk(
  "bank/create",
  async (payload, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.post("/banks/create", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id: payload.user_id,
          message: "Bank created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/banks`,
          section: "Bank",
        })
      );

      return res.data.data; // 👈 VERY IMPORTANT
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   GET ALL BANKS
============================== */
export const getAllBanks = createAsyncThunk(
  "bank/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/banks");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   GET BANK BY ID
============================== */
export const getBankById = createAsyncThunk(
  "bank/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/banks/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   UPDATE BANK
============================== */
export const updateBank = createAsyncThunk(
  "bank/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.put(`/banks/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ activity log (FIXED)
      dispatch(
        createActivityLogThunk({
          user_id: data.user_id, // ✅ payload ❌ -> data ✅
          message: "Bank updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/banks`,
          section: "Bank",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   DELETE BANK
============================== */
export const deleteBank = createAsyncThunk(
  "bank/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      await api.delete(`/banks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Bank deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/banks`,
          section: "Bank",
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
const bankSlice = createSlice({
  name: "bank",
  initialState: {
    banks: [],
    singleBank: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetSingleBank: (state) => {
      state.singleBank = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createBank.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBank.fulfilled, (state, action) => {
        state.loading = false;
        state.banks.unshift(action.payload);
      })
      .addCase(createBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllBanks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.banks = action.payload;
      })
      .addCase(getAllBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET BY ID */
      .addCase(getBankById.fulfilled, (state, action) => {
        state.singleBank = action.payload;
      })

      /* UPDATE */
      .addCase(updateBank.fulfilled, (state, action) => {
        state.loading = false;
        state.banks = state.banks.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })

      /* DELETE */
      .addCase(deleteBank.fulfilled, (state, action) => {
        state.loading = false;
        state.banks = state.banks.filter((b) => b._id !== action.payload);
      });
  },
});

export const { resetSingleBank } = bankSlice.actions;
export default bankSlice.reducer;

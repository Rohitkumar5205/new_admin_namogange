import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

// =========================
// 1) REGISTER ADMIN
// =========================
export const registerAdmin = createAsyncThunk(
  "admin/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/admin/register", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// =========================
// 2) LOGIN ADMIN
// =========================
export const loginAdmin = createAsyncThunk(
  "admin/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/admin/login", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// =========================
// 3) GET ALL ADMINS
// =========================
export const getAllAdmins = createAsyncThunk(
  "admin/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// =========================
// 4) UPDATE ADMIN
// =========================
export const updateAdmin = createAsyncThunk(
  "admin/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/admin/${id}`, data);
      return res.data.admin;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// =========================
// 5) DELETE ADMIN
// =========================
export const deleteAdmin = createAsyncThunk(
  "admin/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// =========================
// SLICE
// =========================

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admins: [],
    currentAdmin: null,
    token: null,
    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.currentAdmin = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    // REGISTER
    builder
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAdmin = action.payload.admin;
        state.token = action.payload.token;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });

    // LOGIN
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAdmin = action.payload.admin;
        state.token = action.payload.token;

        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });

    // GET ALL ADMINS
    builder
      .addCase(getAllAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(getAllAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });

    // UPDATE
    builder
      .addCase(updateAdmin.pending, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.admins = state.admins.map((a) =>
          a._id === action.payload._id ? action.payload : a
        );
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });

    // DELETE
    builder
      .addCase(deleteAdmin.pending, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.admins = state.admins.filter((a) => a._id !== action.payload);
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { logout } = adminSlice.actions;
export default adminSlice.reducer;

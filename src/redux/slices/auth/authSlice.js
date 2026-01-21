import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

// ==============================
// 1) LOGIN → PASSWORD CHECK + SEND OTP
// ==============================
export const loginWithPasswordThunk = createAsyncThunk(
  "auth/loginWithPassword",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", data);

      // 🔹 activity log (OTP sent)
      dispatch(
        createActivityLogThunk({
          user_id: res.data.user_id,
          message: "Login successful, OTP sent",
          link: `${import.meta.env.VITE_API_FRONT_URL}/login`,
          section: "Authentication",
        })
      );

      return res.data; // { success, message, user_id, username }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

// ==============================
// 2) RESEND OTP
// ==============================
export const resendOtpThunk = createAsyncThunk(
  "auth/resendOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/resend-otp", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Resend OTP failed"
      );
    }
  }
);

// ==============================
// 3) VERIFY OTP → JWT TOKEN
// ==============================
export const verifyOtpThunk = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/auth/verify-otp", data);

      // 🔹 save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id: res.data.user.id,
          message: "OTP verified & user logged in",
          link: `${import.meta.env.VITE_API_FRONT_URL}/dashboard`,
          section: "Authentication",
        })
      );

      return res.data; // { token, user }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

// ==============================
// 4) LOGOUT
// ==============================
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch(
      createActivityLogThunk({
        message: "User logged out",
        section: "Authentication",
      })
    );

    return true;
  }
);

// ==============================
// SLICE
// ==============================
const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,

    otpStep: false,
    userIdForOtp: null,
    usernameForOtp: null,

    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: !!localStorage.getItem("token"),
  },

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    resetOtpState: (state) => {
      state.otpStep = false;
      state.userIdForOtp = null;
      state.usernameForOtp = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ======================
      // LOGIN (SEND OTP)
      // ======================
      .addCase(loginWithPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.otpStep = true;
        state.userIdForOtp = action.payload.user_id;
        state.usernameForOtp = action.payload.username;
      })
      .addCase(loginWithPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // RESEND OTP
      // ======================
      .addCase(resendOtpThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendOtpThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // VERIFY OTP
      // ======================
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.otpStep = false;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // LOGOUT
      // ======================
      .addCase(logoutThunk.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.otpStep = false;
      });
  },
});

export const { clearAuthError, resetOtpState } = authSlice.actions;

export default authSlice.reducer;

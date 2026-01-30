import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

// ==============================
// 1) CREATE USER
// ==============================
export const createUserThunk = createAsyncThunk(
  "user/create",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/users/create", formData);
      console.log(formData);
      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id: formData?.updated_by,
          message: "User created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/users`,
          section: "User",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ==============================
// 2) GET ALL USERS
// ==============================
export const getAllUsersThunk = createAsyncThunk(
  "user/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ==============================
// 3) GET USER BY ID
// ==============================
export const getUserByIdThunk = createAsyncThunk(
  "user/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ==============================
// 4) UPDATE USER
// ==============================
export const updateUserThunk = createAsyncThunk(
  "user/update",
  async ({ id, data, updated_by }, { dispatch, rejectWithValue }) => {
    console.log("updated_by", updated_by);
    console.log("data", data);
    try {
      const res = await api.put(`/users/${id}`, data);

      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id: data?.updated_by,
          message: "User updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/users`,
          section: "User",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ==============================
// 5) DELETE USER (SOFT)
// ==============================
export const deleteUserThunk = createAsyncThunk(
  "user/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);

      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id,
          message: "User deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/users`,
          section: "User",
        })
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ==============================
// SLICE
// ==============================
const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    singleUser: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearSingleUser: (state) => {
      state.singleUser = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ======================
      // CREATE
      // ======================
      .addCase(createUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload);
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // GET ALL
      // ======================
      .addCase(getAllUsersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // GET BY ID
      // ======================
      .addCase(getUserByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.singleUser = action.payload;
      })
      .addCase(getUserByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // UPDATE
      // ======================
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u
        );
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // DELETE
      // ======================
      .addCase(deleteUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError, clearSingleUser } = userSlice.actions;

export default userSlice.reducer;

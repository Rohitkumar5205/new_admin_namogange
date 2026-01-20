import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ===============================
   CREATE DEPARTMENT
================================ */
export const createDepartment = createAsyncThunk(
  "department/create",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/departments", data);

      // 🔹 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id: data.created_by,
          message: "Department created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/departments`,
          section: "Department",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   GET ALL DEPARTMENTS
================================ */
export const getAllDepartments = createAsyncThunk(
  "department/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/departments");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   UPDATE DEPARTMENT
================================ */
export const updateDepartment = createAsyncThunk(
  "department/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/departments/${id}`, data);

      // 🔹 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id: data.updated_by,
          message: "Department updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/departments`,
          section: "Department",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   DELETE DEPARTMENT
================================ */
export const deleteDepartment = createAsyncThunk(
  "department/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/departments/${id}`);

      // 🔹 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Department deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/departments`,
          section: "Department",
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
const departmentSlice = createSlice({
  name: "department",
  initialState: {
    departments: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearDepartmentError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments.unshift(action.payload);
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllDepartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(getAllDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = state.departments.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = state.departments.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDepartmentError } = departmentSlice.actions;
export default departmentSlice.reducer;

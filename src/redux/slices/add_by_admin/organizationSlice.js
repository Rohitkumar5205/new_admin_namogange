import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE ORGANIZATION
============================== */
export const createOrganization = createAsyncThunk(
  "organization/create",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/organization/create", formData);

      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id: formData.created_by,
          message: "Organization created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/organizations`,
          section: "Organization",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ==============================
   GET ALL ORGANIZATIONS
============================== */
export const getAllOrganizations = createAsyncThunk(
  "organization/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/organization");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ==============================
   UPDATE ORGANIZATION
============================== */
export const updateOrganization = createAsyncThunk(
  "organization/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/organization/${id}`, data);

      dispatch(
        createActivityLogThunk({
          user_id: data.updated_by,
          message: "Organization updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/organizations`,
          section: "Organization",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ==============================
   DELETE ORGANIZATION
============================== */
export const deleteOrganization = createAsyncThunk(
  "organization/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/organization/${id}`);

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Organization deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/organizations`,
          section: "Organization",
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
const organizationSlice = createSlice({
  name: "organization",
  initialState: {
    organizations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createOrganization.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations.unshift(action.payload);
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllOrganizations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload;
      })
      .addCase(getAllOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateOrganization.fulfilled, (state, action) => {
        state.organizations = state.organizations.map((o) =>
          o._id === action.payload._id ? action.payload : o
        );
      })

      /* DELETE */
      .addCase(deleteOrganization.fulfilled, (state, action) => {
        state.organizations = state.organizations.filter(
          (o) => o._id !== action.payload
        );
      });
  },
});

export default organizationSlice.reducer;

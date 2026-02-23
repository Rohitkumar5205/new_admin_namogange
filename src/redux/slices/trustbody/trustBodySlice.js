import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE TRUST BODY
============================== */
export const createTrustBody = createAsyncThunk(
  "trustBody/create",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token provided");

      const res = await api.post("/trust-bodies/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
      
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: formData.get("user_id"),
          message: "Trust Body created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/trust-bodies`,
          section: "Trust Body",
          data: {
            action: "CREATE",
            entity: "Trust Body",
            new_data: res.data.data,
          },
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   GET ALL TRUST BODIES
============================== */
export const getAllTrustBodies = createAsyncThunk(
  "trustBody/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/trust-bodies");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   UPDATE TRUST BODY
============================== */
export const updateTrustBody = createAsyncThunk(
  "trustBody/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token provided");

      const res = await api.put(`/trust-bodies/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: data.get("user_id"),
          message: "Trust Body updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/trust-bodies`,
          section: "Trust Body",
          data: {
            action: "UPDATE",
            entity: "Trust Body",
            new_data: res.data.data,
          },
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   DELETE TRUST BODY
============================== */
export const deleteTrustBody = createAsyncThunk(
  "trustBody/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token provided");

      await api.delete(`/trust-bodies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Trust Body deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/trust-bodies`,
          section: "Trust Body",
          data: {
            action: "DELETE",
            entity: "Trust Body",
            deleted_data: id,
          },
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
const trustBodySlice = createSlice({
  name: "trustBody",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetSingleTrustBody: (state) => {
      state.single = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createTrustBody.pending, (s) => {
        s.loading = true;
      })
      .addCase(createTrustBody.fulfilled, (s, a) => {
        s.loading = false;
        s.list.unshift(a.payload);
      })
      .addCase(createTrustBody.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* GET ALL */
      .addCase(getAllTrustBodies.pending, (s) => {
        s.loading = true;
      })
      .addCase(getAllTrustBodies.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload.data;
      })

      /* UPDATE */
      .addCase(updateTrustBody.fulfilled, (s, a) => {
        s.loading = false;
        s.list = s.list.map((i) => (i._id === a.payload._id ? a.payload : i));
      })

      /* DELETE */
      .addCase(deleteTrustBody.fulfilled, (s, a) => {
        s.list = s.list.filter((i) => i._id !== a.payload);
      });
  },
});

export const { resetSingleTrustBody } = trustBodySlice.actions;
export default trustBodySlice.reducer;

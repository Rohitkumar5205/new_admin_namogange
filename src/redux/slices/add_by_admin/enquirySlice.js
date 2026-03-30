import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE ENQUIRY
============================== */
export const createEnquiry = createAsyncThunk(
  "enquiry/create",
  async (data, { dispatch, rejectWithValue }) => {
    const token = sessionStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.post("/enquiries/create", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "Enquiry created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/enquiries`,
          section: "Enquiry",
        }),
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

/* ==============================
   GET ALL ENQUIRIES
============================== */
export const getAllEnquiries = createAsyncThunk(
  "enquiry/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/enquiries");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

/* ==============================
   GET ENQUIRY BY ID
============================== */
export const getEnquiryById = createAsyncThunk(
  "enquiry/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/enquiries/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

/* ==============================
   UPDATE ENQUIRY
============================== */
export const updateEnquiry = createAsyncThunk(
  "enquiry/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    const token = sessionStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.put(`/enquiries/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: data.user_id,
          message: "Enquiry updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/enquiries`,
          section: "Enquiry",
        }),
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

/* ==============================
   DELETE ENQUIRY
============================== */
export const deleteEnquiry = createAsyncThunk(
  "enquiry/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = sessionStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      await api.delete(`/enquiries/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Enquiry deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/enquiries`,
          section: "Enquiry",
        }),
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

/* ==============================
   SLICE
============================== */
const enquirySlice = createSlice({
  name: "enquiry",
  initialState: {
    enquiries: [],
    singleEnquiry: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createEnquiry.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries.unshift(action.payload);
      })
      .addCase(createEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllEnquiries.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllEnquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries = action.payload;
      })
      .addCase(getAllEnquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET BY ID */
      .addCase(getEnquiryById.fulfilled, (state, action) => {
        state.singleEnquiry = action.payload;
      })

      /* UPDATE */
      .addCase(updateEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries = state.enquiries.map((e) =>
          e._id === action.payload._id ? action.payload : e,
        );
      })

      /* DELETE */
      .addCase(deleteEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries = state.enquiries.filter(
          (e) => e._id !== action.payload,
        );
      });
  },
});

export default enquirySlice.reducer;

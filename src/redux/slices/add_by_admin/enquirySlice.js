import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const createEnquiry = createAsyncThunk(
  "enquiry/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/enquiries", data, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAllEnquiries = createAsyncThunk(
  "enquiry/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/enquiries");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getEnquiryById = createAsyncThunk(
  "enquiry/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/enquiries/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateEnquiry = createAsyncThunk(
  "enquiry/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/enquiries/${id}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteEnquiry = createAsyncThunk(
  "enquiry/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/enquiries/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const enquirySlice = createSlice({
  name: "enquiry",
  initialState: {
    enquiries: [],
    singleEnquiry: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearEnquiryError: (state) => {
      state.error = null;
    },
    clearSingleEnquiry: (state) => {
      state.singleEnquiry = null;
    },
  },

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
      .addCase(getEnquiryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEnquiryById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleEnquiry = action.payload;
      })
      .addCase(getEnquiryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateEnquiry.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries = state.enquiries.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteEnquiry.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries = state.enquiries.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEnquiryError, clearSingleEnquiry } = enquirySlice.actions;

export default enquirySlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ================= CREATE ================= */

export const createAgsPayment = createAsyncThunk(
  "agsPayment/create",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/ags-payment/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(
        createActivityLogThunk({
          user_id: formData?.user_id || null,
          message: `AGS Payment Created (${res.data.data.registration_no})`,
          link: `${import.meta.env.VITE_API_FRONT_URL}/ags-payment`,
          section: "AGS Payment",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const previewRegistrationNo = createAsyncThunk(
  "agsPayment/previewRegistration",
  async (Seminar_day, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        `/ags-payment/preview-registration?Seminar_day=${encodeURIComponent(Seminar_day)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.registration_no;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= GET ALL ================= */

export const getAllAgsPayments = createAsyncThunk(
  "agsPayment/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/ags-payment");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= GET BY ID ================= */

export const getAgsPaymentById = createAsyncThunk(
  "agsPayment/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/ags-payment/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= UPDATE ================= */

export const updateAgsPayment = createAsyncThunk(
  "agsPayment/update",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.put(
        `/ags-payment/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(
        createActivityLogThunk({
          user_id: formData?.user_id || null,
          message: `AGS Payment Updated (${res.data.data.registration_no})`,
          link: `${import.meta.env.VITE_API_FRONT_URL}/ags-payment`,
          section: "AGS Payment",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= DELETE ================= */

export const deleteAgsPayment = createAsyncThunk(
  "agsPayment/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/ags-payment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "AGS Payment Deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/ags-payment`,
          section: "AGS Payment",
        })
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= SLICE ================= */

const agsPaymentSlice = createSlice({
  name: "agsPayment",
  initialState: {
    payments: [],
    previewRegistration: "",
    singlePayment: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPreviewRegistration: (state) => {
      state.previewRegistration = "";
    },
  },
  extraReducers: (builder) => {
    builder

      // CREATE
      .addCase(createAgsPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAgsPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.unshift(action.payload);
      })
      .addCase(createAgsPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllAgsPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAgsPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(getAllAgsPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getAgsPaymentById.fulfilled, (state, action) => {
        state.singlePayment = action.payload;
      })

      // UPDATE
      .addCase(updateAgsPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAgsPayment.fulfilled, (state, action) => {
        const index = state.payments.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      })
        .addCase(updateAgsPayment.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

      // DELETE
      .addCase(deleteAgsPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAgsPayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteAgsPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(previewRegistrationNo.pending, (state) => {
        state.previewRegistration = null;
      })
      .addCase(previewRegistrationNo.fulfilled, (state, action) => {
  state.previewRegistration = action.payload;
})
      .addCase(previewRegistrationNo.rejected, (state, action) => {
        state.error = action.payload      
      });
  },
});

export const { clearPreviewRegistration } = agsPaymentSlice.actions;
export default agsPaymentSlice.reducer;

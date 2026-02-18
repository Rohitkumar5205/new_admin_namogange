import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ================= CREATE ================= */

export const createClientStatus = createAsyncThunk(
  "clientStatus/create",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/client-status/create", formData);

      dispatch(
        createActivityLogThunk({
          user_id: formData?.user_id || null,
          message: "Client status created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/client/client-details/${formData.client_id}`,
          section: "Client Status",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= GET ALL ================= */

export const getAllClientStatuses = createAsyncThunk(
  "clientStatus/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/client-status");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= GET BY CLIENT ID ================= */

export const getClientStatusByClientId = createAsyncThunk(
  "clientStatus/getByClientId",
  async (clientId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/client-status/client/${clientId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= UPDATE ================= */

export const updateClientStatus = createAsyncThunk(
  "clientStatus/update",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/client-status/${id}`, formData);

      dispatch(
        createActivityLogThunk({
          user_id: formData?.user_id || null,
          message: "Client status updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/client/client-details/${formData.client_id}`,
          section: "Client Status",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= DELETE ================= */

export const deleteClientStatus = createAsyncThunk(
  "clientStatus/delete",
  async ({ id, user_id, client_id }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/client-status/${id}`);

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Client status deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/client/client-details/${client_id}`,
          section: "Client Status",
        })
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= SLICE ================= */

const clientStatusSlice = createSlice({
  name: "clientStatus",
  initialState: {
    clientStatuses: [],
    singleClientStatuses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createClientStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(createClientStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.clientStatuses.unshift(action.payload);
      })
      .addCase(createClientStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllClientStatuses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllClientStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.clientStatuses = action.payload;
      })
      .addCase(getAllClientStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET BY CLIENT ID */
      .addCase(getClientStatusByClientId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClientStatusByClientId.fulfilled, (state, action) => {
        state.loading = false;
        state.singleClientStatuses = action.payload;
      })
      .addCase(getClientStatusByClientId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
        .addCase(updateClientStatus.pending, (state) => {
          state.loading = true;
        })
      .addCase(updateClientStatus.fulfilled, (state, action) => {
        const index = state.clientStatuses.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.clientStatuses[index] = action.payload;
        }
      })
      .addCase(updateClientStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
       })

      /* DELETE */
        .addCase(deleteClientStatus.pending, (state) => {
          state.loading = true;
        })
      .addCase(deleteClientStatus.fulfilled, (state, action) => {
        state.clientStatuses = state.clientStatuses.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteClientStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
  });
  },
});

export default clientStatusSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

// Fetch all AGS delegates
export const fetchAgsDelegates = createAsyncThunk(
  "agsDelegates/fetchAgsDelegates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/ags-delegates");
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create a new AGS delegate
export const createAgsDelegate = createAsyncThunk(
  "agsDelegates/createAgsDelegate",
  async (formData, {dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      const response = await api.post("/ags-delegates/create", formData, {
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const userId = formData.get("user_id");
              console.log("Dispatching activity log for user ID:", userId, "with formData:", formData);

      if (userId) {
        console.log("Dispatching activity log for user ID:", userId);
        dispatch(
          createActivityLogThunk({
            user_id: userId,
            message: "AGS Delegate created",
            link: `${import.meta.env.VITE_API_FRONT_URL}/ags-delegates/list`,
            section: "AGS Delegates",
          })
        );
      }
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch a single AGS delegate by ID
export const getAgsDelegateById = createAsyncThunk(
  "agsDelegates/getAgsDelegateById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/ags-delegates/${id}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update an AGS delegate
export const updateAgsDelegate = createAsyncThunk(
  "agsDelegates/updateAgsDelegate",
  async ({ id, formData }, {dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      const response = await api.put(`/ags-delegates/${id}`, formData, {
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const userId = formData.get("user_id");
      if (userId) {
        dispatch(
          createActivityLogThunk({
            user_id: userId,
            message: "AGS Delegate updated",
            link: `${import.meta.env.VITE_API_FRONT_URL}/ags-delegates/list`,
            section: "AGS Delegates",
          })
        );
      }
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete an AGS delegate
export const deleteAgsDelegate = createAsyncThunk(
  "agsDelegates/deleteAgsDelegate",
  async ({id, user_id}, {dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");    
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      await api.delete(`/ags-delegates/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (user_id) {
        dispatch(
          createActivityLogThunk({
            user_id: user_id,
            message: "AGS Delegate deleted",
            link: `${import.meta.env.VITE_API_FRONT_URL}/ags-delegates/list`,
            section: "AGS Delegates",
          })
        );
      }
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const agsDelegateSlice = createSlice({
  name: "agsDelegate",
  initialState: {
    delegates: [],
    singleDelegate: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAgsDelegateError: (state) => {
      state.error = null;
    },
    clearSingleAgsDelegate: (state) => {
      state.singleDelegate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAgsDelegates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAgsDelegates.fulfilled, (state, action) => {
        state.loading = false;
        state.delegates = action.payload;
      })
      .addCase(fetchAgsDelegates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createAgsDelegate.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAgsDelegate.fulfilled, (state, action) => {
        state.loading = false;
        state.delegates.unshift(action.payload);
      })
      .addCase(createAgsDelegate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get By ID
      .addCase(getAgsDelegateById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAgsDelegateById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleDelegate = action.payload;
      })
      .addCase(getAgsDelegateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateAgsDelegate.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAgsDelegate.fulfilled, (state, action) => {
        state.loading = false;
        state.delegates = state.delegates.map((delegate) =>
          delegate._id === action.payload._id ? action.payload : delegate
        );
      })
      .addCase(updateAgsDelegate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteAgsDelegate.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAgsDelegate.fulfilled, (state, action) => {
        state.loading = false;
        state.delegates = state.delegates.filter(
          (delegate) => delegate._id !== action.payload
        );
      })
      .addCase(deleteAgsDelegate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAgsDelegateError, clearSingleAgsDelegate } =
  agsDelegateSlice.actions;

export default agsDelegateSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE EVENT
============================== */
export const createAGSEvent = createAsyncThunk(
  "agsEvent/create",
  async (data, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.post("/ags-events/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id: data.get("user_id"),
          message: "Event created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/ags-events`,
          section: "Event",
        })
      );

      return res.data.data; // ✅ VERY IMPORTANT
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   GET ALL EVENTS
============================== */
export const getAllAGSEvents = createAsyncThunk(
  "agsEvent/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/ags-events");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   GET EVENT BY ID
============================== */
export const getAGSEventById = createAsyncThunk(
  "agsEvent/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/ags-events/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   UPDATE EVENT
============================== */
export const updateAGSEvent = createAsyncThunk(
  "agsEvent/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.put(`/ags-events/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: data.get("user_id"),
          message: "Event updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/ags-events`,
          section: "Event",
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   DELETE EVENT
============================== */
export const deleteAGSEvent = createAsyncThunk(
  "agsEvent/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      await api.delete(`/ags-events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Event deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/ags-events`,
          section: "Event",
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
const agsEventSlice = createSlice({
  name: "agsEvent",
  initialState: {
    agsEvents: [],
    singleEvent: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createAGSEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAGSEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.agsEvents.unshift(action.payload);
      })
      .addCase(createAGSEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllAGSEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAGSEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.agsEvents = action.payload;
      })
      .addCase(getAllAGSEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET BY ID */
      .addCase(getAGSEventById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAGSEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleEvent = action.payload;
      })
      .addCase(getAGSEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateAGSEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.agsEvents = state.agsEvents.map((e) =>
          e._id === action.payload._id ? action.payload : e
        );
      })

      /* DELETE */
      .addCase(deleteAGSEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.agsEvents = state.agsEvents.filter((e) => e._id !== action.payload);
      });
  },
});

export default agsEventSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE EVENT
============================== */
export const createEvent = createAsyncThunk(
  "event/create",
  async (data, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.post("/events/create", data, {
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
          link: `${import.meta.env.VITE_API_FRONT_URL}/events`,
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
export const getAllEvents = createAsyncThunk(
  "event/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/events");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   GET EVENT BY ID
============================== */
export const getEventById = createAsyncThunk(
  "event/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/events/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   UPDATE EVENT
============================== */
export const updateEvent = createAsyncThunk(
  "event/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.put(`/events/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: data.get("user_id"),
          message: "Event updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/events`,
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
export const deleteEvent = createAsyncThunk(
  "event/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      await api.delete(`/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Event deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/events`,
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
const eventSlice = createSlice({
  name: "event",
  initialState: {
    events: [],
    singleEvent: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET BY ID */
      .addCase(getEventById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleEvent = action.payload;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.map((e) =>
          e._id === action.payload._id ? action.payload : e
        );
      })

      /* DELETE */
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter((e) => e._id !== action.payload);
      });
  },
});

export default eventSlice.reducer;

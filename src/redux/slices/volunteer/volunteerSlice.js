import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ===============================
   CREATE VOLUNTEER
================================ */
export const createVolunteer = createAsyncThunk(
  "volunteer/create",
  async (formData, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }

    try {
      const res = await api.post("/volunteers/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const userId = formData.get("user_id");
      if (userId) {
        dispatch(
          createActivityLogThunk({
            user_id: userId,
            message: "New volunteer created",
            section: "Volunteer Management",
            link: `${import.meta.env.VITE_API_FRONT_URL}/volunteer/add-volunteer`,
          })
        );
      }

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   GET ALL VOLUNTEERS
================================ */
export const getAllVolunteers = createAsyncThunk(
  "volunteer/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/volunteers");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   GET VOLUNTEER BY ID
================================ */
export const getVolunteerById = createAsyncThunk(
  "volunteer/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/volunteers/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   UPDATE VOLUNTEER
================================ */
export const updateVolunteer = createAsyncThunk(
  "volunteer/update",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }

    try {
      const res = await api.put(`/volunteers/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const userId = formData.get("user_id");
      if (userId) {
        dispatch(
          createActivityLogThunk({
            user_id: userId,
            message: "Volunteer updated",
            section: "Volunteer Management",
            link: `${import.meta.env.VITE_API_FRONT_URL}/volunteer/edit-volunteer/${id}`,
          })
        );
      }

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   DELETE VOLUNTEER
================================ */
export const deleteVolunteer = createAsyncThunk(
  "volunteer/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }

    try {
      await api.delete(`/volunteers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (user_id) {
        dispatch(
          createActivityLogThunk({
            user_id,
            message: "Volunteer deleted",
            section: "Volunteer Management",
            link: `${import.meta.env.VITE_API_FRONT_URL}/volunteer/volunteer-list`,
          })
        );
      }

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   SLICE
================================ */
const volunteerSlice = createSlice({
  name: "volunteer",
  initialState: {
    volunteers: [],
    singleVolunteer: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearVolunteerError: (state) => {
      state.error = null;
    },
    clearSingleVolunteer: (state) => {
      state.singleVolunteer = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createVolunteer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVolunteer.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteers.unshift(action.payload);
      })
      .addCase(createVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllVolunteers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllVolunteers.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteers = action.payload;
      })
      .addCase(getAllVolunteers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET BY ID */
      .addCase(getVolunteerById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVolunteerById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleVolunteer = action.payload;
      })
      .addCase(getVolunteerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateVolunteer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVolunteer.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteers = state.volunteers.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteVolunteer.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteVolunteer.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteers = state.volunteers.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearVolunteerError,
  clearSingleVolunteer,
} = volunteerSlice.actions;

export default volunteerSlice.reducer;

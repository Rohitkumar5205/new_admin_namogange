import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ==============================
   CREATE NEWSLETTER
============================== */
export const createNewsLetter = createAsyncThunk(
  "newsletter/create",
  async (formData, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.post("/newsletters/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: formData.get("user_id"),
          message: "Newsletter created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/newsletters`,
          section: "Newsletter",
          data: {
            action: "CREATE",
            entity: "Newsletter",
            entity_id: res.data.data,
          },
        }),
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

/* ==============================
   GET ALL NEWSLETTERS
============================== */
export const getAllNewsLetters = createAsyncThunk(
  "newsletter/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/newsletters");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

/* ==============================
   GET SINGLE NEWSLETTER
============================== */
export const getNewsLetterById = createAsyncThunk(
  "newsletter/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/newsletters/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

/* ==============================
   UPDATE NEWSLETTER
============================== */
export const updateNewsLetter = createAsyncThunk(
  "newsletter/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.put(`/newsletters/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: data.get("user_id"),
          message: "Newsletter updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/newsletters`,
          section: "Newsletter",
          data: {
            action: "UPDATE",
            entity: "Newsletter",
            entity_id: res.data.data,
          },
        }),
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

/* ==============================
   DELETE NEWSLETTER
============================== */
export const deleteNewsLetter = createAsyncThunk(
  "newsletter/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      await api.delete(`/newsletters/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Newsletter deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/newsletters`,
          section: "Newsletter",
          data: {
            action: "DELETE",
            entity: "Newsletter",
            entity_id: id,
          },
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
const newsLetterSlice = createSlice({
  name: "newsletter",
  initialState: {
    newsletters: [],
    single: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetSingleNewsLetter: (state) => {
      state.single = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createNewsLetter.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewsLetter.fulfilled, (state, action) => {
        state.loading = false;
        state.newsletters.unshift(action.payload);
      })
      .addCase(createNewsLetter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllNewsLetters.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllNewsLetters.fulfilled, (state, action) => {
        state.loading = false;
        state.newsletters = action.payload;
      })
      .addCase(getAllNewsLetters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ONE */
      .addCase(getNewsLetterById.fulfilled, (state, action) => {
        state.single = action.payload;
      })

      /* UPDATE */
      .addCase(updateNewsLetter.fulfilled, (state, action) => {
        state.loading = false;
        state.newsletters = state.newsletters.map((item) =>
          item._id === action.payload._id ? action.payload : item,
        );
      })

      /* DELETE */
      .addCase(deleteNewsLetter.fulfilled, (state, action) => {
        state.newsletters = state.newsletters.filter(
          (item) => item._id !== action.payload,
        );
      });
  },
});

export const { resetSingleNewsLetter } = newsLetterSlice.actions;
export default newsLetterSlice.reducer;

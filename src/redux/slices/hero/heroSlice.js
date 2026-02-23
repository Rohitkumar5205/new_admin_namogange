import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

// ==============================
// 1️⃣ CREATE HERO
// ==============================
export const createHero = createAsyncThunk(
  "hero/create",
  async (formData, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.post("/heroes/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔥 Activity Log
      dispatch(
        createActivityLogThunk({
          user_id: formData.get("user_id"),
          message: "Hero created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/heroes`,
          section: "Hero",
          data: {
            action: "CREATE",
            entity: "Hero",
            new_data: res.data.data,
          },
        }),
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ==============================
// 2️⃣ GET ALL HEROES
// ==============================
export const getAllHeroes = createAsyncThunk(
  "hero/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/heroes");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ==============================
// 3️⃣ GET HERO BY ID
// ==============================
export const getHeroById = createAsyncThunk(
  "hero/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/heroes/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ==============================
// 4️⃣ UPDATE HERO
// ==============================
export const updateHero = createAsyncThunk(
  "hero/update",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.put(`/heroes/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: formData.get("user_id"),
          message: "Hero updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/heroes`,
          section: "Hero",
          data: {
            action: "UPDATE",
            entity: "Hero",
            new_data: res.data.data,
          },
        }),
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ==============================
// 5️⃣ DELETE HERO
// ==============================
export const deleteHero = createAsyncThunk(
  "hero/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token provided");

    try {
      const res = await api.delete(`/heroes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Hero deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/heroes`,
          section: "Hero",
          data: {
            action: "DELETE",
            entity: "Hero",
            deleted_data: res.data.data,
          },
        }),
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ==============================
// SLICE
// ==============================
const heroSlice = createSlice({
  name: "hero",
  initialState: {
    heroes: [],
    singleHero: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createHero.pending, (state) => {
        state.loading = true;
      })
      .addCase(createHero.fulfilled, (state, action) => {
        state.loading = false;
        state.heroes.unshift(action.payload);
      })
      .addCase(createHero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllHeroes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllHeroes.fulfilled, (state, action) => {
        state.loading = false;
        state.heroes = action.payload;
      })
      .addCase(getAllHeroes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getHeroById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHeroById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleHero = action.payload;
      })
      .addCase(getHeroById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateHero.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateHero.fulfilled, (state, action) => {
        state.loading = false;
        state.heroes = state.heroes.map((h) =>
          h._id === action.payload._id ? action.payload : h,
        );
      })
      .addCase(updateHero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteHero.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteHero.fulfilled, (state, action) => {
        state.loading = false;
        state.heroes = state.heroes.filter((h) => h._id !== action.payload);
      })
      .addCase(deleteHero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default heroSlice.reducer;

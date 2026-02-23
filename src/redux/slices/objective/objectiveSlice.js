import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* GET ALL */
export const fetchObjectives = createAsyncThunk(
  "objectives/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/objectives");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

/* CREATE */
export const createObjectiveThunk = createAsyncThunk(
  "objectives/create",
  async (formData, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      const res = await api.post("/objectives/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔹 activity log
      dispatch(
        createActivityLogThunk({
          user_id: formData.get("user_id"),
          message: "Objective created",
          link: `${import.meta.env.VITE_API_FRONT_URL}/objective`,
          section: "Objective",
          data: {
            action: "CREATE",
            entity: "Objective",
            new_data: res.data.data,
          },
        }),
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

/* UPDATE */
export const updateObjectiveThunk = createAsyncThunk(
  "objectives/update",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      const res = await api.put(`/objectives/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(
        createActivityLogThunk({
          user_id: formData.get("user_id"),
          message: "Objective updated",
          link: `${import.meta.env.VITE_API_FRONT_URL}/objective`,
          section: "Objective",
          data: {
            action: "UPDATE",
            entity: "Objective",
            new_data: res.data.data,
          },
        }),
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

/* DELETE */
export const deleteObjectiveThunk = createAsyncThunk(
  "objectives/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      await api.delete(`/objectives/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Objective deleted",
          link: `${import.meta.env.VITE_API_FRONT_URL}/objective`,
          section: "Objective",
          data: {
            action: "DELETE",
            entity: "Objective",
            deleted_data: id,
          },
        }),
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

const objectiveSlice = createSlice({
  name: "objectives",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchObjectives.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchObjectives.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchObjectives.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CREATE */
      .addCase(createObjectiveThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createObjectiveThunk.fulfilled, (state, action) => {
        state.data.unshift(action.payload);
      })
      .addCase(createObjectiveThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateObjectiveThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateObjectiveThunk.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(updateObjectiveThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* DELETE */
      .addCase(deleteObjectiveThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteObjectiveThunk.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteObjectiveThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default objectiveSlice.reducer;

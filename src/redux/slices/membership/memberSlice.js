import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

/* ===============================
   CREATE MEMBER
================================ */
export const createMember = createAsyncThunk(
  "member/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/members/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   GET ALL MEMBERS
================================ */
export const getAllMembers = createAsyncThunk(
  "member/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/members");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   GET MEMBER BY ID
================================ */
export const getMemberById = createAsyncThunk(
  "member/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/members/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   UPDATE MEMBER
================================ */
export const updateMember = createAsyncThunk(
  "member/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/members/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   DELETE MEMBER
================================ */
export const deleteMember = createAsyncThunk(
  "member/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/members/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===============================
   SLICE
================================ */
const memberSlice = createSlice({
  name: "member",
  initialState: {
    members: [],
    singleMember: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearMemberError: (state) => {
      state.error = null;
    },
    clearSingleMember: (state) => {
      state.singleMember = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members.unshift(action.payload);
      })
      .addCase(createMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(getAllMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(getAllMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET BY ID */
      .addCase(getMemberById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMemberById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleMember = action.payload;
      })
      .addCase(getMemberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members = state.members.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members = state.members.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMemberError, clearSingleMember } =
  memberSlice.actions;

export default memberSlice.reducer;

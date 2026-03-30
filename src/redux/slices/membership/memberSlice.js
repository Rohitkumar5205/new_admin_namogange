import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* ===============================
   CREATE MEMBER
================================ */
export const createMember = createAsyncThunk(
  "member/create",
  async (formData, { dispatch, rejectWithValue }) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      const res = await api.post("/members/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(
        createActivityLogThunk({
          user_id: formData.get("user_id"),
          message: "New member created",
          section: "Member Management",
          link: `${import.meta.env.VITE_API_FRONT_URL}/member/member-create`,
        }),
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
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
  },
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
  },
);

/* ===============================
   UPDATE MEMBER
================================ */
export const updateMember = createAsyncThunk(
  "member/update",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      const res = await api.put(`/members/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(
        createActivityLogThunk({
          user_id: formData.get("user_id"),
          message: "Member updated",
          section: "Member Management",
          link: `${import.meta.env.VITE_API_FRONT_URL}/member/edit-member/${id}`,
        }),
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

/* ===============================
   DELETE MEMBER
================================ */
export const deleteMember = createAsyncThunk(
  "member/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      await api.delete(`/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Member deleted",
          section: "Member Management",
          link: `${import.meta.env.VITE_API_FRONT_URL}/member/member-list`,
        }),
      );
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
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
          item._id === action.payload._id ? action.payload : item,
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
          (item) => item._id !== action.payload,
        );
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMemberError, clearSingleMember } = memberSlice.actions;

export default memberSlice.reducer;

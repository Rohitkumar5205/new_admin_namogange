import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* GET ALL */
export const getAllDonations = createAsyncThunk(
  "donation/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/donations");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* CREATE */
export const createDonation = createAsyncThunk(
  "donation/create",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/donations", formData);

      // Activity log
      dispatch(
        createActivityLogThunk({
          user_id: formData.user_id,
          message: "Donation added successfully",
          link: `/donation/donation-list`,
          section: "Donation",
          data: {
            action: "CREATE",
            entity: "Donation",
            new_data: res.data.data,
          },
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* UPDATE */
export const updateDonation = createAsyncThunk(
  "donation/update",
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/donations/${id}`, formData);

      // Activity log
      dispatch(
        createActivityLogThunk({
          user_id: formData.user_id,
          message: "Donation updated successfully",
          link: `/donation/donation-list`,
          section: "Donation",
          data: {
            action: "UPDATE",
            entity: "Donation",
            new_data: res.data.data,
          },
        })
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* DELETE */
export const deleteDonation = createAsyncThunk(
  "donation/delete",
  async ({ id, user_id }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/donations/${id}`);

      // Activity log
      dispatch(
        createActivityLogThunk({
          user_id,
          message: "Donation deleted successfuly",
          link: `/donation/donation-list`,
          section: "Donation",
          data: {
            action: "DELETE",
            entity: "Donation",
            deleted_id: id,
          },
        })
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const donationSlice = createSlice({
  name: "donation",
  initialState: {
    donations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(getAllDonations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.donations = action.payload;
      })
      .addCase(getAllDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* CREATE */
      .addCase(createDonation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDonation.fulfilled, (state, action) => {
        state.loading = false;
        state.donations.unshift(action.payload);
      })
      .addCase(createDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* UPDATE */
      .addCase(updateDonation.fulfilled, (state, action) => {
        const index = state.donations.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) state.donations[index] = action.payload;
      })
      /* DELETE */
      .addCase(deleteDonation.fulfilled, (state, action) => {
        state.donations = state.donations.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export default donationSlice.reducer;

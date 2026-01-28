import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

export const createEnquiryList = createAsyncThunk(
    "enquiryList/create",
    async (formData, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.post("/enquire-list/create", formData);
            dispatch(
                createActivityLogThunk({
                    user_id: formData?.user_id || null,
                    message: "Enquiry created",
                    link: `${import.meta.env.VITE_API_FRONT_URL}/enquiry-list`,
                    section: "Enquiry",
                })
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const getAllEnquiryLists = createAsyncThunk(
    "enquiryList/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/enquire-list");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const getEnquiryListById = createAsyncThunk(
    "enquiryList/getById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/enquire-list/${id}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateEnquiryList = createAsyncThunk(
    "enquiryList/update",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/enquire-list/${id}`, formData);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteEnquiryList = createAsyncThunk(
    "enquiryList/delete",
    async ({ id, user_id }, { dispatch, rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) return rejectWithValue("No token provided");
        try {
            await api.delete(`/enquire-list/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            dispatch(
                createActivityLogThunk({
                    user_id,
                    message: "Enquiry deleted",
                    link: `${import.meta.env.VITE_API_FRONT_URL}/enquiry/enquiry-list`,
                    section: "Enquiry",
                })
            );
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const enquiryListSlice = createSlice({
    name: "enquiryList",
    initialState: {
        enquiries: [],
        singleEnquiry: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createEnquiryList.pending, (state) => {
                state.loading = true;
            })
            .addCase(createEnquiryList.fulfilled, (state, action) => {
                state.loading = false;
                state.enquiries.unshift(action.payload);
            })
            .addCase(createEnquiryList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get All
            .addCase(getAllEnquiryLists.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllEnquiryLists.fulfilled, (state, action) => {
                state.loading = false;
                state.enquiries = action.payload;
            })
            .addCase(getAllEnquiryLists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get By ID
            .addCase(getEnquiryListById.fulfilled, (state, action) => {
                state.singleEnquiry = action.payload;
            })
            // Update
            .addCase(updateEnquiryList.fulfilled, (state, action) => {
                const index = state.enquiries.findIndex(
                    (item) => item._id === action.payload._id
                );
                if (index !== -1) {
                    state.enquiries[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteEnquiryList.fulfilled, (state, action) => {
                state.enquiries = state.enquiries.filter(
                    (item) => item._id !== action.payload
                );
            });
    },
});

export default enquiryListSlice.reducer;
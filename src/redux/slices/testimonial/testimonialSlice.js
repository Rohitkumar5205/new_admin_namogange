import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* GET ALL */
export const fetchTestimonials = createAsyncThunk(
    "testimonials/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/testimonials");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

/* CREATE */
export const createTestimonialThunk = createAsyncThunk(
    "testimonials/create",
    async (formData, { dispatch, rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return rejectWithValue("No token provided");
        }
        try {
            const res = await api.post("/testimonials/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            // 🔹 activity log
            dispatch(
                createActivityLogThunk({
                    user_id: formData.get("user_id"),
                    message: "Testimonial created",
                    link: `${import.meta.env.VITE_API_FRONT_URL}/testimonial`,
                    section: "Testimonial",
                })
            );

            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

/* UPDATE */
export const updateTestimonialThunk = createAsyncThunk(
    "testimonials/update",
    async ({ id, formData }, { dispatch, rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return rejectWithValue("No token provided");
        }
        try {
            const res = await api.put(`/testimonials/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            dispatch(
                createActivityLogThunk({
                    user_id: formData.get("user_id"),
                    message: "Testimonial updated",
                    link: `${import.meta.env.VITE_API_FRONT_URL}/testimonial`,
                    section: "Testimonial",
                })
            );

            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

/* DELETE */
export const deleteTestimonialThunk = createAsyncThunk(
    "testimonials/delete",
    async ({ id, user_id }, { dispatch, rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return rejectWithValue("No token provided");
        }
        try {
            await api.delete(`/testimonials/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            dispatch(
                createActivityLogThunk({
                    user_id,
                    message: "Testimonial deleted",
                    link: `${import.meta.env.VITE_API_FRONT_URL}/testimonial`,
                    section: "Testimonial",
                })
            );

            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

const testimonialSlice = createSlice({
    name: "testimonials",
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            /* FETCH */
            .addCase(fetchTestimonials.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTestimonials.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchTestimonials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* CREATE */
            .addCase(createTestimonialThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(createTestimonialThunk.fulfilled, (state, action) => {
                state.data.unshift(action.payload);
            })
            .addCase(createTestimonialThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* UPDATE */
            .addCase(updateTestimonialThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateTestimonialThunk.fulfilled, (state, action) => {
                const index = state.data.findIndex(
                    (item) => item._id === action.payload._id
                );
                if (index !== -1) state.data[index] = action.payload;
            })
            .addCase(updateTestimonialThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            /* DELETE */
            .addCase(deleteTestimonialThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteTestimonialThunk.fulfilled, (state, action) => {
                state.data = state.data.filter((item) => item._id !== action.payload);
            })
            .addCase(deleteTestimonialThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default testimonialSlice.reducer;
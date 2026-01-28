import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../activityLog/activityLogSlice";

/* GET ALL */
export const getAllAchievements = createAsyncThunk(
    "achievements/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/achievements");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

/* CREATE */
export const createAchievement = createAsyncThunk(
    "achievements/create",
    async (formData, { dispatch, rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return rejectWithValue("No token provided");
        }
        try {
            const res = await api.post("/achievements/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            // 🔹 activity log
            dispatch(
                createActivityLogThunk({
                    user_id: formData.get("user_id"),
                    message: "Achievement created",
                    link: `${import.meta.env.VITE_API_FRONT_URL}/achievements`,
                    section: "Achievement",
                })
            );

            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

/* UPDATE */
export const updateAchievement = createAsyncThunk(
    "achievements/update",
    async ({ id, formData }, { dispatch, rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return rejectWithValue("No token provided");
        }
        try {
            const res = await api.put(`/achievements/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            dispatch(
                createActivityLogThunk({
                    user_id: formData.get("user_id"),
                    message: "Achievement updated",
                    link: `${import.meta.env.VITE_API_FRONT_URL}/achievements`,
                    section: "Achievement",
                })
            );

            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

/* DELETE */
export const deleteAchievement = createAsyncThunk(
    "achievements/delete",
    async ({ id, user_id }, { dispatch, rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return rejectWithValue("No token provided");
        }
        try {
            await api.delete(`/achievements/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            dispatch(
                createActivityLogThunk({
                    user_id,
                    message: "Achievement deleted",
                    link: `${import.meta.env.VITE_API_FRONT_URL}/achievements`,
                    section: "Achievement",
                })
            );

            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

const achievementSlice = createSlice({
    name: "achievements",
    initialState: {
        achievements: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            /* FETCH */
            .addCase(getAllAchievements.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllAchievements.fulfilled, (state, action) => {
                state.loading = false;
                state.achievements = action.payload;
            })
            .addCase(getAllAchievements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* CREATE */
            .addCase(createAchievement.pending, (state) => {
                state.loading = true;
            })
            .addCase(createAchievement.fulfilled, (state, action) => {
                state.loading = false;
                state.achievements.unshift(action.payload);
            })
            .addCase(createAchievement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* UPDATE */
            .addCase(updateAchievement.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateAchievement.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.achievements.findIndex(
                    (item) => item._id === action.payload._id
                );
                if (index !== -1) state.achievements[index] = action.payload;
            })
            .addCase(updateAchievement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            /* DELETE */
            .addCase(deleteAchievement.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteAchievement.fulfilled, (state, action) => {
                state.loading = false;
                state.achievements = state.achievements.filter(
                    (item) => item._id !== action.payload
                );
            })
            .addCase(deleteAchievement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default achievementSlice.reducer;
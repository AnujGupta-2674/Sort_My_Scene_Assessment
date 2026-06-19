import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/axios";

export const fetchEvents = createAsyncThunk(
    "event/fetchEvents",
    async (_, thunkAPI) => {
        try {
            const { data } = await api.get("/event");

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch events"
            );
        }
    }
);

export const fetchEventDetails = createAsyncThunk(
    "event/fetchEventDetails",
    async (eventId, thunkAPI) => {
        try {
            const { data } = await api.get(
                `/event/${eventId}`
            );

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch event details"
            );
        }
    }
);
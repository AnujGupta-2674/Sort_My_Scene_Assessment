import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/axios";

export const reserveSeats = createAsyncThunk(
    "booking/reserveSeats",
    async (payload, thunkAPI) => {
        try {
            const { data } = await api.post(
                "/reserve",
                payload
            );

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to reserve seats"
            );
        }
    }
);

export const getCurrentReservation =
    createAsyncThunk(
        "booking/getCurrentReservation",
        async (eventId, thunkAPI) => {
            try {
                const { data } = await api.get(
                    `/reservations/current/${eventId}`
                );

                return data;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message ||
                    "Failed to fetch reservation"
                );
            }
        }
    );

export const confirmBooking = createAsyncThunk(
    "booking/confirmBooking",
    async (reservationId, thunkAPI) => {
        try {
            const { data } = await api.post(
                "/bookings",
                {
                    reservationId,
                }
            );

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to confirm booking"
            );
        }
    }
);
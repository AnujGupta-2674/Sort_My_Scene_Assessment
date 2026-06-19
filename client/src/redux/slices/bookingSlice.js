import { createSlice } from "@reduxjs/toolkit";

import {
    reserveSeats,
    confirmBooking,
    getCurrentReservation
} from "../thunks/bookingThunk";

const initialState = {
    selectedSeats: [],
    reservation: null,
    booking: null,
    loading: false,
    error: null,
    hasActiveReservation: false,
};

const bookingSlice = createSlice({
    name: "booking",

    initialState,

    reducers: {
        toggleSeatSelection: (
            state,
            action
        ) => {
            const seatId = action.payload;

            const exists =
                state.selectedSeats.includes(
                    seatId
                );

            if (exists) {
                state.selectedSeats =
                    state.selectedSeats.filter(
                        (id) => id !== seatId
                    );
            } else {
                state.selectedSeats.push(
                    seatId
                );
            }
        },

        clearSelectedSeats: (state) => {
            state.selectedSeats = [];
        },

        clearReservation: (state) => {
            state.reservation = null;
        },

        resetBookingState: (state) => {
            state.selectedSeats = [];
            state.reservation = null;
            state.booking = null;
            state.hasActiveReservation = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // RESERVE SEATS

            .addCase(
                reserveSeats.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                reserveSeats.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.reservation =
                        action.payload.data;
                }
            )

            .addCase(
                reserveSeats.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )

            // CONFIRM BOOKING

            .addCase(
                confirmBooking.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                confirmBooking.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.booking = action.payload.data;

                    state.selectedSeats = [];

                    state.reservation = null;
                }
            )

            .addCase(
                confirmBooking.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )

            //Active Reservation Check
            .addCase(
                getCurrentReservation.fulfilled,
                (state, action) => {
                    state.hasActiveReservation =
                        !!action.payload.data;

                    if (action.payload.data) {
                        state.reservation =
                            action.payload.data;
                    }
                }
            );
    },
});

export const {
    toggleSeatSelection,
    clearSelectedSeats,
    clearReservation,
    resetBookingState,
} = bookingSlice.actions;

export default bookingSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

import {
    fetchEvents,
    fetchEventDetails,
} from "../thunks/eventThunk";

const initialState = {
    featuredEvents: [],
    events: [],
    selectedEvent: null,
    seatLayout: [],
    loading: false,
    error: null,
};

const eventSlice = createSlice({
    name: "event",

    initialState,

    reducers: {
        clearSelectedEvent: (state) => {
            state.selectedEvent = null;
            state.seatLayout = [];
        },
    },

    extraReducers: (builder) => {
        builder

            // FETCH EVENTS

            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(
                fetchEvents.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.featuredEvents = action.payload.data.featuredEvents;

                    state.events = action.payload.data.events;
                }
            )

            .addCase(
                fetchEvents.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )

            // FETCH EVENT DETAILS

            .addCase(
                fetchEventDetails.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                fetchEventDetails.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.selectedEvent = action.payload.data.event;

                    state.seatLayout = action.payload.data.seatLayout;
                }
            )

            .addCase(
                fetchEventDetails.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    },
});

export const {
    clearSelectedEvent,
} = eventSlice.actions;

export default eventSlice.reducer;
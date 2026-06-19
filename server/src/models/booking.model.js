import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true,
        },

        reservationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reservation",
            required: true,
        },

        seatIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Seat",
                required: true,
            },
        ],

        bookingStatus: {
            type: String,
            enum: ["confirmed", "cancelled"],
            default: "confirmed",
        },

        bookedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

bookingSchema.index({
    userId: 1,
    bookedAt: -1,
});

export const Booking = mongoose.model(
    "Booking",
    bookingSchema
);
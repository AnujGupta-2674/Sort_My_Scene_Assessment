import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
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

        seatIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Seat",
                required: true,
            },
        ],

        expiresAt: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["active", "completed", "expired"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

reservationSchema.index({
    userId: 1,
    eventId: 1,
});

reservationSchema.index({
    expiresAt: 1,
});

export const Reservation = mongoose.model(
    "Reservation",
    reservationSchema
);
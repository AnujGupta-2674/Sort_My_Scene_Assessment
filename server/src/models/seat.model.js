import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true,
        },

        seatNumber: {
            type: String,
            required: true,
            trim: true,
        },

        row: {
            type: String,
            required: true,
        },

        column: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["available", "reserved", "booked"],
            default: "available",
        },

        reservationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reservation",
            default: null,
        },

        reservedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        reservationExpiresAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

seatSchema.index(
    {
        eventId: 1,
        seatNumber: 1,
    },
    {
        unique: true,
    }
);

seatSchema.index({
    eventId: 1,
    status: 1,
});

export const Seat = mongoose.model("Seat", seatSchema);
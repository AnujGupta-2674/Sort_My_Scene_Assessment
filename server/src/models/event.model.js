import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        venue: {
            type: String,
            required: true,
            trim: true,
        },

        dateTime: {
            type: Date,
            required: true,
        },

        totalSeats: {
            type: Number,
            required: true,
            min: 1,
        },

        availableSeats: {
            type: Number,
            default: 0,
        },

        bookedSeats: {
            type: Number,
            default: 0,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: ["published", "cancelled"],
            default: "published",
        },
    },
    {
        timestamps: true,
    }
);

eventSchema.index({
    isFeatured: 1,
    dateTime: 1,
});

export const Event = mongoose.model("Event", eventSchema);
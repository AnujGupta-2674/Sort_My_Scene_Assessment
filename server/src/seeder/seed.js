import mongoose from "mongoose";
import dotenv from "dotenv";

import { Event } from "../models/event.model.js";
import { Seat } from "../models/seat.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const eventNames = [
    "Coldplay Live",
    "Music Festival",
    "Standup Night",
    "Tech Summit",
    "Cricket Screening",
    "Gaming Expo",
    "Startup Meetup",
    "Food Carnival",
    "Comedy Show",
    "Rock Concert",
];

const events = [];

for (let i = 0; i < 10; i++) {
    events.push({
        name: eventNames[i],
        description: `${eventNames[i]} Description`,
        venue: `Venue ${i + 1}`,
        dateTime: new Date(
            Date.now() + i * 24 * 60 * 60 * 1000
        ),
        totalSeats: 6,
        availableSeats: 6,
        bookedSeats: 0,
        reservedSeats: 0,
        isFeatured: i < 3,
        status: "published",
    });
}

const createdEvents = await Event.insertMany(
    events
);

const seats = [];

for (const event of createdEvents) {
    seats.push(
        {
            eventId: event._id,
            seatNumber: "A1",
            row: "A",
            column: 1,
        },
        {
            eventId: event._id,
            seatNumber: "A2",
            row: "A",
            column: 2,
        },
        {
            eventId: event._id,
            seatNumber: "A3",
            row: "A",
            column: 3,
        },
        {
            eventId: event._id,
            seatNumber: "B1",
            row: "B",
            column: 1,
        },
        {
            eventId: event._id,
            seatNumber: "B2",
            row: "B",
            column: 2,
        },
        {
            eventId: event._id,
            seatNumber: "B3",
            row: "B",
            column: 3,
        }
    );
}

await Seat.insertMany(seats);

console.log("Database Seeded Successfully");

process.exit(0);
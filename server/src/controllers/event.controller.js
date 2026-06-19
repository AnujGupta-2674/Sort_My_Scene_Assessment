import { validationResult } from "express-validator";
import { Event } from "../models/event.model.js";
import { Seat } from "../models/seat.model.js";
import { Reservation } from "../models/reservation.model.js";
import { Booking } from "../models/booking.model.js";
import mongoose from "mongoose";

export const createEvent = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const {
            name,
            description,
            venue,
            dateTime,
            featured,
            rows,
            columns,
        } = req.body;

        const totalSeats = rows * columns;

        const event = await Event.create({
            name,
            description,
            venue,
            dateTime,
            featured,
            totalSeats,
            availableSeats: totalSeats,
        });

        const seats = [];

        for (let row = 0; row < rows; row++) {
            const rowLetter = String.fromCharCode(65 + row);

            for (let col = 1; col <= columns; col++) {
                seats.push({
                    eventId: event._id,
                    seatNumber: `${rowLetter}${col}`,
                    row: rowLetter,
                    column: col,
                });
            }
        }

        await Seat.insertMany(seats);

        return res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: event,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getEvents = async (req, res) => {
    try {
        const [result] = await Event.aggregate([
            {
                $match: {
                    status: "published",
                },
            },
            {
                $facet: {
                    featuredEvents: [
                        {
                            $match: {
                                isFeatured: true,
                            },
                        },
                        {
                            $sort: {
                                dateTime: 1,
                            },
                        },
                    ],

                    events: [
                        {
                            $match: {
                                isFeatured: false,
                            },
                        },
                        {
                            $sort: {
                                dateTime: 1,
                            },
                        },
                    ],
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getEventDetails = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(
            eventId
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        const seatLayout = await Seat.aggregate([
            {
                $match: {
                    eventId: new mongoose.Types.ObjectId(eventId),
                },
            },
            {
                $sort: {
                    row: 1,
                    column: 1,
                },
            },
            {
                $group: {
                    _id: "$row",
                    seats: {
                        $push: {
                            _id: "$_id",
                            seatNumber: "$seatNumber",
                            status: "$status",
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    row: "$_id",
                    seats: 1,
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            data: {
                event,
                seatLayout,
            },
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

/**
 * Reserve seats for an event.
 *
 * Flow:
 * 1. Validate request payload.
 * 2. Start MongoDB transaction.
 * 3. Verify all requested seats are available.
 * 4. Create a reservation valid for 10 minutes.
 * 5. Mark seats as reserved.
 * 6. Commit transaction.
 *
 * @route POST /api/reserve
 * @access Private
 *
 * @param {Object} req
 * @param {Object} req.user - Authenticated user.
 * @param {String} req.body.eventId - Event identifier.
 * @param {String[]} req.body.seatIds - Array of selected seat ids.
 *
 * @param {Object} res
 *
 * @returns {Object} 201 - Reservation created successfully.
 * @returns {Object} 400 - Validation error or seats unavailable.
 * @returns {Object} 500 - Internal server error.
 */
// export const reserveSeats = async (req, res) => {
//     const session = await mongoose.startSession();

//     try {
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({
//                 success: false,
//                 errors: errors.array(),
//             });
//         }

//         session.startTransaction();

//         const { eventId, seatIds } = req.body;

//         const seats = await Seat.find({
//             _id: { $in: seatIds },
//             eventId,
//             status: "available",
//         }).session(session);

//         if (seats.length !== seatIds.length) {
//             await session.abortTransaction();

//             return res.status(400).json({
//                 success: false,
//                 message: "Some seats are no longer available",
//             });
//         }

//         const expiresAt = new Date(
//             Date.now() + 10 * 60 * 1000
//         );

//         const reservation = await Reservation.create(
//             [
//                 {
//                     userId: req.user._id,
//                     eventId,
//                     seatIds,
//                     expiresAt,
//                 },
//             ],
//             { session }
//         );

//         await Seat.updateMany(
//             {
//                 _id: { $in: seatIds },
//             },
//             {
//                 status: "reserved",
//                 reservationId: reservation[0]._id,
//                 reservationExpiresAt: expiresAt,
//             },
//             { session }
//         );

//         await session.commitTransaction();

//         return res.status(201).json({
//             success: true,
//             message: "Seats reserved successfully",
//             data: reservation[0],
//         });

//     } catch (error) {
//         await session.abortTransaction();

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });

//     } finally {
//         session.endSession();
//     }
// };
export const reserveSeats = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { eventId, seatIds } = req.body;

        const seats = await Seat.find({
            _id: { $in: seatIds },
            eventId,
            status: "available",
        });

        if (seats.length !== seatIds.length) {
            return res.status(400).json({
                success: false,
                message: "Some seats are no longer available",
            });
        }

        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        const reservation = await Reservation.create({
            userId: req.user._id,
            eventId,
            seatIds,
            expiresAt,
        });

        const updatedSeats = await Seat.updateMany(
            {
                _id: { $in: seatIds },
                status: "available",
            },
            {
                $set: {
                    status: "reserved",
                    reservationId: reservation._id,
                    reservationExpiresAt: expiresAt,
                },
            }
        );

        if (updatedSeats.modifiedCount !== seatIds.length) {
            await Reservation.findByIdAndDelete(
                reservation._id
            );

            return res.status(400).json({
                success: false,
                message: "Some seats were reserved by another user",
            });
        }

        return res.status(201).json({
            success: true,
            message: "Seats reserved successfully",
            data: reservation,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Confirm booking for a reserved seat selection.
 *
 * Flow:
 * 1. Validate request payload.
 * 2. Start MongoDB transaction.
 * 3. Verify reservation exists.
 * 4. Verify reservation belongs to current user.
 * 5. Verify reservation has not expired.
 * 6. Create booking record.
 * 7. Mark seats as booked.
 * 8. Mark reservation as completed.
 * 9. Commit transaction.
 *
 * @route POST /api/bookings
 * @access Private
 *
 * @param {Object} req
 * @param {Object} req.user - Authenticated user.
 * @param {String} req.body.reservationId - Reservation identifier.
 *
 * @param {Object} res
 *
 * @returns {Object} 201 - Booking created successfully.
 * @returns {Object} 404 - Reservation not found.
 * @returns {Object} 400 - Reservation expired.
 * @returns {Object} 500 - Internal server error.
 */
// export const createBooking = async (req, res) => {
//     const session = await mongoose.startSession();

//     try {
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(400).json({
//                 success: false,
//                 errors: errors.array(),
//             });
//         }

//         session.startTransaction();

//         const { reservationId } = req.body;

//         const reservation = await Reservation.findOne({
//             _id: reservationId,
//             userId: req.user._id,
//             status: "active",
//         }).session(session);

//         if (!reservation) {
//             await session.abortTransaction();

//             return res.status(404).json({
//                 success: false,
//                 message: "Reservation not found",
//             });
//         }

//         if (reservation.expiresAt < new Date()) {
//             await session.abortTransaction();

//             return res.status(400).json({
//                 success: false,
//                 message: "Reservation expired",
//             });
//         }

//         const booking = await Booking.create(
//             [
//                 {
//                     userId: reservation.userId,
//                     eventId: reservation.eventId,
//                     reservationId: reservation._id,
//                     seatIds: reservation.seatIds,
//                 },
//             ],
//             { session }
//         );

//         await Seat.updateMany(
//             {
//                 _id: {
//                     $in: reservation.seatIds,
//                 },
//             },
//             {
//                 status: "booked",
//                 reservationId: null,
//                 reservationExpiresAt: null,
//             },
//             { session }
//         );

//         reservation.status = "completed";

//         await reservation.save({
//             session,
//         });

//         await session.commitTransaction();

//         return res.status(201).json({
//             success: true,
//             message: "Booking successful",
//             data: booking[0],
//         });

//     } catch (error) {
//         await session.abortTransaction();

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });

//     } finally {
//         session.endSession();
//     }
// };
export const createBooking = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { reservationId } = req.body;

        const reservation = await Reservation.findOne({
            _id: reservationId,
            userId: req.user._id,
            status: "active",
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found",
            });
        }

        // Reservation Expired
        if (reservation.expiresAt < new Date()) {
            await Seat.updateMany(
                {
                    _id: {
                        $in: reservation.seatIds,
                    },
                },
                {
                    $set: {
                        status: "available",
                        reservationId: null,
                        reservationExpiresAt: null,
                    },
                }
            );

            reservation.status = "expired";
            await reservation.save();

            return res.status(400).json({
                success: false,
                message: "Reservation expired",
            });
        }

        // Verify seats are still reserved
        const reservedSeats = await Seat.countDocuments({
            _id: {
                $in: reservation.seatIds,
            },
            status: "reserved",
        });

        if (
            reservedSeats !==
            reservation.seatIds.length
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Some seats are no longer reserved",
            });
        }

        const booking = await Booking.create({
            userId: reservation.userId,
            eventId: reservation.eventId,
            reservationId: reservation._id,
            seatIds: reservation.seatIds,
        });

        await Seat.updateMany(
            {
                _id: {
                    $in: reservation.seatIds,
                },
            },
            {
                $set: {
                    status: "booked",
                    reservationId: null,
                    reservationExpiresAt: null,
                },
            }
        );

        reservation.status = "completed";

        await reservation.save();

        return res.status(201).json({
            success: true,
            message: "Booking successful",
            data: booking,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get current active reservation for an event.
 *
 * @route GET /api/v1/reservations/current/:eventId
 * @access Private
 */
export const getCurrentReservation = async (
    req,
    res
) => {
    try {
        const { eventId } = req.params;

        const reservation =
            await Reservation.findOne({
                userId: req.user._id,
                eventId,
                status: "active",
                expiresAt: {
                    $gt: new Date(),
                },
            }).sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,
            data: reservation,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
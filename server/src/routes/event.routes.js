import { Router } from "express";
import { body } from "express-validator";
import * as eventController from "../controllers/event.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/event/create",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Event name is required"),

    body("venue")
      .trim()
      .notEmpty()
      .withMessage("Venue is required"),

    body("dateTime")
      .notEmpty()
      .withMessage("Date & Time is required"),

    body("rows")
      .isInt({ min: 1 })
      .withMessage("Rows must be greater than 0"),

    body("columns")
      .isInt({ min: 1 })
      .withMessage("Columns must be greater than 0"),
  ],

  eventController.createEvent
);

router.get("/event", eventController.getEvents);

router.get("/event/:eventId", eventController.getEventDetails);

router.post(
  "/reserve",
  authMiddleware,
  [
    body("eventId")
      .notEmpty()
      .withMessage("Event ID is required"),

    body("seatIds")
      .isArray({ min: 1 })
      .withMessage("At least one seat must be selected"),
  ],
  eventController.reserveSeats
);

router.post(
  "/bookings",
  authMiddleware,
  [
    body("reservationId")
      .notEmpty()
      .withMessage("Reservation ID is required"),
  ],
  eventController.createBooking
);

router.get(
  "/reservations/current/:eventId",
  authMiddleware,
  eventController.getCurrentReservation
);

export default router;
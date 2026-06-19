import cron from "node-cron";
import { Reservation } from "../models/reservation.model.js";
import { Seat } from "../models/seat.model.js";

/**
 * Runs every minute.
 * Finds expired reservations and
 * releases their seats.
 */
export const reservationCleanupCron = () => {
    cron.schedule("* * * * *", async () => {
        try {
            console.log(
                "[CRON] Checking expired reservations..."
            );

            const expiredReservations = await Reservation.find({
                status: "active",
                expiresAt: {
                    $lt: new Date(),
                },
            });

            if (!expiredReservations.length) {
                console.log(
                    "[CRON] No expired reservations found."
                );
                return;
            }

            for (const reservation of expiredReservations) {
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
            }

            console.log(
                `[CRON] Released ${expiredReservations.length} expired reservations`
            );

        } catch (error) {
            console.error(
                "[CRON ERROR]",
                error.message
            );
        }
    });
};
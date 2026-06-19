import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { confirmBooking } from "../redux/thunks/bookingThunk";

const BookingModal = ({
    open,
    onClose,
}) => {
    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const {
        reservation,
        loading,
    } = useSelector(
        (state) => state.booking
    );

    const [timeLeft, setTimeLeft] =
        useState(0);

    useEffect(() => {
        if (!reservation) return;

        const interval =
            setInterval(() => {
                const diff =
                    new Date(
                        reservation.expiresAt
                    ).getTime() -
                    Date.now();

                if (diff <= 0) {
                    clearInterval(interval);
                    setTimeLeft(0);
                    return;
                }

                setTimeLeft(
                    Math.floor(diff / 1000)
                );
            }, 1000);

        return () =>
            clearInterval(interval);
    }, [reservation]);

    if (!open || !reservation)
        return null;

    const minutes = Math.floor(
        timeLeft / 60
    );

    const seconds =
        timeLeft % 60;

    const handleBooking = async () => {
        if (!isAuthenticated) {
            onClose();
            setShowLoginModal(true);
            return;
        }

        const result = await dispatch(
            confirmBooking(
                reservation._id
            )
        );

        if (
            confirmBooking.fulfilled.match(result)
        ) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div
                className="
        bg-white
        rounded-2xl
        w-full
        max-w-md
        shadow-xl
        overflow-hidden
      "
            >
                {/* Header */}

                <div className="flex items-center justify-between p-5 border-b">
                    <h2 className="text-xl font-bold">
                        Confirm Booking
                    </h2>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}

                <div className="p-6">
                    <div className="text-center">
                        <h3 className="text-gray-500">
                            Reservation Expires In
                        </h3>

                        <h1 className="text-5xl font-bold text-red-500 mt-4">
                            {String(minutes).padStart(
                                2,
                                "0"
                            )}
                            :
                            {String(seconds).padStart(
                                2,
                                "0"
                            )}
                        </h1>
                    </div>

                    <div className="mt-8 bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold mb-2">
                            Reservation Details
                        </h4>

                        <p>
                            Seats Reserved:
                            {" "}
                            {
                                reservation.seatIds
                                    ?.length
                            }
                        </p>

                        <p className="text-sm text-gray-500 mt-2">
                            Complete booking before
                            the timer expires.
                        </p>
                    </div>

                    <button
                        onClick={handleBooking}
                        disabled={
                            loading ||
                            timeLeft <= 0
                        }
                        className="
            w-full
            mt-6
            bg-green-600
            hover:bg-green-700
            disabled:bg-gray-400
            text-white
            py-3
            rounded-lg
            font-medium
            transition
          "
                    >
                        {loading
                            ? "Processing..."
                            : "Confirm Booking"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { reserveSeats, getCurrentReservation } from "../redux/thunks/bookingThunk";
import SeatGrid from "./SeatGrid";
import { useEffect } from "react";

const EventDetailsModal = ({
    open,
    onClose,
    openBooking,
    openLogin,
}) => {
    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const {
        selectedEvent,
        seatLayout,
    } = useSelector((state) => state.event);

    const {
        selectedSeats,
        loading,
        hasActiveReservation,
    } = useSelector((state) => state.booking);

    useEffect(() => {
        if (
            open &&
            selectedEvent &&
            isAuthenticated
        ) {
            dispatch(
                getCurrentReservation(
                    selectedEvent._id
                )
            );
        }
    }, [
        open,
        selectedEvent,
        isAuthenticated,
        dispatch,
    ]);

    if (!open || !selectedEvent) return null;

    const handleReserveSeats = async () => {
        if (!isAuthenticated) {
            onClose();
            openLogin();
            return;
        }

        if (!selectedSeats.length) {
            return alert(
                "Please select at least one seat"
            );
        }

        const result = await dispatch(
            reserveSeats({
                eventId: selectedEvent._id,
                seatIds: selectedSeats,
            })
        );

        if (
            reserveSeats.fulfilled.match(result)
        ) {
            openBooking();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div
                className="
        bg-white
        rounded-2xl
        w-full
        max-w-4xl
        max-h-[90vh]
        overflow-y-auto
        shadow-xl
      "
            >
                {/* Header */}

                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {selectedEvent.name}
                        </h2>

                        <p className="text-gray-500 mt-1">
                            {selectedEvent.venue}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Body */}

                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-sm text-gray-500">
                            Event Date
                        </p>

                        <p className="font-medium">
                            {new Date(
                                selectedEvent.dateTime
                            ).toLocaleString()}
                        </p>
                    </div>

                    {/* Seat Legend */}

                    <div className="flex flex-wrap gap-4 mb-8 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-green-500" />
                            Available
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-yellow-500" />
                            Reserved
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-red-500" />
                            Booked
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-blue-500" />
                            Selected
                        </div>
                    </div>

                    {/* Screen */}

                    <div className="mb-10">
                        <div className="h-3 bg-gray-300 rounded-full max-w-xl mx-auto" />

                        <p className="text-center mt-2 text-sm text-gray-500">
                            SCREEN
                        </p>
                    </div>

                    {/* Seat Grid */}

                    <SeatGrid
                        seatLayout={seatLayout}
                    />

                    {/* Footer */}

                    <div className="mt-8 border-t pt-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="font-semibold">
                                    Selected Seats
                                </h3>

                                <p className="text-gray-500">
                                    {hasActiveReservation
                                        ? "You already have an active reservation"
                                        : `${selectedSeats.length} seat(s) selected`}
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    if (hasActiveReservation) {
                                        openBooking();
                                        return;
                                    }

                                    handleReserveSeats();
                                }}
                                disabled={
                                    loading ||
                                    (
                                        !hasActiveReservation &&
                                        !selectedSeats.length
                                    )
                                }
                                className="
                w-full md:w-auto
                px-8 py-3
                bg-indigo-600
                hover:bg-indigo-700
                disabled:bg-gray-400
                text-white
                rounded-lg
                font-medium
                transition
            "
                            >
                                {hasActiveReservation
                                    ? "Confirm Your Reserved Seats"
                                    : loading
                                        ? "Reserving..."
                                        : `Reserve Seats (${selectedSeats.length})`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsModal;
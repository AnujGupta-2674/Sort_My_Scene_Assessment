import { useDispatch, useSelector } from "react-redux";

import {
    toggleSeatSelection,
} from "../redux/slices/bookingSlice";

const SeatGrid = ({
    seatLayout,
}) => {
    const dispatch = useDispatch();

    const {
        selectedSeats,
    } = useSelector(
        (state) => state.booking
    );

    return (
        <div className="space-y-4">
            {seatLayout.map((row) => (
                <div
                    key={row.row}
                    className="flex gap-2 justify-center flex-wrap"
                >
                    {row.seats.map(
                        (seat) => {
                            let color =
                                "bg-green-500";

                            if (
                                seat.status ===
                                "reserved"
                            )
                                color =
                                    "bg-yellow-500";

                            if (
                                seat.status ===
                                "booked"
                            )
                                color =
                                    "bg-red-500";

                            if (
                                selectedSeats.includes(
                                    seat._id
                                )
                            )
                                color =
                                    "bg-blue-500";

                            return (
                                <button
                                    key={seat._id}
                                    disabled={
                                        seat.status !==
                                        "available"
                                    }
                                    onClick={() =>
                                        dispatch(
                                            toggleSeatSelection(
                                                seat._id
                                            )
                                        )
                                    }
                                    className={`${color} h-10 w-10 rounded-lg text-white text-xs`}
                                >
                                    {
                                        seat.seatNumber
                                    }
                                </button>
                            );
                        }
                    )}
                </div>
            ))}
        </div>
    );
};

export default SeatGrid;
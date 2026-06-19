import { useDispatch, useSelector } from "react-redux";

import {
    clearSelectedSeats,
} from "../redux/slices/bookingSlice";


import EventCard from "./EventCard";
import FeaturedCarousel from "./FeaturedCarousel";

import { fetchEventDetails } from "../redux/thunks/eventThunk";

const EventsSection = ({
    setShowEventModal,
}) => {
    const dispatch = useDispatch();

    const {
        featuredEvents,
        events,
        loading,
    } = useSelector(
        (state) => state.event
    );

    const handleViewSeats = async (
        eventId
    ) => {
        dispatch(clearSelectedSeats());

        await dispatch(
            fetchEventDetails(eventId)
        );

        setShowEventModal(true);
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                Loading Events...
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <FeaturedCarousel
                featuredEvents={
                    featuredEvents
                }
                onViewSeats={
                    handleViewSeats
                }
            />

            <h2 className="text-2xl font-bold mb-6">
                All Events
            </h2>

            <div
                className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-6
        "
            >
                {events.map((event, index) => (
                    <EventCard
                        key={event._id}
                        event={event}
                        index={index}
                        onViewSeats={
                            handleViewSeats
                        }
                    />
                ))}
            </div>
        </main>
    );
};

export default EventsSection;
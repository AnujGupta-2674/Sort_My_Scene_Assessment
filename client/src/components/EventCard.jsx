const EVENT_IMAGES = [
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    "https://images.unsplash.com/photo-1503095396549-807759245b35",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd",
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14",
];

const EventCard = ({
    event,
    onViewSeats,
    index
}) => {

    const eventImage =
        EVENT_IMAGES[
        index % EVENT_IMAGES.length
        ];
    return (
        <div
            className="
      bg-white
      rounded-2xl
      overflow-hidden
      shadow-md
      hover:shadow-xl
      transition-all
      duration-300
      "
        >
            <img
                src={eventImage}
                alt={event.name}
                className="w-full h-52 object-cover"
            />

            <div className="p-5 space-y-3">
                <h2 className="font-bold text-xl">
                    {event.name}
                </h2>

                <p className="text-gray-500">
                    {event.venue}
                </p>

                <p className="text-sm text-gray-400">
                    {new Date(
                        event.dateTime
                    ).toLocaleDateString()}
                </p>

                <button
                    onClick={() =>
                        onViewSeats(event._id)
                    }
                    className="
          w-full
          bg-indigo-600
          hover:bg-indigo-700
          text-white
          py-2.5
          rounded-lg
          transition
          "
                >
                    View Seats
                </button>
            </div>
        </div>
    );
};

export default EventCard;
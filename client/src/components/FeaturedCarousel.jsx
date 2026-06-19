const EVENT_IMAGE =
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f";

const FeaturedCarousel = ({
    featuredEvents,
    onViewSeats,
}) => {
    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold mb-5">
                Featured Events
            </h2>

            <div
                className="
        flex
        gap-5
        overflow-x-auto
        pb-3
        "
            >
                {featuredEvents.map((event) => (
                    <div
                        key={event._id}
                        className="
            min-w-[320px]
            h-[220px]
            rounded-2xl
            overflow-hidden
            relative
            "
                    >
                        <img
                            src={EVENT_IMAGE}
                            alt={event.name}
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-black/40" />

                        <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                            <h3 className="text-2xl font-bold">
                                {event.name}
                            </h3>

                            <button
                                onClick={() =>
                                    onViewSeats(
                                        event._id
                                    )
                                }
                                className="
                mt-3
                bg-white
                text-black
                px-4
                py-2
                rounded-lg
                w-fit
                "
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedCarousel;
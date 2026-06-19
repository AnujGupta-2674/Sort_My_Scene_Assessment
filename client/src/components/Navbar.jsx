import { useSelector, useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { logoutUser } from "../redux/thunks/authThunk";
import { resetBookingState } from "../redux/slices/bookingSlice";

const Navbar = ({ setShowLoginModal }) => {
    const { user } = useSelector(
        (state) => state.auth
    );

    const dispatch = useDispatch();

    const handleLogout = async () => {
        const result = await dispatch(logoutUser());

        if (
            logoutUser.fulfilled.match(result)
        ) {
            await dispatch(resetBookingState());
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between">
                    <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">
                        SeatBook
                    </h1>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>

                            <span className="hidden sm:block font-medium">
                                {user.name}
                            </span>

                            <button
                                onClick={handleLogout}
                                className="
            p-2
            rounded-lg
            text-red-500
            hover:bg-red-50
            hover:text-red-600
            transition
        "
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() =>
                                setShowLoginModal(true)
                            }
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { getCurrentUser } from "./redux/thunks/authThunk";
import { fetchEvents } from "./redux/thunks/eventThunk";

import Navbar from "./components/Navbar";
import EventsSection from "./components/EventsSection";

import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import EventDetailsModal from "./components/EventDetailsModal";
import BookingModal from "./components/BookingModal";

function App() {
  const dispatch = useDispatch();

  const [showLoginModal, setShowLoginModal] =
    useState(false);

  const [
    showRegisterModal,
    setShowRegisterModal,
  ] = useState(false);

  const [
    showEventModal,
    setShowEventModal,
  ] = useState(false);

  const [
    showBookingModal,
    setShowBookingModal,
  ] = useState(false);

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar
        setShowLoginModal={
          setShowLoginModal
        }
      />

      <EventsSection
        setShowEventModal={
          setShowEventModal
        }
      />

      <LoginModal
        open={showLoginModal}
        onClose={() =>
          setShowLoginModal(false)
        }
        openRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        open={showRegisterModal}
        onClose={() =>
          setShowRegisterModal(false)
        }
      />

      <EventDetailsModal
        open={showEventModal}
        onClose={() =>
          setShowEventModal(false)
        }
        openBooking={() =>
          setShowBookingModal(true)
        }
        openLogin={() => {
          setShowEventModal(false);
          setShowLoginModal(true);
        }}
      />

      <BookingModal
        open={showBookingModal}
        onClose={() =>
          setShowBookingModal(false)
        }
      />
    </div>
  );
}

export default App;
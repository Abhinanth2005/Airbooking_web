import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import "./Page.css";

const MyTrips = () => {
    const location = useLocation();

    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [flightDetails, setFlightDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const message = location.state?.message;

    const fetchBookings = async () => {
        try {
            const response = await api.get("bookings/");
            const data = response.data;

            setBookings(Array.isArray(data) ? data : data.results || []);
        } 
        catch (err) {
            setError(err.response?.data?.detail || "Unable to load your bookings.");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleViewDetails = async (booking) => {
        if (selectedBooking?.id === booking.id) {
            setSelectedBooking(null);
            setFlightDetails(null);
            return;
        }

        setSelectedBooking(booking);
        setFlightDetails(null);

        try {
            const response = await api.get(`flights/${booking.flight}/`);
            setFlightDetails(response.data);
        }
        catch (err) {
            setError("Unable to load flight details.");
        }
    };

    const handleCancelBooking = async (booking) => {
        const confirmed = window.confirm(
            `Are you sure you want to cancel booking #${booking.id}?`
        );

        if (!confirmed) return;

        setCancellingId(booking.id);
        setError("");
        setSuccess("");

        try {
            const response = await api.post(`bookings/${booking.id}/cancel/`);

            setSuccess(response.data.message || "Booking cancelled successfully.");

            await fetchBookings();

            if (selectedBooking?.id === booking.id) {
                setSelectedBooking(null);
                setFlightDetails(null);
            }
        }
        catch (err) {
            setError(err.response?.data?.detail || "Unable to cancel booking.");
        }
        finally {
            setCancellingId(null);
        }
    };

   if (loading) {
    return <div className="my-trips-page">Loading your trips...</div>;
}

    return (
        <div className="my-trips-page">
            <h1>My Trips</h1>
            <p>View your flight bookings and payment details.</p>

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {success && (
                <div className="success-message">
                    {success}
                </div>
            )}

            {error && (
                <p className="error-message">{error}</p>
            )}

            {bookings.length === 0 ? (
                <div className="empty-state">
                    <h3>No bookings found</h3>
                    <p>Your flight bookings will appear here.</p>
                </div>
            ) : (
                <div className="trips-list">
                    {bookings.map((booking) => (
                        <div className="trip-card" key={booking.id}>
                            <div className="trip-header">
                                <h3>Booking #{booking.id}</h3>

                                <div className="d-flex gap-2 flex-wrap">
                                    <span className={`status-badge ${booking.payment_status?.toLowerCase()}`} >Payment: {booking.payment_status} </span>
                                    <span className={`status-badge ${booking.booking_status?.toLowerCase()}`} > {booking.booking_status} </span>
                                </div>
                            </div>

                            <p> <strong>Flight ID:</strong> {booking.flight} </p>
                            <p> <strong>Seats:</strong> {booking.seats} </p>
                            <p> <strong>Total Price:</strong> ₹{booking.total_price} </p>
                            <p> <strong>Booking Date:</strong>{" "} {new Date(booking.created_at).toLocaleString()} </p>

                            <button className="secondary-btn" onClick={() => handleViewDetails(booking)} > {selectedBooking?.id === booking.id ? "Hide Details" : "View Details"} </button>

                            {booking.booking_status !== "CANCELLED" &&
                                booking.payment_status === "PAID" && (
                                    <button className="danger-btn" onClick={() => handleCancelBooking(booking)} disabled={cancellingId === booking.id} >
                                        {cancellingId === booking.id
                                            ? "Cancelling..."
                                            : "Cancel Booking"}
                                    </button>
                                )}

                            {selectedBooking?.id === booking.id && (
                                <div className="booking-details">
                                    <h4>Booking Details</h4>

                                    {flightDetails ? (
                                        <>
                                            <p> <strong>Airline:</strong>{" "} {flightDetails.airline} </p>
                                            <p> <strong>Flight Number:</strong>{" "} {flightDetails.flight_number} </p>
                                            <p> <strong>Route:</strong>{" "} {flightDetails.source} →{" "} {flightDetails.destination} </p>
                                            <p> <strong>Departure:</strong>{" "} {new Date(flightDetails.departure_time).toLocaleString()} </p>
                                            <p> <strong>Arrival:</strong>{" "} {new Date(flightDetails.arrival_time).toLocaleString()} </p>
                                            <p> <strong>Flight Status:</strong>{" "} {flightDetails.status} </p>
                                        </>
                                    ) : (
                                        <p>Loading flight details...</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTrips;
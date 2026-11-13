import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [flight, setFlight] = useState(null);
  const [seats, setSeats] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await api.get(`flights/${id}/`);
        setFlight(response.data);
      }
      catch (err) {
        setError("Unable to load flight information.");
      }
      finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");
    setAlertMessage("");

    if (!Number.isInteger(Number(seats)) || Number(seats) < 1) {
      setError("Please enter a valid number of seats.");
      return;
    }

    if (Number(seats) > flight.available_seats) {
      setError("Not enough seats available.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post("bookings/", {
        flight: Number(id),
        seats: Number(seats),
        payment_success: paymentSuccess,
      });

      if (response.data.payment_status === "PAID") {
        setAlertType("success");
        setAlertMessage("Booking confirmed! Your payment was successful.");
      }
      else {
        setAlertType("failure");
        setAlertMessage("Payment failed. Your booking was not confirmed.");
      }

      setTimeout(() => {
        navigate("/my-trips", {state: {booking: response.data,message: alertMessage}});
      }, 2000);
    }
    catch (err) {
      const data = err.response?.data;

      setError(data?.seats?.[0] || data?.seats || data?.detail || "Booking failed. Please try again.");
    }
    finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page-container">Loading flight information...</div>;
  }

  if (!flight) {
    return (
      <div className="page-container error-message">
        {error || "Flight not found."}
      </div>
    );
  }

  return (
    <div className="page-container">
      {alertMessage && (
        <div className={`booking-alert ${alertType}`}>{alertMessage}</div>
      )}

     
      <h1>Book Your Flight</h1>

      <div className="booking-card">
        <h2>{flight.airline}</h2>
        <p><strong>Flight:</strong> {flight.flight_number} </p>
        <p><strong>Route:</strong> {flight.source} → {flight.destination} </p>
        <p><strong>Departure:</strong>{" "} {new Date(flight.departure_time).toLocaleString()} </p>
        <p><strong>Arrival:</strong>{" "} {new Date(flight.arrival_time).toLocaleString()} </p>
        <p><strong>Price per seat:</strong> ₹{flight.price} </p>
        <p><strong>Available seats:</strong> {flight.available_seats} </p> <hr />

        <form onSubmit={handleBooking}>
          <label htmlFor="seats">Number of seats</label>
          <input id="seats" type="number" min="1" max={flight.available_seats} value={seats} onChange={(e) => setSeats(e.target.value)} required />

          <p> <strong>Total Price:</strong> ₹{(Number(flight.price) * Number(seats || 0)).toFixed(2)} </p>

          <label htmlFor="payment">Simulate Payment</label>
          <select id="payment" value={paymentSuccess ? "success" : "failure"} onChange={(e) => setPaymentSuccess(e.target.value === "success")} >
            <option value="success">Payment Successful</option>
            <option value="failure">Payment Failed</option>
          </select>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="primary-btn" disabled={submitting || flight.available_seats < 1} >
            {submitting ? "Processing..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;

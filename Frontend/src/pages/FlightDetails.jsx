import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Page.css";

const FlightDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFlight = async () => {
            try {
                const response = await api.get(`flights/${id}/`);
                setFlight(response.data);
            }
            catch (err) {
                setError(err.response?.data?.detail || "Unable to load flight details.");
            }
            finally {
                setLoading(false);
            }
        };

        fetchFlight();
    }, [id]);

    if (loading) return <div className="page-container">Loading flight details...</div>;
    if (error) return <div className="page-container error-message">{error}</div>;
    if (!flight) return null;

    return (
        <div className="flight-details-page">
            <h1>Flight Details</h1>

            <div className="details-card">
                <h2>{flight.airline}</h2>
                <h3>{flight.flight_number}</h3>

                <div className="flight-route">
                    <div>
                        <h2>{flight.source}</h2>
                        <p>Departure</p>
                        <p>{new Date(flight.departure_time).toLocaleString()}</p>
                    </div>

                    <div className="route-arrow">→</div>

                    <div>
                        <h2>{flight.destination}</h2>
                        <p>Arrival</p>
                        <p>{new Date(flight.arrival_time).toLocaleString()}</p>
                    </div>
                </div>

                <hr />

                <p><strong>Ticket Price:</strong> ₹{flight.price}</p>
                <p><strong>Total Seats:</strong> {flight.total_seats}</p>
                <p><strong>Available Seats:</strong> {flight.available_seats}</p>
                <p><strong>Flight Status:</strong> {flight.status}</p>

                {flight.available_seats > 0 && flight.status !== "CANCELLED" ? (
                    <button onClick={() => navigate(`/book/${flight.id}`)} className="primary-btn" >Book Now</button>
                ) : (
                    <p className="error-message">This flight is currently unavailable.</p>
                )}
            </div>
        </div>
    );
};

export default FlightDetails;
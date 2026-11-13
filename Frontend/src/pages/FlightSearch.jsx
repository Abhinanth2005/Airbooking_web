import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Page.css";

const FlightSearch = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        source: "",
        destination: "",
        date: "",
    });

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchFlights = async (filters = {}) => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("flights/search/", {
                params: filters,
            });

            const data = response.data;
            setFlights(Array.isArray(data) ? data : data.results || []);
        }
        catch (err) {
            setError(err.response?.data?.detail || "Unable to retrieve flights.");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlights();
    }, []);

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]: e.target.value});
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const filters = {};

        if (formData.source.trim()) {
            filters.source = formData.source.trim();
        }
        if (formData.destination.trim()) {
            filters.destination = formData.destination.trim();
        }
        if (formData.date) {
            filters.date = formData.date;
        }

        fetchFlights(filters);
    };

    const handleClear = () => {
        setFormData({source: "",destination: "",date: "",});
        fetchFlights();
    };

    return (
        <div className="flight-search-page">
            <h1>Search Flights</h1>
            <p >Explore available flights and find your journey.</p>

            <form className="search-form" onSubmit={handleSearch}>
                <input type="text" name="source" placeholder="Source" value={formData.source} onChange={handleChange} />
                <input type="text" name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} />
                <input type="date" name="date" value={formData.date} onChange={handleChange} />
                <button type="submit" disabled={loading}> Search Flights </button>

                <button type="button" className="secondary-btn" onClick={handleClear} disabled={loading} >Clear Filters</button>
            </form>

            <div className="flight-results-header">
                <h2>Available Flights</h2>
                <span>{flights.length} flights found</span>
            </div>

            {loading && <p>Loading flights...</p>}

            {error && <p className="error-message">{error}</p>}

            {!loading && !error && flights.length === 0 && (
                <p>No flights found.</p>
            )}

            <div className="flight-grid">
                {flights.map((flight) => (
                    <div className="flight-card" key={flight.id}>
                        <h3>{flight.airline}</h3>
                        <p><strong>Flight:</strong> {flight.flight_number} </p>
                        <h3> {flight.source} → {flight.destination} </h3>
                        <p><strong>Departure:</strong>{" "} {new Date(flight.departure_time).toLocaleString()} </p>
                        <p><strong>Arrival:</strong>{" "} {new Date(flight.arrival_time).toLocaleString()} </p>
                        <p><strong>Price:</strong> ₹{flight.price} </p>
                        <p><strong>Available Seats:</strong>{" "} {flight.available_seats} </p>
                        <p><strong>Status:</strong> {flight.status} </p>

                        <button onClick={() => navigate(`/flights/${flight.id}`)} >View Details</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlightSearch;
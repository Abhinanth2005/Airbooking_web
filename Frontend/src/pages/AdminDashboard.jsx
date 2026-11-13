import { useEffect, useState } from "react";
import api from "../services/api";

const initialFlightForm = {
    flight_number: "",
    airline: "",
    source: "",
    destination: "",
    departure_time: "",
    arrival_time: "",
    price: "",
    total_seats: "",
    available_seats: "",
    status: "ON_TIME",
};

const formatDateTimeForInput = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    const offset = date.getTimezoneOffset() * 60000;

    return new Date(date.getTime() - offset)
        .toISOString()
        .slice(0, 16);
};

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [flights, setFlights] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [flightForm, setFlightForm] = useState(initialFlightForm);
    const [editingFlight, setEditingFlight] = useState(null);
    const [savingFlight, setSavingFlight] = useState(false);

    const fetchAdminData = async () => {
        setLoading(true);
        setError("");

        try {
            const [usersResponse, flightsResponse] = await Promise.all([
                api.get("admin/users/pending/"),
                api.get("flights/admin/"),
            ]);

            const usersData = usersResponse.data;
            const flightsData = flightsResponse.data;

            setUsers(Array.isArray(usersData) ? usersData : usersData.results || []);

            setFlights(Array.isArray(flightsData) ? flightsData : flightsData.results || []);
        }
        catch (err) {
             setError( err.response?.data?.detail || "Unable to load admin information.");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);


    const handleUserApproval = async (userId, approvalStatus) => {
        setError("");
        setMessage("");

        try {
            await api.post(`admin/users/${userId}/approve/`, {
                approval_status: approvalStatus,
            });

            setMessage(`User ${approvalStatus.toLowerCase()} successfully.`);
            await fetchAdminData();
        }
        catch (err) {
            setError( err.response?.data?.error || err.response?.data?.detail || "Unable to update user approval.");
        }
    };

    const handleFlightStatus = async (flightId, newStatus) => {
        setError("");
        setMessage("");

        try {
            await api.put(`flights/admin/${flightId}/status/`, {
                status: newStatus,
            });
            setMessage("Flight status updated successfully.");
            await fetchAdminData();
        }
        catch (err) {
            setError( err.response?.data?.error || err.response?.data?.detail || "Unable to update flight status." );
        }
    };

    const handleFlightFormChange = (e) => {
        const { name, value } = e.target;

        setFlightForm((previous) => ({...previous,[name]: value}));
    };

    const handleFlightSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (new Date(flightForm.arrival_time) <= new Date(flightForm.departure_time)) {
            setError("Arrival time must be later than departure time.");
            return;
        }

        if (Number(flightForm.available_seats) > Number(flightForm.total_seats)) {
            setError("Available seats cannot exceed total seats.");
            return;
        }

        const flightData = {...flightForm,
            departure_time: new Date(flightForm.departure_time).toISOString(),
            arrival_time: new Date(flightForm.arrival_time).toISOString(),
            price: Number(flightForm.price).toFixed(2),
            total_seats: Number(flightForm.total_seats),
            available_seats: Number(flightForm.available_seats),
        };
        setSavingFlight(true);

        try {
            if (editingFlight) {
                await api.patch(
                    `flights/admin/${editingFlight.id}/`,
                    flightData
                );
                setMessage("Flight updated successfully.");
            }

            else {
                await api.post("flights/admin/", flightData);
                setMessage("Flight added successfully.");
            }

            setFlightForm(initialFlightForm);
            setEditingFlight(null);

            await fetchAdminData();
        }
        
        catch (err) {
            const responseData = err.response?.data;

            if (responseData && typeof responseData === "object") {
                const firstError = Object.values(responseData)[0];
                setError( Array.isArray(firstError) ? firstError[0]  : typeof firstError === "string" ? firstError : "Unable to save flight.");
            }
            else {
                setError("Unable to save flight.");
            }
        }
        finally {
            setSavingFlight(false);
        }
    };

   
    const handleEditFlight = (flight) => {
        setEditingFlight(flight);

        setFlightForm({
            flight_number: flight.flight_number,
            airline: flight.airline,
            source: flight.source,
            destination: flight.destination,
            departure_time: formatDateTimeForInput(flight.departure_time),
            arrival_time: formatDateTimeForInput(flight.arrival_time),
            price: flight.price,
            total_seats: flight.total_seats,
            available_seats: flight.available_seats,
            status: flight.status,
        });
        setError("");
        setMessage("");

        window.scrollTo({top: 0,behavior: "smooth"});
    };

    const handleCancelEdit = () => {
        setEditingFlight(null);
        setFlightForm(initialFlightForm);
        setError("");
        setMessage("");
    };

    const handleDeleteFlight = async (flightId) => {
        const confirmed = window.confirm("Are you sure you want to delete this flight?");

        if (!confirmed) return;

        setError("");
        setMessage("");

        try {
            await api.delete(`flights/admin/${flightId}/`);
            setMessage("Flight deleted successfully.");
            await fetchAdminData();
        }
        catch (err) {
            setError( err.response?.data?.detail || err.response?.data?.error || "Unable to delete flight. It may have existing bookings.");
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                Loading admin dashboard...
            </div>
        );
    }

    return (
        <div className="page-container">
            <h1>Admin Dashboard</h1>
            <p>Manage user registrations and flights.</p>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <section className="admin-section">
                <h2>Pending User Approvals</h2>

                {users.length === 0 ? (
                    <p>No pending user registrations.</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Approval Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td> {user.first_name} {user.last_name} </td>
                                        <td>{user.email}</td>
                                        <td>{user.approval_status}</td>
                                        <td>
                                            <button className="approve-btn"onClick={() => handleUserApproval(user.id,"APPROVED")}>  Approve </button>
                                            <button className="reject-btn" onClick={() => handleUserApproval(user.id,"REJECTED")}> Reject </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            

            <section className="admin-section">
                <h2>Manage Flights</h2>

                {flights.length === 0 ? (
                    <p>No flights available.</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Flight Number</th>
                                    <th>Airline</th>
                                    <th>Route</th>
                                    <th>Departure</th>
                                    <th>Available Seats</th>
                                    <th>Status</th>
                                    <th>Update Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {flights.map((flight) => (
                                    <tr key={flight.id}>
                                        <td>{flight.flight_number}</td>
                                        <td>{flight.airline}</td>
                                        <td>{flight.source} → {flight.destination}</td>
                                        <td>{new Date(flight.departure_time).toLocaleString()}</td>
                                        <td>{flight.available_seats}</td>
                                        <td>{flight.status}</td>

                                        <td>
                                            <select value={flight.status} onChange={(e) => handleFlightStatus(flight.id,e.target.value)}>
                                                <option value="ON_TIME">On Time</option>
                                                <option value="DELAYED">Delayed</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </td>

                                        <td>
                                            <button className="secondary-btn" onClick={() => handleEditFlight(flight)}>Edit</button>
                                            <button className="reject-btn" onClick={() => handleDeleteFlight(flight.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>


            <section className="admin-section">
                <h2> {editingFlight ? "Edit Flight" : "Add New Flight"} </h2>

                <form className="flight-form" onSubmit={handleFlightSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Flight Number</label>
                            <input type="text" name="flight_number" value={flightForm.flight_number} onChange={handleFlightFormChange} required />
                        </div>

                        <div className="form-group">
                            <label>Airline</label>
                            <input type="text" name="airline" value={flightForm.airline} onChange={handleFlightFormChange} required />
                        </div>

                        <div className="form-group">
                            <label>Source</label>
                            <input type="text" name="source" value={flightForm.source} onChange={handleFlightFormChange} required />
                        </div>

                        <div className="form-group">
                            <label>Destination</label>
                            <input type="text" name="destination" value={flightForm.destination} onChange={handleFlightFormChange} required />
                        </div>

                        <div className="form-group">
                            <label>Departure Time</label>
                            <input type="datetime-local" name="departure_time" value={flightForm.departure_time} onChange={handleFlightFormChange} required />
                        </div>

                        <div className="form-group">
                            <label>Arrival Time</label>
                            <input type="datetime-local" name="arrival_time" value={flightForm.arrival_time} onChange={handleFlightFormChange} required />
                        </div>

                        <div className="form-group">
                            <label>Price (₹)</label>
                            <input type="number" name="price" value={flightForm.price} onChange={handleFlightFormChange} min="0.01" step="0.01" required />
                        </div>

                        <div className="form-group">
                            <label>Total Seats</label>
                            <input type="number" name="total_seats" value={flightForm.total_seats} onChange={handleFlightFormChange} min="1" required />
                        </div>

                        <div className="form-group">
                            <label>Available Seats</label>
                            <input type="number" name="available_seats" value={flightForm.available_seats} onChange={handleFlightFormChange} min="0" required />
                        </div>

                        <div className="form-group">
                            <label>Flight Status</label>
                            <select name="status" value={flightForm.status} onChange={handleFlightFormChange}>
                                <option value="ON_TIME">On Time</option>
                                <option value="DELAYED">Delayed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="approve-btn" disabled={savingFlight}>
                            {savingFlight ? "Saving..." : editingFlight ? "Update Flight" : "Add Flight"}
                        </button>

                        {editingFlight && (
                            <button type="button" className="secondary-btn" onClick={handleCancelEdit}>Cancel</button>
                        )}
                    </div>
                </form>
            </section>
        </div>
    );
};

export default AdminDashboard;
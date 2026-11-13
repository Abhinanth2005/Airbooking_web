import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome to AirBooking</h1>
                <p>Hello, {user?.first_name || user?.email}.Find flights and manage your bookings from here.</p>
            </div>

            <div className="dashboard-grid">
                <Link to="/flights" className="dashboard-card">
                    <h2>Search Flights</h2>
                    <p>Find available flights and explore flight details.</p>
                    <span>Search Flights →</span>
                </Link>

                <Link to="/my-trips" className="dashboard-card">
                    <h2>My Trips</h2>
                    <p>View your bookings and payment status.</p>
                    <span>View My Trips →</span>
                </Link>

                {user?.is_staff && (
                    <Link to="/admin-dashboard" className="dashboard-card">
                        <h2>Admin Dashboard</h2>
                        <p>Manage user approvals and flight status.</p>
                        <span>Open Dashboard →</span>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Footer.css";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="brand">AirBooking</Link>

                <div className="nav-links">
                    <Link to="/">Home</Link>

                    {user ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/flights">Search Flights</Link>
                            <Link to="/my-trips">My Trips</Link>

                            {user.is_staff && (
                                <Link to="/admin-dashboard">Admin</Link>
                            )}

                            <button className="logout-btn" onClick={logout}>Logout</button>
                        </>
                    ) : (
                        < >
                            <Link to="/login">Login</Link>
                            <Link to="/register">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
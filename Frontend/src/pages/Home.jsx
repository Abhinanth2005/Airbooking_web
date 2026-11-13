import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Page.css";

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="home-container">
            <section className="hero-section">
                <div className="hero-content">
                    <p className="hero-subtitle">YOUR JOURNEY STARTS HERE</p>

                    <h1>Welcome to <span>AirBooking</span></h1>

                    <p className="hero-description">Discover flights, book your tickets and manage your journeys with ease. Your next destination is just a few clicks away.</p>

                    <Link to={user ? "/flights" : "/register"} className="hero-btn" >{user ? "Explore Flights" : "Get Started"}</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
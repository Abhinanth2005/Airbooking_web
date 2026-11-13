import "./Footer.css";

const Footer = () => {
    return (
        <footer className="airbooking-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="footer-plane-icon" >
                            <path d="M21 3L3.5 10.5c-.8.35-.75 1.5.1 1.78l6.2 2.05 2.05 6.2c.28.85 1.43.9 1.78.1L21 3z" />
                        </svg>
                        <h2>AirBooking</h2>
                    </div>
                    <p>Your Journey. Our Priority.</p>
                </div>

                <div className="footer-column">
                    <h3>Quick Links</h3>
                    <a href="/">Home</a>
                    <a href="/flights">Search Flights</a>
                    <a href="/my-trips">My Trips</a>
                    <a href="/admin">Admin Dashboard</a>
                </div>

                <div className="footer-column">
                    <h3>Support</h3>
                    <a href="/help">Help Center</a>
                    <a href="/contact">Contact Us</a>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                </div>

                <div className="footer-column footer-social">
                    <h3>Follow Us</h3>

                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
                        <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">𝕏</a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a>
                        <a href="#" target="_blank" rel="noreferrer" aria-label="YouTube">▶</a>
                    </div>
                </div>

            </div>

            <div className="footer-bottom">
                <p>© 2025 AirBooking. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
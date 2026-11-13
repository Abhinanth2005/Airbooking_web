import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const navigate = useNavigate();
    const { register, loading } = useAuth();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password2: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const nameRegex = /^[A-Za-z.]+$/;
    
    if (!nameRegex.test(formData.first_name)) {
        setError("First name can contain only alphabets and dots.");
        return;
    }
    
    if (!nameRegex.test(formData.last_name)) {
        setError("Last name can contain only alphabets and dots.");
        return;
    }
    
    if (formData.password.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
    }
    
    if (formData.password !== formData.password2) {
        setError("Passwords do not match.");
        return;
    }

        const result = await register(formData);

        if (result.success) {
            setSuccess( "Registration successful! Your account is pending admin approval." );
            setTimeout(() => navigate("/login"), 2500);

        }
         else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p>Register to start booking your flights.</p>

                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}

                {success && (
                    <div className="alert alert-success">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required pattern="[A-Za-z]+"title="Only alphabets are allowed." />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required pattern="[A-Za-z.]+"title="Only alphabets and dots are allowed." />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={8} />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" name="password2" value={formData.password2} onChange={handleChange} required minLength={8} />
                    </div>

                    <button type="submit" disabled={loading}> {loading ? "Registering..." : "Register"} </button>

                </form>

                <p className="auth-link">Already have an account? <Link to="/login">Login</Link> </p>
            </div>
        </div>
    );
};

export default Register;
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FlightSearch from "./pages/FlightSearch";
import FlightDetails from "./pages/FlightDetails";
import Booking from "./pages/Booking";
import MyTrips from "./pages/MyTrips";
import AdminDashboard from "./pages/AdminDashboard";

const AdminRoute = () => {
    const { user } = useAuth();

    if (!user?.is_staff) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

const AppContent = () => {
    return (
        <>
            <Navbar />

            <main className="main-content">
                <Routes>       
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                   
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/flights" element={<FlightSearch />} />
                        <Route path="/flights/:id" element={<FlightDetails />} />
                        <Route path="/book/:id" element={<Booking />} />
                        <Route path="/my-trips" element={<MyTrips />} />

                        <Route element={<AdminRoute />}>
                            <Route
                                path="/admin-dashboard"
                                element={<AdminDashboard />}
                            />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            <Footer />
        </>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);

        try {
            const response = await api.post("auth/login/", {
                email,
                password,
            });

            const { access, refresh, user } = response.data;

            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);
            localStorage.setItem("user", JSON.stringify(user));

            setUser(user);

            return { success: true };

        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.detail ||
                    error.response?.data?.non_field_errors?.[0] ||
                    error.response?.data?.error ||
                    "Login failed. Please try again.",
            };

        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);

        try {
            const response = await api.post("auth/register/", userData);

            return {
                success: true,
                data: response.data,
            };

        } catch (error) {
            const errors = error.response?.data;

            return {
                success: false,
                message: errors
                    ? Object.entries(errors)
                        .map(([field, messages]) =>
                            `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`
                        ).join("\n")
                    : "Registration failed. Please try again.",
            };

        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        setUser(null);
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user && !!localStorage.getItem("access"),
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
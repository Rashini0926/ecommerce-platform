/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const normalizeUserRole = (userData) =>
    userData ? { ...userData, role: String(userData.role || "CUSTOMER").toLowerCase() } : null;

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        return savedUser ? normalizeUserRole(JSON.parse(savedUser)) : null;
    });
    const [token, setToken] = useState(localStorage.getItem("token"));

    const login = (userData, authToken) => {

        const normalizedUser = normalizeUserRole(userData);
        setUser(normalizedUser);
        setToken(authToken);

        localStorage.setItem("user", JSON.stringify(normalizedUser));
        localStorage.setItem("token", authToken);

    };

    const logout = () => {

        setUser(null);
        setToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");

    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

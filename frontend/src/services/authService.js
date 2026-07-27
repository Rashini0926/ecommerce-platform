import api from "../utils/api";

export const loginUser = async (email, password) => {
    const response = await api.post("/login", {
        email,
        password,
    });

    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post("/register", userData);

    return response.data;
};

export const getProfile = async (token) => {
    const response = await api.get("/profile", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const logoutUser = async (token) => {
    const response = await api.post(
        "/logout",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};
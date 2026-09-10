import api from "../utils/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        Authorization: `Bearer ${token}`,
    };
};


// GET all cart items
export const getCart = async () => {
    const response = await api.get("/cart", {
        headers: getAuthHeaders(),
    });

    return response.data;
};


// ADD product to cart
export const addToCart = async (productId, quantity = 1) => {
    const response = await api.post(
        "/cart",
        {
            product_id: productId,
            quantity: quantity,
        },
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// UPDATE quantity
export const updateCartItem = async (cartItemId, quantity) => {
    const response = await api.patch(
        `/cart/${cartItemId}`,
        {
            quantity: quantity,
        },
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// DELETE one cart item
export const removeCartItem = async (cartItemId) => {
    const response = await api.delete(
        `/cart/${cartItemId}`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// CLEAR entire cart
export const clearCart = async () => {
    const response = await api.delete(
        "/cart",
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};
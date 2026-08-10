import api from "../utils/api";

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getWishlist = async (token) => {
  const response = await api.get("/wishlist", authConfig(token));

  return response.data;
};

export const addToWishlist = async (token, productId) => {
  const response = await api.post(
    "/wishlist",
    {
      product_id: productId,
    },
    authConfig(token)
  );

  return response.data;
};

export const removeFromWishlist = async (token, wishlistItemId) => {
  const response = await api.delete(
    `/wishlist/${wishlistItemId}`,
    authConfig(token)
  );

  return response.data;
};

export const getCart = async (token) => {
  const response = await api.get("/cart", authConfig(token));

  return response.data;
};

export const addToCart = async (token, productId, quantity = 1) => {
  const response = await api.post(
    "/cart",
    {
      product_id: productId,
      quantity,
    },
    authConfig(token)
  );

  return response.data;
};

export const updateCartItem = async (token, cartItemId, quantity) => {
  const response = await api.patch(
    `/cart/${cartItemId}`,
    {
      quantity,
    },
    authConfig(token)
  );

  return response.data;
};

export const removeFromCart = async (token, cartItemId) => {
  const response = await api.delete(`/cart/${cartItemId}`, authConfig(token));

  return response.data;
};

export const clearCart = async (token) => {
  const response = await api.delete("/cart", authConfig(token));

  return response.data;
};

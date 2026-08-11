import api from "../utils/api";

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const createOrder = async (token, checkoutData) => {
  const response = await api.post("/orders", checkoutData, authConfig(token));

  return response.data;
};

export const getOrders = async (token) => {
  const response = await api.get("/orders", authConfig(token));

  return response.data;
};

export const getOrder = async (token, orderId) => {
  const response = await api.get(`/orders/${orderId}`, authConfig(token));

  return response.data;
};

export const cancelOrder = async (token, orderId) => {
  const response = await api.patch(`/orders/${orderId}/cancel`, {}, authConfig(token));

  return response.data;
};

export const getAdminOrders = async (token) => {
  const response = await api.get("/admin/orders", authConfig(token));

  return response.data;
};

export const updateOrderStatus = async (token, orderId, orderStatus) => {
  const response = await api.patch(
    `/admin/orders/${orderId}/status`,
    { order_status: orderStatus },
    authConfig(token)
  );

  return response.data;
};

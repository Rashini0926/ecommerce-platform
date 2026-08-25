import api from "../utils/api";

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/categories");

  return response.data;
};

const authConfig = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const getMyProducts = async (token) => (await api.get("/seller/products", authConfig(token))).data;
export const createProduct = async (token, product) => (await api.post("/products", product, authConfig(token))).data;
export const updateProduct = async (token, id, product) => (await api.put(`/products/${id}`, product, authConfig(token))).data;
export const deleteProduct = async (token, id) => (await api.delete(`/products/${id}`, authConfig(token))).data;

export const createCategory = async (token, category) => (await api.post("/categories", category, authConfig(token))).data;
export const updateCategory = async (token, id, category) => (await api.put(`/categories/${id}`, category, authConfig(token))).data;
export const deleteCategory = async (token, id) => (await api.delete(`/categories/${id}`, authConfig(token))).data;
export const createSubcategory = async (token, categoryId, name) => (await api.post(`/categories/${categoryId}/subcategories`, { name }, authConfig(token))).data;
export const deleteSubcategory = async (token, id) => (await api.delete(`/subcategories/${id}`, authConfig(token))).data;

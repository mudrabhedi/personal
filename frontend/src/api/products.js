import axios from "axios";

const API = "http://localhost:5000/api/products";

export const getProducts = () => axios.get(API);
export const getProductsByCategory = (category) =>
  axios.get(`${API}/category/${category}`);
export const getFeaturedProducts = () => axios.get(`${API}/featured`);
export const getProductBySlug = (slug) => axios.get(`${API}/${slug}`);
export const createProductApi = (data) => axios.post(API, data);
export const updateProductApi = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteProductApi = (id) => axios.delete(`${API}/${id}`);
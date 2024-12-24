import axiosClient from "./axiosClient";

export const fetchProducts = async () => {
  try {
    const response = await axiosClient.get("/products"); // API lấy thông tin người dùng
    return response.data;
  } catch (error) {
    throw error;
  }
};

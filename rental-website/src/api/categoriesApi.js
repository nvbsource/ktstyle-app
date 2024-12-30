import axiosClient from "./axiosClient";

export const fetchCategories = async () => {
  try {
    const response = await axiosClient.get("/categories"); // API lấy thông tin người dùng
    return response.data;
  } catch (error) {
    throw error;
  }
};

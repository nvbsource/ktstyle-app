import axiosClient from "./axiosClient";

export const fetchUserProfile = async () => {
  try {
    const response = await axiosClient.get("/auth/profile"); // API lấy thông tin người dùng
    return response.data;
  } catch (error) {
    throw error;
  }
};

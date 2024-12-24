import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Lưu thông tin người dùng
  token: localStorage.getItem("token") || null, // Lấy token từ localStorage
  isLoading: false, // Trạng thái loading khi lấy profile
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;

      // Lưu token vào localStorage
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;

      // Xoá token khỏi localStorage
      localStorage.removeItem("token");
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
});

export const { setUser, logout, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;
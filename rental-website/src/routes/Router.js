import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DefaultLayout from "../components/layouts/DefaultLayout";
import Home from "../pages/Home";
import PrivateRoute from "./PrivateRoute";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { logout, setLoading, setUser } from "../redux/authSlice";
import axiosClient from "../api/axiosClient";
import AuthenticateRoute from "./AuthenticateRoute";

const Router = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Gọi API để lấy thông tin người dùng
          const response = await axiosClient.get("/auth/profile");

          // Lưu thông tin người dùng vào Redux
          dispatch(setUser({ token, user: response.data }));
        } catch (error) {
          console.error("Token không hợp lệ hoặc đã hết hạn:", error);
          dispatch(logout());
          localStorage.removeItem("token");
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Route không yêu cầu đăng nhập */}
        <Route
          path="/login"
          element={
            <AuthenticateRoute>
              <Login />
            </AuthenticateRoute>
          }
        />

        {/* Route sử dụng DefaultLayout */}
        <Route element={<DefaultLayout />}>
          {/* Route được bảo vệ */}
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

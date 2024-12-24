import React from "react";
import { FacebookLogin } from "react-facebook-login-lite";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout } from "../redux/authSlice";
import axiosClient from "../api/axiosClient";
import toast from "react-hot-toast";
import { useNavigate, Navigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleResponse = async (response) => {
    console.log("Facebook login response:", response);

    if (response.authResponse) {
      const { accessToken } = response.authResponse;

      try {
        // Gửi accessToken lên backend để xác thực và tạo JWT token
        const res = await axiosClient.post(
          "http://localhost:5005/api/client/auth/facebook",
          { accessToken }
        );

        const data = res.data;
        if (data.user) {
          dispatch(
            setUser({
              user: data.user,
              token: data.token,
            })
          );

          // Lưu token vào localStorage
          localStorage.setItem("token", data.token);
          navigate("/");
          toast("Đăng nhập thành công!");
        } else {
          toast("Xác thực thất bại");
        }
      } catch (error) {
        console.error("Lỗi khi xác thực:", error);
        toast("Đăng nhập thất bại!");
      }
    } else {
      console.error("Facebook login failed or cancelled.");
      toast("Đăng nhập thất bại!");
    }
  };

  const handleError = (error) => {
    console.error("Facebook login error:", error);
    toast("Đăng nhập thất bại!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Trang Chủ - Thuê Đồ</h1>
        <div>
          <p className="mb-4 text-gray-600">Vui lòng đăng nhập để tiếp tục!</p>
          <FacebookLogin
            appId="4029336987294654" // Thay bằng Facebook App ID của bạn
            onSuccess={handleResponse}
            onFailure={handleError}
            scope="email"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

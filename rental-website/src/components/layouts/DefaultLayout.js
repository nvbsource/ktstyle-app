import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom"; // Outlet để hiển thị nội dung trang con
import { fetchUserProfile } from "../../api/authApi";
import { logout, setLoading, setUser } from "../../redux/authSlice";
import Header from "./Header";

const DefaultLayout = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          dispatch(setLoading(true));

          const data = await fetchUserProfile();

          dispatch(
            setUser({
              user: data,
              token,
            })
          );
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error.message);

          localStorage.removeItem("token");
          dispatch(logout());
          navigate("/login");
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return (
    <div className="main-app">
      <Header />
      <Outlet />
    </div>
  );
};

export default DefaultLayout;

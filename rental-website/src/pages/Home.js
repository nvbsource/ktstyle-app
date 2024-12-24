import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import BannerCarousel from "../components/BannerCarousel";
import TitleModule from "../components/TitleModule";
import PolicyHome from "../components/PolicyHome";
import ProductCard from "../components/ProductCard";
import ProductCarousel from "../components/ProductCarousel";
import AllProducts from "../components/AllProducts";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
    toast("Đăng xuất thành công!");
  };

  return (
    <>
      <BannerCarousel />
      <div className="mt-6">
        <PolicyHome />
      </div>
      <div className="mt-6">
        <TitleModule title="Đồ thuê nhiều nhất" />
        <div className="container mt-6">
          <ProductCarousel />
        </div>
      </div>
      <div className="mt-6">
        <TitleModule title="Đồ thuê mới" />
        <div className="container mt-6">
          <AllProducts />
        </div>
      </div>
    </>
  );
};

export default Home;

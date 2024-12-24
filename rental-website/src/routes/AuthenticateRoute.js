import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import toast from "react-hot-toast";

export default function AuthenticateRoute({ children }) {
  const dispatch = useDispatch();
  const access_token = localStorage.getItem("token");

  useEffect(() => {
    if (!access_token) {
      dispatch(logout());
    }
  }, [dispatch]);

  return !access_token ? children : <Navigate to="/" />;
}

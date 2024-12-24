import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

function PrivateRoute({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const access_token = localStorage.getItem("token");
    if (!access_token) {
      dispatch(logout());
      navigate("/login");
    }
  }, [dispatch]);

  return user ? children : null;
}

export default PrivateRoute;

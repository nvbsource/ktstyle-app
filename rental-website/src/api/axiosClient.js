import axios from "axios";

let store; // Redux store
let navigate; // React Router navigate function

export const injectStoreAndNavigate = (_store, _navigate) => {
  store = _store; // Truyền Redux store
  navigate = _navigate; // Truyền React Router navigate
};

const axiosClient = axios.create({
  baseURL: "http://localhost:5005/api/client", // Thay bằng URL API của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor request: Thêm token vào header nếu có
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response: Xử lý lỗi 401
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xóa token khỏi localStorage
      localStorage.removeItem("token");

      // Dispatch action logout
      if (store) {
        store.dispatch({ type: "auth/logout" }); // Dispatch action logout trong slice
      }

      // Chuyển hướng người dùng đến trang đăng nhập
      if (navigate) {
        navigate("/login");
      }
    }

    return Promise.reject(error); // Tiếp tục trả lỗi để xử lý thêm nếu cần
  }
);

export default axiosClient;
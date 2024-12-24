import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserCircleIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { logout } from "../../redux/authSlice";

export default function HeaderRight() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    setDropdownVisible(false); // Ẩn menu sau khi đăng xuất
  };

  // Ẩn dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Avatar */}
      <div className="header-action-item header-action_account relative">
        {/* <button
          className="a-hea flex items-center justify-center relative"
          onClick={toggleDropdown}
        >
          <span className="box-icon overflow-hidden w-10 h-10 rounded-full">
            {user ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                width={24}
                height={21}
                viewBox="0 0 24 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.489 13.1807C14.3696 13.2755 14.3 13.4197 14.3 13.5722V14.7C14.3 14.9253 14.3326 15.203 14.4732 15.4994C14.6138 15.7959 14.8474 16.0797 15.2033 16.342C15.8993 16.8552 17.0935 17.3086 19.1177 17.6432C21.0005 17.9602 22.5151 19.0443 23.2537 20.5H0.655958C1.19275 19.0419 2.62304 17.9144 4.47215 17.6448L4.47215 17.6448L4.47685 17.6441C6.50643 17.3283 7.78489 16.8766 8.56919 16.3755C9.36517 15.867 9.7 15.2705 9.7 14.7V13.5722C9.7 13.4197 9.63039 13.2755 9.51097 13.1807C8.1334 12.0866 6.9 10.3494 6.9 8.4V5.03611C6.9 3.37303 7.56673 2.26285 8.50891 1.55408C9.47039 0.830788 10.7561 0.5 12 0.5C13.2439 0.5 14.5296 0.830788 15.4911 1.55408C16.4333 2.26285 17.1 3.37303 17.1 5.03611V8.4C17.1 10.3307 15.8658 12.0872 14.489 13.1807Z"
                  stroke="#222222"
                  strokeMiterlimit={10}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span className="item-title">Tài khoản</span>
        </button> */}

        {/* Dropdown Menu */}
        <div
          ref={dropdownRef}
          className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 ${
            isDropdownVisible ? "block" : "hidden"
          } lg:top-[68px]`}
        >
          <ul className="py-2">
            {/* Lịch sử thuê đồ */}
            <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <UserCircleIcon className="w-5 h-5 text-gray-600 mr-3" />
              <a href="/rental-history" className="text-sm text-gray-800">
                Lịch sử thuê đồ
              </a>
            </li>
            {/* Đăng xuất */}
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-sm text-gray-800">Đăng xuất</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Giỏ hàng */}
      <div className="header-action-item header-action_cart">
        <a
          className="a-hea"
          href="/cart"
          aria-label="Giỏ hàng"
          title="Giỏ hàng"
        >
          <span className="add-to-cart-lv2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 321.2 321.2">
              <path
                d="M306.4,313.2l-24-223.6c-0.4-3.6-3.6-6.4-7.2-6.4h-44.4V69.6c0-38.4-31.2-69.6-69.6-69.6c-38.4,0-69.6,31.2-69.6,69.6 v13.6H46c-3.6,0-6.8,2.8-7.2,6.4l-24,223.6c-0.4,2,0.4,4,1.6,5.6c1.2,1.6,3.2,2.4,5.2,2.4h278c2,0,4-0.8,5.2-2.4 C306,317.2,306.8,315.2,306.4,313.2z M223.6,123.6c3.6,0,6.4,2.8,6.4,6.4c0,3.6-2.8,6.4-6.4,6.4c-3.6,0-6.4-2.8-6.4-6.4 C217.2,126.4,220,123.6,223.6,123.6z M106,69.6c0-30.4,24.8-55.2,55.2-55.2c30.4,0,55.2,24.8,55.2,55.2v13.6H106V69.6z M98.8,123.6c3.6,0,6.4,2.8,6.4,6.4c0,3.6-2.8,6.4-6.4,6.4c-3.6,0-6.4-2.8-6.4-6.4C92.4,126.4,95.2,123.6,98.8,123.6z M30,306.4 L52.4,97.2h39.2v13.2c-8,2.8-13.6,10.4-13.6,19.2c0,11.2,9.2,20.4,20.4,20.4c11.2,0,20.4-9.2,20.4-20.4c0-8.8-5.6-16.4-13.6-19.2 V97.2h110.4v13.2c-8,2.8-13.6,10.4-13.6,19.2c0,11.2,9.2,20.4,20.4,20.4c11.2,0,20.4-9.2,20.4-20.4c0-8.8-5.6-16.4-13.6-19.2V97.2 H270l22.4,209.2H30z"
                stroke="#222222"
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="count_item_pr">0</span>
          </span>
          <span className="item-title">Giỏ hàng</span>
        </a>
      </div>
    </>
  );
}
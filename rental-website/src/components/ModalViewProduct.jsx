import React from "react";

export default function ModalViewProduct({ isOpen, onClose, title, children, size = "large" }) {
  if (!isOpen) return null; // Nếu modal không mở, không render gì

  const handleOverlayClick = (e) => {
    // Nếu click vào chính lớp overlay, thì đóng Modal
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Map kích thước modal với TailwindCSS classes
  const sizeClasses = {
    small: "max-w-sm", // Nhỏ
    large: "max-w-2xl", // To
    extraLarge: "max-w-4xl", // Siêu to
  };

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto px-2"
      onClick={handleOverlayClick} // Xử lý sự kiện click trên lớp overlay
    >
      <div
        className={`relative bg-white w-full ${sizeClasses[size]} mt-12 rounded-lg shadow-lg overflow-hidden`}
      >
        {/* Modal Header */}
          <button
            onClick={onClose} // Đóng Modal khi click vào nút đóng
            className="text-gray-500 hover:text-gray-700 transition absolute right-2 top-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>

        {/* Modal Content */}
        <div className="p-4 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
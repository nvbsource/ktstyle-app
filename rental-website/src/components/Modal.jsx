import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null; // Nếu modal không mở, không render gì

  const handleOverlayClick = (e) => {
    // Nếu click vào chính lớp overlay, thì đóng Modal
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick} // Xử lý sự kiện click trên lớp overlay
    >
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose} // Đóng Modal khi click vào nút đóng
            className="text-gray-500 hover:text-gray-700 transition"
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
        </div>

        {/* Modal Content */}
        <div className="p-4">{children}</div>
        {/* Modal Footer */}
        <div className="px-4 py-3 border-t flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

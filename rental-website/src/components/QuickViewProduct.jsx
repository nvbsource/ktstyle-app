import React, { useEffect, useState } from "react";
import ModalViewProduct from "./ModalViewProduct";
import { formatNumberToCurrency } from "../helpers/index";

export default function QuickViewProduct({
  isModalOpen,
  handleCloseModal,
  data,
}) {
  // Trạng thái ảnh lớn hiện tại
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    setCurrentImage(data?.thumbnail);
  }, [data]);

  // Xử lý khi click vào ảnh nhỏ
  const handleClickImage = (src) => {
    setCurrentImage(src); // Thay đổi ảnh lớn khi ảnh nhỏ được click
  };

  return (
    <ModalViewProduct
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title={`Xem nhanh: `}
      size="extraLarge"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Hình ảnh sản phẩm */}
        <div className="flex flex-col md:w-1/2">
          {/* Ảnh lớn */}
          <img
            src={currentImage}
            alt="Hình ảnh sản phẩm"
            className="w-full rounded-lg"
          />

          {/* Danh sách ảnh nhỏ */}
          <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {data?.images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Hình ảnh ${index + 1}`}
                className={`w-20 h-20 md:w-16 md:h-16 object-cover rounded-lg border transition ${
                  currentImage === src ? "border-[#ff5b6a] border-2" : "border-gray-300"
                }`}
                onClick={() => handleClickImage(src)} // Thay đổi ảnh lớn khi click
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="md:w-1/2">
          <h2 className="text-xl font-bold">{data?.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Độ mới: <span className="font-medium">99%</span> | Mã sản phẩm:{" "}
            <span className="font-medium">{data?.id}</span>
          </p>

          <p className="text-2xl text-red-500 font-semibold my-4">
            {formatNumberToCurrency(data?.rental_price)} đ
          </p>

          <p className="text-gray-500 mb-4">
            {data?.description || `Thông tin sản phẩm đang cập nhật`}
          </p>

          {/* Kích thước */}
          <div className="mb-4">
            <p className="font-medium">Kích thước (màu sắc):</p>
            <div className="flex gap-2 mt-2">
              {data?.variants?.map((item) => (
                <button
                  key={item.id}
                  className="px-4 py-2 flex items-center justify-center border rounded-lg hover:border-black transition"
                >
                  {item.size} - {item.color}
                </button>
              ))}
            </div>
          </div>

          {/* Thêm vào giỏ hàng */}
          <div className="flex items-center gap-4 mt-6">
            {/* Số lượng */}
            <div className="flex items-center border rounded-lg overflow-hidden flex-1">
              <button className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition">
                -
              </button>
              <input
                type="number"
                className="flex-1 h-10 text-center border-none p-0"
                defaultValue={1}
                min={1}
              />
              <button className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition">
                +
              </button>
            </div>

            {/* Nút thêm vào giỏ hàng */}
            <button className="h-10 bg-[#ff5b6a] text-white font-medium rounded-lg hover:bg-gray-800 transition px-3">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </ModalViewProduct>
  );
}
import React from "react";
import ModalViewProduct from "./ModalViewProduct";
import { formatNumberToCurrency } from '../helpers/index';

export default function QuickViewProduct({ isModalOpen, handleCloseModal, data }) {
  return (
    <ModalViewProduct
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title={`Xem nhanh: `}
      size="extraLarge"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Hình ảnh sản phẩm */}
        <div className="flex flex-col items-center md:w-1/2">
          <img
            src={data?.images[0]}
            alt="Áo Kiểu Nữ Lanna Top RR24AK60"
            className="w-full rounded-lg"
          />
          <div className="flex gap-2 mt-4">
            {/* Hình ảnh nhỏ */}
            {data?.images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Hình ảnh ${index + 1}`}
                className="w-12 h-12 object-cover rounded-lg border hover:border-black transition"
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="md:w-1/2">
          <h2 className="text-xl font-bold">{data?.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Độ mới: <span className="font-medium">99%</span> | Mã
            sản phẩm: <span className="font-medium">{data?.id}</span>
          </p>

          <p className="text-2xl text-red-500 font-semibold my-4">{formatNumberToCurrency(data?.rental_price)} đ</p>

          <p className="text-gray-500 mb-4">{data?.description || `Thông tin sản phẩm đang cập nhật`}</p>

          {/* Kích thước */}
          <div className="mb-4">
            <p className="font-medium">Kích thước (màu sắc):</p>
            <div className="flex gap-2 mt-2">
              {data?.variants?.map(item => <button key={item.id} className="px-4 py-2 flex items-center justify-center border rounded-lg hover:border-black transition">
                {item.size} - {item.color}
              </button>)}
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
            <button className="h-10 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition px-3">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </ModalViewProduct>
  );
}

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "./ProductCard";
import { Navigation } from "swiper/modules";
import ModalViewProduct from "./ModalViewProduct";
import QuickViewProduct from "./QuickViewProduct";

export default function ProductCarousel() {
  const products = [1, 2, 3, 4, 5, 6, 7, 8]; // Danh sách sản phẩm giả định
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="relative w-full">
      {/* Nút Left */}
      <button
        className="swiper-button-prev absolute top-1/2 left-0 transform -translate-y-[65%] z-50 flex items-center justify-center"
        aria-label="Previous"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {/* Nút Right */}
      <button
        className="swiper-button-next absolute top-1/2 left-0 transform -translate-y-[65%] z-50 flex items-center justify-center"
        aria-label="Next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      <Swiper
        modules={[Navigation]} // Kích hoạt module Navigation
        spaceBetween={10} // Khoảng cách giữa các slide
        slidesPerView={1.4} // Số sản phẩm hiển thị trên màn hình nhỏ
        breakpoints={{
          640: {
            slidesPerView: 2, // Hiển thị 2 sản phẩm trên màn hình >= 640px
          },
          768: {
            slidesPerView: 3, // Hiển thị 3 sản phẩm trên màn hình >= 768px
          },
          1024: {
            slidesPerView: 4, // Hiển thị 4 sản phẩm trên màn hình >= 1024px
          },
        }}
        navigation={{
          prevEl: ".swiper-button-prev", // Gắn nút custom Left
          nextEl: ".swiper-button-next", // Gắn nút custom Right
        }}
        className="mySwiper"
      >
        {products.map((_, index) => (
          <SwiperSlide key={index}>
            <ProductCard quickView={handleQuickView} />
          </SwiperSlide>
        ))}
      </Swiper>

     <QuickViewProduct isModalOpen={isModalOpen} handleCloseModal={handleCloseModal}/>
    </div>
  );
}

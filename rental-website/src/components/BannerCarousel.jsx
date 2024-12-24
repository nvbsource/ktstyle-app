import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";
import { Autoplay, EffectFade } from "swiper/modules";

export default function BannerCarousel() {
  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade" // Hiệu ứng chuyển mượt
        autoplay={{
          delay: 3000, // Tự động chuyển ảnh sau 3 giây
          disableOnInteraction: false, // Tiếp tục autoplay dù người dùng tương tác
        }}
        loop={true} // Lặp lại khi hết ảnh
        className="w-full h-auto"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <img
            src="https://bizweb.dktcdn.net/100/462/587/themes/880841/assets/slider_3.jpg?1732791696626"
            alt="Slide 1"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <img
            src="https://bizweb.dktcdn.net/100/462/587/themes/880841/assets/slider_2.jpg?1732791696626"
            alt="Slide 2"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
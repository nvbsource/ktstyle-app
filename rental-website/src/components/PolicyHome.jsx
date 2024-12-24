import React from "react";

export default function PolicyHome() {
  return (
    <div className="container">
      <div className="grid grid-cols-12 gap-2 md:gap-3 lg:gap-5">
        <div className="col-span-6 md:col-span-3">
          <div className="flex flex-col lg:flex-row gap-3 border-[2px] border-gray-100 p-3 rounded-lg items-center">
            <div className="icon">
              <img
                className="lazyload loaded w-[35px] h-[35px] lg:w-[50px] lg:h-[50px]"
                src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/ser_1.png?1732791696626"
                data-src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/ser_1.png?1732791696626"
                alt="Thời Trang Nữ RUBIES"
                data-was-processed="true"
              />
            </div>
            <div className="text-[12px] lg:text-sm">
              Vận chuyển <span className="font-bold">MIỄN PHÍ</span> <br />{" "}
              Trong bán kính{" "}
              <span className="font-bold">2km</span>
            </div>
          </div>
        </div>
        <div className="col-span-6 md:col-span-3">
          <div className="flex flex-col lg:flex-row gap-3 border-[2px] border-gray-100 p-3 rounded-lg items-center">
            <div className="icon">
              <img
                className="lazyload loaded w-[35px] h-[35px] lg:w-[50px] lg:h-[50px]"
                src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/ser_2.png?1732791696626"
                data-src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/ser_2.png?1732791696626"
                alt="Thời Trang Nữ RUBIES"
                data-was-processed="true"
              />
            </div>
            <div className="text-[12px] lg:text-sm">
              Tích điểm Nâng hạng
              <br />
              <span className="font-bold">THẺ THÀNH VIÊN</span>
            </div>
          </div>
        </div>
        <div className="col-span-6 md:col-span-3">
          <div className="flex flex-col lg:flex-row gap-3 border-[2px] border-gray-100 p-3 rounded-lg items-center">
            <div className="icon">
              <img
                className="lazyload loaded w-[35px] h-[35px] lg:w-[50px] lg:h-[50px]"
                src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/ser_3.png?1732791696626"
                data-src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/ser_3.png?1732791696626"
                alt="Thời Trang Nữ RUBIES"
                data-was-processed="true"
              />
            </div>
            <div className="text-[12px] lg:text-sm">
              Tiến hành <span className="font-bold">THANH TOÁN</span> <br /> Với
              nhiều <span className="font-bold">PHƯƠNG THỨC</span>
            </div>
          </div>
        </div>
        <div className="col-span-6 md:col-span-3">
          <div className="flex flex-col lg:flex-row gap-3 border-[2px] border-gray-100 p-3 rounded-lg items-center">
            <div className="icon">
              <img
                className="lazyload loaded w-[35px] h-[35px] lg:w-[50px] lg:h-[50px]"
                src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/ser_4.png?1732791696626"
                data-src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/ser_4.png?1732791696626"
                alt="Thời Trang Nữ RUBIES"
                data-was-processed="true"
              />
            </div>
            <div className="text-[12px] lg:text-sm">
              <span className="font-bold">100% HOÀN TIỀN</span>
              <br /> nếu sản phẩm không vừa
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

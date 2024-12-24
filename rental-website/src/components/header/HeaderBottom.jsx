import { ChevronDownIcon, StarIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function HeaderBottom() {
  return (
    <ul id="nav" className="nav">
      <li className="nav-item ">
        <a className="nav-link" href="/" title="Trang Chủ">
          Trang Chủ
        </a>
      </li>
      <li className="nav-item has-childs has-mega">
        <a href="/thoi-trang-nu" className="nav-link" title="Thời Trang Nữ">
          Thời Trang Nữ
          <ChevronDownIcon className="h-4 w-4" />
        </a>
        <i className="open_mnu down_icon" />
        <div className="mega-content">
          <div className="grid grid-cols-12 gap-10">
            {/* Banner bên trái */}
            <div className="col-span-3 mega-banner">
              <a
                href="/thoi-trang-nu"
                title="Thời Trang Nữ"
                className="banner-effect"
              >
                <img
                  src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/mega-1-image-1.jpg?1732791696626"
                  data-src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/mega-1-image-1.jpg?1732791696626"
                  alt="Thời Trang Nữ"
                  className="lazyload img-responsive mx-auto d-block loaded"
                  data-was-processed="true"
                />
              </a>
            </div>

            {/* Danh mục chính giữa */}
            <div className="col-span-6 overflow-auto max-h-full relative">
              <div className="grid grid-cols-3 gap-6 absolute w-full mt-3">
                {/* Block 1 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    ÁO NỮ
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Áo Thun Nữ
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Áo Sơ Mi Nữ
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Áo Kiểu Nữ
                    </li>
                  </ul>
                </div>

                {/* Block 2 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    ÁO KHOÁC NỮ
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Áo Khoác Kiểu Nữ
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Áo Khoác Blazer Nữ
                    </li>
                  </ul>
                </div>

                {/* Block 3 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    QUẦN NỮ
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Quần Dài Nữ
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Quần Jeans Nữ
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Quần Ngắn Nữ
                    </li>
                  </ul>
                </div>

                {/* Block 4 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    VÁY
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Váy Ngắn
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Váy Dài
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Váy Quần
                    </li>
                  </ul>
                </div>

                {/* Block 5 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    ĐẦM
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Đầm Dài
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Đầm Ngắn
                    </li>
                  </ul>
                </div>

                {/* Block 6 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    SET ĐỒ NỮ
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Set Áo và Váy Nữ
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Set Áo và Quần Nữ
                    </li>
                  </ul>
                </div>

                {/* Block 7 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    PHỤ KIỆN
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">Túi</li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">Nón</li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Nội Y
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Khăn
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Cài Áo
                    </li>
                  </ul>
                </div>

                {/* Block 8 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    JUMPSUIT
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Jumpsuit Ngắn
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Jumpsuit Dài
                    </li>
                  </ul>
                </div>

                {/* Block 9 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    ĐỒ BỘ NỮ
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Đồ Bộ Nữ Dài
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Đồ Bộ Nữ Ngắn
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Banner bên phải */}
            <div className="col-span-3 mega-banner">
              <a
                href="/thoi-trang-nu"
                title="Thời Trang Nữ"
                className="banner-effect"
              >
                <img
                  src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/mega-1-image-2.jpg?1732791696626"
                  data-src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/mega-1-image-2.jpg?1732791696626"
                  alt="Thời Trang Nữ"
                  className="lazyload img-responsive mx-auto d-block loaded"
                  data-was-processed="true"
                />
              </a>
            </div>
          </div>
        </div>
      </li>
      <li className="nav-item has-childs has-mega">
        <a href="/thoi-trang-nu" className="nav-link" title="Thời Trang Nữ">
          Phụ kiện
          <ChevronDownIcon className="h-4 w-4" />
        </a>
        <i className="open_mnu down_icon" />
        <div className="mega-content">
          <div className="grid grid-cols-12 gap-10">
            {/* Banner bên trái */}
            <div className="col-span-3 mega-banner">
              <a
                href="/thoi-trang-nu"
                title="Thời Trang Nữ"
                className="banner-effect"
              >
                <img
                  src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/mega-1-image-1.jpg?1732791696626"
                  data-src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/mega-1-image-1.jpg?1732791696626"
                  alt="Thời Trang Nữ"
                  className="lazyload img-responsive mx-auto d-block loaded"
                  data-was-processed="true"
                />
              </a>
            </div>

            {/* Danh mục chính giữa */}
            <div className="col-span-6 overflow-auto max-h-full relative">
              <div className="grid grid-cols-3 gap-6 absolute w-full mt-3">
                {/* Block 1 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    ÁO NỮ
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Áo Thun Nữ
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Áo Sơ Mi Nữ
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Áo Kiểu Nữ
                    </li>
                  </ul>
                </div>

                {/* Block 2 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    ÁO KHOÁC NỮ
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Áo Khoác Kiểu Nữ
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Áo Khoác Blazer Nữ
                    </li>
                  </ul>
                </div>

                {/* Block 3 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    QUẦN NỮ
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Quần Dài Nữ
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Quần Jeans Nữ
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Quần Ngắn Nữ
                    </li>
                  </ul>
                </div>

                {/* Block 4 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    VÁY
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Váy Ngắn
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Váy Dài
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Váy Quần
                    </li>
                  </ul>
                </div>

                {/* Block 5 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    ĐẦM
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Đầm Dài
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Đầm Ngắn
                    </li>
                  </ul>
                </div>

                {/* Block 6 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    SET ĐỒ NỮ
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Set Áo và Váy Nữ
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Set Áo và Quần Nữ
                    </li>
                  </ul>
                </div>

                {/* Block 7 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    PHỤ KIỆN
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">Túi</li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">Nón</li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Nội Y
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Khăn
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Cài Áo
                    </li>
                  </ul>
                </div>

                {/* Block 8 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    JUMPSUIT
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Jumpsuit Ngắn
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Jumpsuit Dài
                    </li>
                  </ul>
                </div>

                {/* Block 9 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm border-b border-gray-300 pb-2 cursor-pointer">
                    ĐỒ BỘ NỮ
                  </h3>
                  <ul className="mt-0">
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Đồ Bộ Nữ Dài
                    </li>
                    <li className="list-disc list-inside text-gray-700 text-[13px] leading-none py-2 cursor-pointer hover:text-gray-950 hover:underline transition duration-200 ease-in-out">
                      Đồ Bộ Nữ Ngắn
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Banner bên phải */}
            <div className="col-span-3 mega-banner">
              <a
                href="/thoi-trang-nu"
                title="Thời Trang Nữ"
                className="banner-effect"
              >
                <img
                  src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/mega-1-image-2.jpg?1732791696626"
                  data-src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/mega-1-image-2.jpg?1732791696626"
                  alt="Thời Trang Nữ"
                  className="lazyload img-responsive mx-auto d-block loaded"
                  data-was-processed="true"
                />
              </a>
            </div>
          </div>
        </div>
      </li>
      <li class="nav-item "><a class="nav-link" href="/" title="Trang Chủ">Feedback khách hàng <StarIcon className="w-5 h-5"/></a></li>
      <li className="nav-item has-childs">
        <a href="/rubies-rubies" className="nav-link" title="Trợ Giúp">
          Trợ Giúp
          <ChevronDownIcon className="h-4 w-4" />
        </a>
        <i className="open_mnu down_icon" />
        <ul className="dropdown-menu">
          <li className="nav-item-lv2">
            <a className="nav-link" href="/" title="Về Chúng Tôi">
              Về Chúng Tôi
            </a>
          </li>
          <li className="nav-item-lv2">
            <a
              className="nav-link"
              href="/cham-soc-khach-hang"
              title="Chăm Sóc Khách Hàng"
            >
              Chăm Sóc Khách Hàng
            </a>
          </li>
          <li className="nav-item-lv2">
            <a
              className="nav-link"
              href="/tuyen-dung-viec-lam"
              title="Tuyển Dụng & Việc Làm"
            >
              Tuyển Dụng &amp; Việc Làm
            </a>
          </li>
        </ul>
      </li>
      <li className="nav-item li-kmdiscount">
        <a className="nav-link" title="Khuyến mãi" href="/khuyen-mai">
          <img
            width={32}
            height={32}
            alt="Khuyến mãi"
            src="//bizweb.dktcdn.net/100/462/587/themes/880841/assets/code_dis.gif?1732791696626"
          />
          Khuyến Mãi
        </a>
      </li>
    </ul>
  );
}

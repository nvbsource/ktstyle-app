import React, { useState, useEffect } from "react";
import HeaderTop from "../header/HeaderTop";
import HeaderBottom from "../header/HeaderBottom";
import HeaderLogo from "../header/HeaderLogo";
import HeaderRight from "../header/HeaderRight";
import MobileMenu from "../header/MobileMenu";
import SearchMobile from "../header/SearchMobile";

export default function Header() {
  const [isShowMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleShowMenu = () => setShowMenu(!isShowMenu);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        // Nếu cuộn xuống hơn 100px, thêm trạng thái "scrolled"
        setIsScrolled(true);
      } else {
        // Nếu quay lại trên cùng, xóa trạng thái "scrolled"
        setIsScrolled(false);
      }
    };

    // Lắng nghe sự kiện scroll
    window.addEventListener("scroll", handleScroll);

    // Dọn dẹp sự kiện khi component bị unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Chỉ chạy một lần khi component mount

  return (
    <header
      className={`header ${
        isScrolled ? "navbar-fixed-top animated fadeInDown" : ""
      }`}
    >
      <div className="main-header">
        <div className="container">
          <div className="box-hearder">
            <div className="content-header grid grid-cols-12 items-center gap-4">
              <div class="left-mobile col-span-2">
                <button
                  onClick={handleShowMenu}
                  class="menu-icon"
                  aria-label="Menu"
                  id="btn-menu-mobile"
                  title="Menu"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <line
                      y1="4.5"
                      x2="24"
                      y2="4.5"
                      stroke="#222222"
                    ></line>{" "}
                    <line y1="11.5" x2="24" y2="11.5" stroke="#222222"></line>{" "}
                    <line y1="19.5" x2="24" y2="19.5" stroke="#222222"></line>{" "}
                  </svg>
                </button>
              </div>
              {/* Cột Logo */}
              <div className="col-span-8 lg:col-span-2 header-logo">
                <HeaderLogo />
              </div>

              {/* Cột Content Chính */}
              {/* <div className="static md:col-span-8 header-mid current"> */}
              <div
                className={`static col-span-8 header-mid ${
                  isShowMenu ? "current" : ""
                }`}
              >
                <HeaderTop />
                <div className="title_menu" onClick={handleShowMenu}>
                  <span className="title_">Danh mục sản phẩm</span>
                </div>
                <HeaderBottom />
              </div>

              {/* Cột Phần Phải */}
              <div className="col-span-2 header-right flex">
                <HeaderRight />
              </div>

              {/* Tìm kiếm trên Mobile */}
              <div className="search-mobile md:hidden">
                <SearchMobile />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

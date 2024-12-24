import React from "react";

export default function MobileMenu() {
  return (
    <div className="evo-header-flex-item left-mobile col-lg-2 col-md-2 d-sm-inline-block d-lg-none">
      <button
        className="menu-icon"
        aria-label="Menu"
        id="btn-menu-mobile"
        title="Menu"
      >
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {" "}
          <line y1="4.5" x2={24} y2="4.5" stroke="#222222" />{" "}
          <line y1="11.5" x2={24} y2="11.5" stroke="#222222" />{" "}
          <line y1="19.5" x2={24} y2="19.5" stroke="#222222" />{" "}
        </svg>
      </button>
      <div className="header-action-item search-mobile event-search">
        <a href="javascript:;" aria-label="Tìm kiếm" title="Tìm kiếm" className>
          <span className="box-icon">
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {" "}
              <path
                d="M14.1404 13.4673L19.852 19.1789C20.3008 19.6276 19.6276 20.3008 19.1789 19.852L13.4673 14.1404C12.0381 15.4114 10.1552 16.1835 8.09176 16.1835C3.6225 16.1835 0 12.5613 0 8.09176C0 3.6225 3.62219 0 8.09176 0C12.561 0 16.1835 3.62219 16.1835 8.09176C16.1835 10.1551 15.4115 12.038 14.1404 13.4673ZM0.951972 8.09176C0.951972 12.0356 4.14824 15.2316 8.09176 15.2316C12.0356 15.2316 15.2316 12.0353 15.2316 8.09176C15.2316 4.14797 12.0353 0.951972 8.09176 0.951972C4.14797 0.951972 0.951972 4.14824 0.951972 8.09176Z"
                fill="#222222"
              />{" "}
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}

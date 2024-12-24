import React from "react";
import styled from "styled-components";

const ListTop = styled.ul`
  padding-left: 0px;
  line-height: 40px;
  justify-content: center;
  -webkit-box-pack: justify !important;
  -ms-flex-pack: justify !important;
  justify-content: space-between !important;
`;

const ListTopItem = styled.li`
  height: 40px;
  line-height: 40px;
  font-size: 12px;
`;

export default function HeaderTop() {
  return (
    <div className="menu-top">
      <ListTop className="flex">
        <ListTopItem className="header-hotline gap-2 !flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
              clipRule="evenodd"
            />
          </svg>

          <span>Hotline:</span>
          <a href="tel:0703470938" title="Hotline: 070 347 0938">
            070 347 0938
          </a>
        </ListTopItem>
        <ListTopItem className="header-stores !flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            Chung cư Hacom Galacity toà A1
          </span>
        </ListTopItem>
        <ListTopItem className="header-search hidden">
          <form
            action="/search"
            method="get"
            className="header-search-form input-group search-bar"
            role="search"
          >
            <input
              type="text"
              name="query"
              required
              className="input-group-field auto-search search-auto form-control"
              placeholder="Tìm sản phẩm..."
              autoComplete="off"
            />
            <input type="hidden" name="type" defaultValue="product" />
            <button
              type="submit"
              className="btn icon-fallback-text"
              aria-label="Tìm kiếm"
              title="Tìm kiếm"
            >
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
            </button>
            <div className="search-suggest">
              <div className="item-suggest">
                <div className="search-title">
                  <i>
                    <svg
                      width="16px"
                      height="16px"
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      viewBox="-22 0 134 134.06032"
                    >
                      {" "}
                      <g>
                        {" "}
                        <path
                          d="M 23.347656 134.058594 C 8.445312 84.953125 39.933594 67.023438 39.933594 67.023438 C 37.730469 93.226562 52.621094 113.640625 52.621094 113.640625 C 58.097656 111.988281 68.550781 104.265625 68.550781 104.265625 C 68.550781 113.640625 63.035156 134.046875 63.035156 134.046875 C 63.035156 134.046875 82.34375 119.117188 88.421875 94.320312 C 94.492188 69.523438 76.859375 44.628906 76.859375 44.628906 C 77.921875 62.179688 71.984375 79.441406 60.351562 92.628906 C 60.933594 91.957031 61.421875 91.210938 61.796875 90.402344 C 63.886719 86.222656 67.242188 75.359375 65.277344 50.203125 C 62.511719 14.890625 30.515625 0 30.515625 0 C 33.273438 21.515625 25.003906 26.472656 5.632812 67.3125 C -13.738281 108.144531 23.347656 134.058594 23.347656 134.058594 Z M 23.347656 134.058594 "
                          style={{
                            stroke: "none",
                            fillRule: "nonzero",
                            fill: "rgb(0%,0%,0%)",
                            fillOpacity: 1,
                          }}
                        />
                      </g>
                    </svg>
                  </i>
                  Tìm kiếm nhiều nhất
                </div>
                <div className="search-list">
                  <a
                    href="/search?q=Áo%20sơ%20mi"
                    className="search-item"
                    title="Tìm kiếm Áo sơ mi"
                  >
                    Áo sơ mi
                  </a>
                </div>
              </div>
              <div className="list-search"></div>
            </div>
          </form>
        </ListTopItem>
      </ListTop>
    </div>
  );
}

import React from "react";

export default function SearchMobile() {
  return (
    <div className="search-mobile search_form d-none open">
      <form
        className="input-group search-bar search_form"
        action="/search"
        method="get"
        role="search"
      >
        <input
          type="text"
          name="query"
          required
          className="input-group-field auto-search search-auto form-control"
          placeholder="TÌM SẢN PHẨM..."
          autoComplete="off"
        />
        <input type="hidden" name="type" defaultValue="product" />
        <span className="input-group-btn">
          <button
            type="submit"
            className="btn icon-fallback-text"
            aria-label="Tìm kiếm"
            title="Tìm kiếm"
          >
            <svg viewBox="0 0 512 512">
              <g fill="#333">
                <path d="M495,466.2L377.2,348.4c29.2-35.6,46.8-81.2,46.8-130.9C424,103.5,331.5,11,217.5,11C103.4,11,11,103.5,11,217.5   S103.4,424,217.5,424c49.7,0,95.2-17.5,130.8-46.7L466.1,495c8,8,20.9,8,28.9,0C503,487.1,503,474.1,495,466.2z M217.5,382.9   C126.2,382.9,52,308.7,52,217.5S126.2,52,217.5,52C308.7,52,383,126.3,383,217.5S308.7,382.9,217.5,382.9z" />
              </g>
            </svg>
          </button>
        </span>
        <span className="input-group-btn">
          <a href="javascript:void(0);" className="btn search-close">
            <svg viewBox="0 0 512 512">
              <g fill="#333">
                <path
                  d="M342.3,132.9c-5.3-5.3-13.8-5.3-19.1,0l-85.6,85.6L152,132.9c-5.3-5.3-13.8-5.3-19.1,0c-5.3,5.3-5.3,13.8,0,19.1
                                         l85.6,85.6l-85.6,85.6c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l85.6-85.6l85.6,85.6c2.6,2.6,6.1,4,9.5,4
                                         c3.5,0,6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1l-85.4-85.6l85.6-85.6C347.6,146.7,347.6,138.2,342.3,132.9z"
                />
              </g>
            </svg>
          </a>
        </span>
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
              <a
                href="/search?q=Áo%20khoác"
                className="search-item"
                title="Tìm kiếm Áo khoác"
              >
                Áo khoác
              </a>
            </div>
          </div>
          <div className="list-search"></div>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { formatNumberToCurrency } from "../helpers";
import { EyeIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import discountIcon from "../assets/images/icon-discount.svg"; // Nhập ảnh từ thư mục assets

const Card = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  .product-image {
    width: 100%;
    height: 270px;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover .product-image {
    transform: scale(1.1);
  }
`;

const ProductInfo = styled.div`
  padding: 16px;
  h5 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    transition: color 0.3s ease;

    &:hover {
      color: #ff6b6b;
    }
  }

  .price {
    font-size: 20px;
    font-weight: bold;
    color: #ff5b6a;
    margin-bottom: 8px;
  }
  .btn-addtocart {
    width: 45px;
    height: 45px;
    button {
      width: 100%;
      margin: 0;
      padding: 5px;
      font-size: 24px;
      line-height: 1.3;
      max-height: 45px;
      background-color: #ff5b6a;
    }
  }
  .discount-f {
    margin-bottom: 0;
    background: url(${discountIcon}) no-repeat; /* Sử dụng biến đã import */
    padding-left: 24px;
    min-height: 20px;
    .price-old {
      color: #6b6c6c;
      text-decoration: line-through;
    }
  }
`;

const PopupMenu = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  text-align: center;
  width: 90%;
  max-width: 400px;

  .popup-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    margin-top: 8px;
    background-color: #f9f9f9;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #f1f1f1;
    }

    svg {
      width: 20px;
      height: 20px;
      color: #ff6b6b;
    }

    span {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const BgCode = styled.span`
  border: 3px solid #ff5c6a;
  border-radius: 50%;
  height: 42px;
  width: 42px;
  left: -3px;
  top: -3px;
  animation: pulsate 1.2s ease-out infinite;
  opacity: 0;
  position: absolute;

  @keyframes pulsate {
    0% {
      transform: scale(0.1);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`;

const NumberCode = styled.span`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  width: 36px;
  height: 36px;
  line-height: 36px;
  background-color: #ff5c6a;
  border-radius: 50%;
  display: inline-block;
`;
export default function ProductCard({ quickView, product, addToCart }) {
  const [showPopup, setShowPopup] = useState(false);

  const handlePopupOpen = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  return (
    <>
      {/* Thẻ sản phẩm */}
      <Card onClick={(e) => quickView(e, product)}>
        <div className="absolute top-3 left-3 flex items-center justify-center text-center">
          <BgCode />
          <NumberCode>#{product?.id}</NumberCode>
        </div>
        <img src={product?.thumbnail} alt="Product" className="product-image" />
        <ProductInfo>
          <h5 className="line-clamp-1">{product?.name}</h5>
          <div class="flex justify-between">
            <div class="info">
              <p class="price">89.000 ₫</p>
              <p class="discount-f">
                <span class="price-old">141.000 ₫</span>
              </p>
            </div>
            <div class="btn-addtocart">
              <button
                type="button"
                class="rounded-lg text-white"
                title="Thêm vào giỏ hàng"
              >
                +
              </button>
            </div>
          </div>
        </ProductInfo>
      </Card>

      {/* Popup Menu */}
      {showPopup && (
        <>
          <Overlay onClick={handlePopupClose} />
          <PopupMenu>
            <h3 className="text-lg font-bold mb-4">Chọn hành động</h3>
            {/* Xem chi tiết */}
            <Link to={`/${product?.slug}`} className="popup-option">
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
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>

              <span>Xem chi tiết</span>
            </Link>
            {/* Xem nhanh */}
            <div
              className="popup-option"
              onClick={(e) => {
                quickView(e, product);
                handlePopupClose();
              }}
            >
              <EyeIcon />
              <span>Xem nhanh</span>
            </div>
            {/* Thêm vào giỏ */}
            <div
              className="popup-option"
              onClick={(e) => {
                addToCart(product);
                handlePopupClose();
              }}
            >
              <ShoppingCartIcon />
              <span>Thêm vào giỏ</span>
            </div>
          </PopupMenu>
        </>
      )}
    </>
  );
}

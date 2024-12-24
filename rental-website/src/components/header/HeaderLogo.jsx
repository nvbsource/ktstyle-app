import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";


const LogoWrapper = styled(Link)`
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  img {
    width: 80%; /* Đảm bảo hình ảnh co giãn theo kích thước của a */
    height: auto;
  }
`;

export default function HeaderLogo() {
  return (
    <LogoWrapper to="/" className="logo-wrapper">
      <img
        src={require("../../assets/images/KTStyle.png")}
        alt="Thời Trang Nữ RUBIES"
        className="lazyload loaded"
        data-was-processed="true"
      />
    </LogoWrapper>
  );
}

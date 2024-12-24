import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const TitleStyle = styled.h2`
  font-weight: 500;
  letter-spacing: 0;
  position: relative;
  display: block;
  font-size: 26px;
  padding-bottom: 20px;
  text-transform: capitalize;
  margin: 0;
  width: 100%;
  text-align: center;
  &:before {
    content: "";
    width: 30%;
    height: 5px;
    background: #e5e9ed;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    border-radius: 3px;
  }
  &:after {
    content: "";
    background: #040303;
    width: 50px;
    height: 5px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    z-index: 1;
    border-radius: 3px;
  }
  @media (max-width: 768px) {
    padding-bottom: 10px;
    font-size: 18px;
    font-weight: 800;
  }
`;

export default function TitleModule({
  title = "Khôn có tiêu đề",
  linkTo = null
}) {
  return (
    <div className="flex justify-center">
      <TitleStyle>
        {linkTo ? (
          // Nếu có linkTo, sử dụng Link
          <Link to={linkTo} title={title}>
            <span>{title}</span>
          </Link>
        ) : (
          // Nếu không có linkTo, hiển thị chỉ văn bản
          <span>{title}</span>
        )}
      </TitleStyle>
    </div>
  );
}

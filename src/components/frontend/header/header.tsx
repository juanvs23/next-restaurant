"use client";
import styled from "styled-components";
import LogoBrand from "../../common/logo/logoBrand";
import MenuNav from "./MenuNav";
import MobilMenu from "./MobilMenu";

const HeaderWrapper = styled.header`
  display: flex;
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 20;
  background-color: var(--black2);
  .rowHeader {
    display: flex;
    max-width: 1330px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
  }

  .loginHeaderSection {
    display: flex;
    justify-content: flex-end;
  }
  @media (max-width: 991px) {
    .loginHeaderSection {
      display: none;
    }
  }
  @media (min-width: 992px) {
    .logoHeaderSection,
    .loginHeaderSection {
      width: 25%;
    }
  }
`;

export default function Header() {
  return (
    <HeaderWrapper>
      <div className="container">
        <div className="rowHeader">
          <div className="logoHeaderSection">
            <LogoBrand />
          </div>
          <MenuNav />
          <MobilMenu />
          <div className="loginHeaderSection"></div>
        </div>
      </div>
    </HeaderWrapper>
  );
}

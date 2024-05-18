import React from "react";
import styled from "styled-components";
import { ReactComponent as HappyCcabiImg } from "@/Cabinet/assets/images/happyCcabi.svg";
import { ReactComponent as MapImg } from "@/Cabinet/assets/images/map.svg";
import { ReactComponent as MyCabinetIcon } from "@/Cabinet/assets/images/myCabinetIcon.svg";
import { ReactComponent as SearchImg } from "@/Cabinet/assets/images/searchWhite.svg";
import { ReactComponent as MyCoinImg } from "@/Cabinet/assets/images/storeCoinNav.svg";

interface ITopNavButton {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  type: string;
  disable?: boolean;
  width?: string;
  height?: string;
  id?: string;
}

const TopNavButton = (props: ITopNavButton) => {
  return (
    <TopNavButtonStyled
      className="cabiButton"
      id={props.id}
      onClick={props.onClick}
      disable={props.disable}
    >
      {props.type === "myCoin" && <MyCoinImg />}
      {props.type === "happyCcabi" && <HappyCcabiImg />}
      {props.type === "search" && <SearchImg />}
      {props.type === "myCabinetIcon" && <MyCabinetIcon />}
      {props.type === "map" && <MapImg />}
    </TopNavButtonStyled>
  );
};

TopNavButton.defaultProps = {
  disable: false,
};

const TopNavButtonStyled = styled.div<{
  disable?: boolean;
}>`
  width: 32px;
  height: 32px;
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  /* display: ${({ disable }) => (disable ? "none" : "block")}; */
  /* visibility: ${({ disable }) => (disable ? "hidden" : "visible")}; */
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.9;
    }
  }

  & svg > g {
    fill: var(--bg-color);
  }

  & > svg {
    width: ${(props) => (props.id === "searchButton" ? "26px" : "32px")};
    height: ${(props) => (props.id === "searchButton" ? "26px" : "32px")};
  }

  & > svg > path {
    stroke: var(--gray-line-btn-color);
  }
`;

export default TopNavButton;

import React from "react";
import styled from "styled-components";
import { ReactComponent as HappyCcabiImg } from "@/Cabinet/assets/images/happyCcabi.svg";
import { ReactComponent as MapImg } from "@/Cabinet/assets/images/map.svg";
import { ReactComponent as MyCabinetIcon } from "@/Cabinet/assets/images/myCabinetIcon.svg";
import { ReactComponent as SearchImg } from "@/Cabinet/assets/images/searchWhite.svg";

interface ITopNavButton {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  // imgSrc: string;
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
  /* display: ${({ disable }) => (disable ? "none" : "block")}; */
  /* visibility: ${({ disable }) => (disable ? "hidden" : "visible")}; */
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.9;
    }
  }

  & svg {
    .happyCcabi_svg__hair {
      fill: var(--bg-color);
    }
    .happyCcabi_svg__leftArm {
      fill: var(--bg-color);
    }
    .happyCcabi_svg__rightArm {
      fill: var(--bg-color);
    }
    .happyCcabi_svg__leftEye {
      fill: var(--bg-color);
    }
    .happyCcabi_svg__rightEye {
      fill: var(--bg-color);
    }
    .happyCcabi_svg__mouth {
      fill: var(--bg-color);
    }
  }

  & > svg > path {
    stroke: var(--shared-gray-color-500);
    transform: ${(props) =>
      props.id === "searchButton" ? "scale(0.9)" : "scale(1)"};
  }
`;

export default TopNavButton;

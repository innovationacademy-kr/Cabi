import React from "react";
import styled from "styled-components";

interface ITopNavButton {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  imgSrc: string;
  disable?: boolean;
  width?: string;
  height?: string;
  id?: string;
}

const TopNavButton = (props: ITopNavButton) => {
  return (
    <TopNavButtonStyled
      id={props.id}
      onClick={props.onClick}
      disable={props.disable}
    >
      <ImgStyled w={props.width} h={props.height} src={props.imgSrc} alt="" />
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
  display: ${({ disable }) => (disable ? "none" : "block")};
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.9;
    }
  }
`;

const ImgStyled = styled.img<{ w?: string; h?: string }>`
  width: ${({ w }) => (w ? w : "100%")};
  height: ${({ h }) => (h ? h : "100%")};
`;

export default TopNavButton;

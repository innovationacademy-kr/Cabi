import React from "react";
import styled from "styled-components";

interface ITopNavButton {
  imgSrc: string;
  disable?: boolean;
}

const TopNavButton: React.FC<ITopNavButton> = (props) => {
  return (
    <TopNavButtonStyled disable={props.disable}>
      <img src={props.imgSrc} alt="" />
    </TopNavButtonStyled>
  );
};

TopNavButton.defaultProps = {
  disable: false,
};

const TopNavButtonStyled = styled.div<{ disable?: boolean }>`
  width: 35px;
  height: 35px;
  margin-right: 10px;
  cursor: pointer;
  opacity: ${({ disable }) => (disable ? 0.6 : 1)};
  &:hover {
    opacity: 0.9;
  }
`;

export default TopNavButton;

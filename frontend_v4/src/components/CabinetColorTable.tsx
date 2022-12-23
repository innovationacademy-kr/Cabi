import React from "react";
import styled from "styled-components";

interface ColorTableItemContainerProps {
  color: string;
  text: string;
}

const ColorTableItemContainer = ({
  color,
  text,
}: ColorTableItemContainerProps) => {
  return (
    <ColorTableItemStyled color={color}>
      <div></div>
      <span>{text}</span>
    </ColorTableItemStyled>
  );
};

const CabinetColorTable = () => {
  return (
    <ColorTableStyled>
      <ColorTableItemContainer color={"var(--mine)"} text={"내 사물함"} />
      <ColorTableItemContainer color={"var(--full)"} text={"사용 중"} />
      <ColorTableItemContainer color={"var(--expired)"} text={"반납지연"} />
      <ColorTableItemContainer color={"var(--available)"} text={"사용가능"} />
      <ColorTableItemContainer color={"var(--banned)"} text={"사용불가"} />
    </ColorTableStyled>
  );
};

const ColorTableStyled = styled.div`
  position: absolute;
  bottom: 30px;
  left: 30px;
  width: auto;
  overflow: hidden;
  color: var(--gray-color);
`;

const ColorTableItemStyled = styled.div<{ color: string }>`
  padding: 5px 0;
  width: 100%;
  & > div {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 5px;
    margin-right: 5px;
    background-color: ${({ color }) => color};
  }
`;

export default CabinetColorTable;

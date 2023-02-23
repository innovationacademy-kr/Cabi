import React from "react";
import styled from "styled-components";
import PillButton from "./PillButton";

interface ISelectorProps {
  iconSrc?: string;
  selectList: string[];
  onClickSelect: any;
}

const Selector = ({ iconSrc, selectList, onClickSelect }: ISelectorProps) => {
  return (
    <SelectorWrapperStyled>
      <IconWrapperStyled>
        <img src={iconSrc} />
      </IconWrapperStyled>
      {selectList &&
        selectList.map((elem) => {
          return (
            <PillButton theme="line" text={elem} onClick={onClickSelect} />
          );
        })}
    </SelectorWrapperStyled>
  );
};

const SelectorWrapperStyled = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const IconWrapperStyled = styled.div`
  width: 24px;
  height: 24px;
`;

export default Selector;

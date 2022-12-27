import React, { useState } from "react";
import styled from "styled-components";
import TopNavButton from "@/components/TopNavButton";

import { useRecoilState } from "recoil";
import { intraID } from "@/recoil/atoms";

const TopNavButtonsContainer = () => {
  const [id, setID] = useRecoilState(intraID);
  return (
    <NaviButtonsStyled>
      <TopNavButton
        onClick={() => {
          alert(`recoil테스트입니다.\n ID: ${id}`);
        }}
        imgSrc="src/assets/images/myCabinetIcon.svg"
      />
      <TopNavButton onClick={() => {}} imgSrc="src/assets/images/map.svg" />
    </NaviButtonsStyled>
  );
};
const NaviButtonsStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div:last-child {
    margin-right: 0;
  }
`;

export default TopNavButtonsContainer;

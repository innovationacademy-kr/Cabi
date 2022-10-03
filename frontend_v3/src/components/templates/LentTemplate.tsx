import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import HomeButton from "../atoms/buttons/HomeButton";
import MenuButton from "../atoms/buttons/MenuButton";
import ReturnButton from "../atoms/buttons/ReturnButton";
import LentInfo from "../organisms/LentInfo";
import { axiosMyLentInfo } from "../../network/axios/axios.custom";
import { MyCabinetInfoResponseDto } from "../../types/dto/cabinet.dto";
import { useAppSelector } from "../../redux/hooks";

// const LentSection = styled.section`
//   position: absolute;
//   left: 5vw;
//   top: 5vw;
//   background-color: #f4f3f8;
//   border-radius: 1rem;
//   width: 90vw;
//   height: calc(90vh - 10vw);
// `;

const LentSection = styled.section`
  width: 100%;
  height: 100%;
  left: 5vw;
  top: 5vw;
  background-color: #f4f3f8;
  border-radius: 1rem;
`;

const LentNavSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  height: 10%;
`;

const LentInfoSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75%;
`;

const LentReturnSection = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10%;
  margin-top: 5%;
`;

const LentTemplate = (): JSX.Element => {
  const navigate = useNavigate();
  const cabinetId = useAppSelector((state) => state.user.cabinet_id);

  return (
    <LentSection id="test">
      <LentNavSection>
        <HomeButton />
        <MenuButton />
      </LentNavSection>
      <LentInfoSection>
        <LentInfo />
      </LentInfoSection>
      <LentReturnSection>
        <ReturnButton button_title="반 납 하 기" />
      </LentReturnSection>
    </LentSection>
  );
};

export default LentTemplate;

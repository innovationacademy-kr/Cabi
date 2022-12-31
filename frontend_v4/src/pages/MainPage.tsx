import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TopNavContainer from "@/containers/TopNavContainer";
import LeftNavContainer from "@/containers/LeftNavContainer";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { SectionPaginationContainer } from "@/containers/SectionPaginationContainer";
import LeftNavOptionContainer from "@/containers/LeftNavOptionContainer";
import CabinetInfoArea from "@/components/CabinetInfoArea";
import { useRecoilValue } from "recoil";
import CabinetList from "@/components/CabinetList";
import {
  currentFloorNumberState,
  toggleCabinetInfoState,
  toggleMapInfoState,
} from "@/recoil/atoms";

const MainPage = () => {
  const CabinetListWrapperRef = useRef<HTMLDivElement>(null);
  const toggleMapInfo = useRecoilValue(toggleMapInfoState);
  const toggleCabinetInfo = useRecoilValue(toggleCabinetInfoState);
  const [colNum, setColNum] = useState<number>(4);
  const currentFloor = useRecoilValue(currentFloorNumberState);
  const navigate = useNavigate();
  // .env에서 가져올 실제 col_num 값입니다.
  const maxColNum = 7;

  const setColNumByDivWidth = () => {
    if (CabinetListWrapperRef.current !== null)
      setColNum(
        Math.min(
          Math.floor(CabinetListWrapperRef.current.offsetWidth / 90),
          maxColNum
        )
      );
  };

  useEffect(() => {
    if (currentFloor == -1) navigate("/home");
    if (CabinetListWrapperRef.current !== null) setColNumByDivWidth();
    window.addEventListener("resize", setColNumByDivWidth);
    return () => {
      window.removeEventListener("resize", setColNumByDivWidth);
    };
  }, [CabinetListWrapperRef.current]);

  return (
    <>
      <TopNavContainer />
      <WrapperStyled>
        <LeftNavContainer />
        <LeftNavOptionContainer />
        <MainStyled>
          <SectionPaginationContainer />
          <CabinetListWrapperStyled ref={CabinetListWrapperRef}>
            <CabinetList colNum={colNum} />
          </CabinetListWrapperStyled>
        </MainStyled>
        <CabinetInfoArea />
      </WrapperStyled>
    </>
  );
};

const WrapperStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
`;

const MainStyled = styled.main`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  padding-top: 30px;
`;

const DetailInfoContainerStyled = styled.div`
  min-width: 330px;
  padding-top: 45px;
  border-left: 1px solid var(--line-color);
`;

const CabinetListWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export default MainPage;

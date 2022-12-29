import React, { useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentFloorNumberState,
  currentFloorCabinetState,
  currentSectionNameState,
} from "@/recoil/atoms";
import { currentLocationFloorState } from "@/recoil/selectors";
import { axiosCabinetByLocationFloor } from "@/api/axios/axios.custom";
import { CabinetInfoByLocationFloorDto } from "@/types/dto/cabinet.dto";

// const floors = [2, 3, 4, 5];

const LeftNavContainer = () => {
  const floors = useRecoilValue<Array<number>>(currentLocationFloorState);
  const [currentFloor, setCurrentFloor] = useRecoilState<number>(
    currentFloorNumberState
  );
  const setCurrentFloorData = useSetRecoilState<
    CabinetInfoByLocationFloorDto[]
  >(currentFloorCabinetState);
  const [currentSection, setCurrentSection] = useRecoilState<string>(
    currentSectionNameState
  );
  const navigator = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (currentFloor === -1) return;

    axiosCabinetByLocationFloor("새롬관", currentFloor)
      .then((response) => {
        setCurrentFloorData(response.data);
        setCurrentSection(response.data[0].section);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentFloor]);

  const onClick = (floor: number) => {
    setCurrentFloor(floor);
    if (pathname == "/home") navigator("/main");
  };

  return (
    <LeftNavStyled>
      <TopSectionStyled>
        <TopBtnsStyled>
          <TopBtnStyled onClick={() => navigator("/home")}>Home</TopBtnStyled>
          {floors.map((floor, index) => (
            <TopBtnStyled onClick={() => onClick(floor)} key={index}>
              {floor + "층"}
            </TopBtnStyled>
          ))}
        </TopBtnsStyled>
      </TopSectionStyled>
      <BottomSectionStyled>
        <BottomBtnsStyled>
          <BottomBtnStyled src={"src/assets/images/search.svg"}>
            <div></div>
            Search
          </BottomBtnStyled>
          <BottomBtnStyled src={"src/assets/images/log.svg"}>
            <div></div>
            Log
          </BottomBtnStyled>
          <BottomBtnStyled src={"src/assets/images/close-square.svg"}>
            <div></div>
            Logout
          </BottomBtnStyled>
        </BottomBtnsStyled>
      </BottomSectionStyled>
    </LeftNavStyled>
  );
};

const LeftNavStyled = styled.nav`
  width: 90px;
  min-width: 90px;
  position: relative;
  height: 100%;
  border-right: 1px solid var(--line-color);
  position: relative;
`;

const TopSectionStyled = styled.section`
  height: 55%;
  position: relative;
  overflow-x: hidden;
`;

const TopBtnsStyled = styled.ul`
  text-align: center;
  padding: 30px 10px;
`;

const TopBtnStyled = styled.li`
  width: 100%;
  height: 48px;
  line-height: 48px;
  font-weight: 300;
  margin-bottom: 30px;
  border-radius: 10px;
  color: var(--gray-color);
  cursor: pointer;
  &:last-child {
    margin-bottom: 0;
  }
  &:hover {
    color: var(--white);
    background-color: var(--main-color);
  }
`;

const BottomSectionStyled = styled.section`
  min-height: 45%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 17px;
    margin: 0 auto;
    width: 56px;
    height: 1px;
    background-color: var(--line-color);
  }
`;
const BottomBtnsStyled = styled.ul`
  padding: 30px 10px;
  text-align: center;
`;

const BottomBtnStyled = styled.li<{ src: string }>`
  width: 100%;
  height: 48px;
  font-weight: 300;
  margin-top: 30px;
  border-radius: 10px;
  color: var(--gray-color);
  cursor: pointer;
  &:first-child {
    margin-top: 0;
  }
  &:hover {
    color: var(--main-color);
  }
  & > div {
    width: 24px;
    height: 24px;
    margin: 0 auto;
    margin-bottom: 4px;
    background-image: url(${(props) => props.src});
    background-size: cover;
  }
  &:hover > div {
    filter: invert(33%) sepia(55%) saturate(3554%) hue-rotate(230deg)
      brightness(99%) contrast(107%);
  }
`;

export default LeftNavContainer;

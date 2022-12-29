import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import TopNavContainer from "@/containers/TopNavContainer";
import LeftNavContainer from "@/containers/LeftNavContainer";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import CabinetListContainer from "@/containers/CabinetListContainer";
import { SectionPaginationContainer } from "@/containers/SectionPaginationContainer";
import CabinetInfoArea, {
  ISelectedCabinetInfo,
} from "@/containers/CabinetInfoArea";
import LeftNavOptionContainer from "@/containers/LeftNavOptionContainer";

import { useRecoilValue } from "recoil";
import { currentSectionCabinetState } from "@/recoil/selectors";

const CabinetInfoDummy: ISelectedCabinetInfo = {
  floor: 2,
  section: "Oasis",
  cabinetNum: 42,
  cabinetColor: "var(--available)",
  cabinetLogo: "/src/assets/images/shareCabinetType.svg",
  userNameList: "jaesjeon\ninshin\n-",
  belowText: "16일 남았습니다.\n2022-12-22",
  belowTextColor: "black",
};

const MainPage = () => {
  const CabinetListWrapperRef = useRef<HTMLDivElement>(null);
  const [colNum, setColNum] = useState<number>(4);
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
    if (CabinetListWrapperRef.current !== null) setColNumByDivWidth();
    window.addEventListener("resize", setColNumByDivWidth);
    return () => {
      window.removeEventListener("resize", setColNumByDivWidth);
    };
  }, [CabinetListWrapperRef.current]);

  const CABINETS = useRecoilValue<CabinetInfo[]>(currentSectionCabinetState);

  return (
    <>
      <TopNavContainer />
      <WrapperStyled>
        <LeftNavContainer />
        <LeftNavOptionContainer />
        <MainStyled>
          <SectionPaginationContainer />
          <CabinetListWrapperStyled ref={CabinetListWrapperRef}>
            <CabinetListContainer colNum={colNum} cabinetInfo={CABINETS} />
          </CabinetListWrapperStyled>
        </MainStyled>
        <DetailInfoContainerStyled>
          <CabinetInfoArea selectedCabinetInfo={CabinetInfoDummy} />
        </DetailInfoContainerStyled>
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

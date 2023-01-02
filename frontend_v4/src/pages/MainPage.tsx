import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import SectionPagination from "@/components/SectionPagination";
import CabinetList from "@/components/CabinetList";

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

  return (
    <>
      <MainStyled>
        <SectionPagination />
        <CabinetListWrapperStyled ref={CabinetListWrapperRef}>
          <CabinetList colNum={colNum} />
        </CabinetListWrapperStyled>
      </MainStyled>
    </>
  );
};

const MainStyled = styled.main`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
`;

const CabinetListWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export default MainPage;

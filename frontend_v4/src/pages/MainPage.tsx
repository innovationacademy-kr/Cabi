import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import SectionPagination from "@/components/SectionPagination";
import CabinetList from "@/components/CabinetList";
import { useRecoilValue } from "recoil";
import { currentSectionColNumState } from "@/recoil/selectors";

const MainPage = () => {
  const CabinetListWrapperRef = useRef<HTMLDivElement>(null);
  const realColNum = useRecoilValue(currentSectionColNumState);

  // const setColNumByDivWidth = () => {
  //   if (CabinetListWrapperRef.current !== null)
  //     setWidthColNum(
  //       Math.floor(CabinetListWrapperRef.current.offsetWidth / 90)
  //     );
  // };

  // useEffect(() => {
  //   if (CabinetListWrapperRef.current !== null) setColNumByDivWidth();
  //   window.addEventListener("resize", setColNumByDivWidth);
  //   return () => {
  //     window.removeEventListener("resize", setColNumByDivWidth);
  //   };
  // }, [CabinetListWrapperRef.current]);

  // useEffect(() => {
  //   console.log(realColNum, widthColNum, viewColNum);
  //   if (realColNum && widthColNum)
  //     setViewColNum(Math.min(realColNum, widthColNum));
  //   return () => {
  //     resetViewColNum();
  //   };
  // }, [realColNum, widthColNum]);

  return (
    <>
      <SectionPagination />
      <CabinetListWrapperStyled ref={CabinetListWrapperRef}>
        {realColNum && <CabinetList colNum={realColNum} />}
      </CabinetListWrapperStyled>
    </>
  );
};

const CabinetListWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export default MainPage;

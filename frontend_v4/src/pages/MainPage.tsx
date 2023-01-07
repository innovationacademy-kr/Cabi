import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import SectionPagination from "@/components/SectionPagination";
import CabinetList from "@/components/CabinetList";

const MainPage = () => {
  const CabinetListWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <SectionPagination />
      <CabinetListWrapperStyled ref={CabinetListWrapperRef}>
        <CabinetList />
      </CabinetListWrapperStyled>
    </>
  );
};

const CabinetListWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 30px;
`;
export default MainPage;

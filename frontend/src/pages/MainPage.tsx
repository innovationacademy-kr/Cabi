import { useRef } from "react";
import styled from "styled-components";
import SectionPaginationContainer from "@/components/SectionPagination/SectionPagination.container";
import CabinetListContainer from "@/components/CabinetList/CabinetList.container";

const MainPage = () => {
  const CabinetListWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <SectionPaginationContainer />
      <CabinetListWrapperStyled ref={CabinetListWrapperRef}>
        <CabinetListContainer />
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

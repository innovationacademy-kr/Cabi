import styled from "styled-components";
import DetailTable from "@/pages/Wednesday/DetailTable";
import { MoveSectionButtonStyled } from "@/components/SectionPagination/SectionPagination";
import LeftSectionButton from "@/assets/images/LeftSectionButton.svg";

const DetailPage = () => {
  return (
    <ContainerStyled>
      <WrapperStyled>
        <HeaderStyled>
          <MoveSectionButtonStyled
            src={LeftSectionButton}
            className="cabiButton"
          />
          <div>2024년 12월</div>
          <MoveSectionButtonStyled
            src={LeftSectionButton}
            arrowReversed={true}
            className="cabiButton"
          />
        </HeaderStyled>
        <BodyStyled>
          <DetailTable />
        </BodyStyled>
      </WrapperStyled>
    </ContainerStyled>
  );
};

export default DetailPage;

const ContainerStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const WrapperStyled = styled.div`
  width: 80%;
  margin-top: 70px;
`;

const HeaderStyled = styled.div`
  text-align: center;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  & > div {
    width: 200px;
    height: 50px;
    font-size: 2rem;
    line-height: 3rem;
    font-weight: 600;
  }

  & > img {
    width: 2.5rem;
    height: 2.5rem;
  }
`;

const BodyStyled = styled.div`
  margin-top: 50px;
  width: 100%;
  padding: 0 20px 10px 20px;
  background-color: var(--lightgray-color);
  border-radius: 10px;
`;

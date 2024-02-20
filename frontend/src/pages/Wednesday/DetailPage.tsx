import styled from "styled-components";
import LeftSectionButton from "@/assets/images/LeftSectionButton.svg";
import DetailTable from "./DetailTable";

const DetailPage = () => {
  return (
    <ContainerStyled>
      <WrapperStyled>
        <HeaderStyled>
          <MoveSectionButtonStyled
            src={LeftSectionButton}
            className="cabiButton"
          />
          <div>2024년 1월</div>
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
  width: 1350px;
  margin-top: 100px;
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
    font-size: 40px;
    margin: 0 40px;
  }

  & > img {
    width: 2.5rem;
    height: 2.5rem;
  }
`;

const MoveSectionButtonStyled = styled.img<{ arrowReversed?: boolean }>`
  width: 24px;
  height: 24px;
  margin: 0px 15px;
  opacity: 70%;
  cursor: pointer;
  transform: rotate(${(props) => (props.arrowReversed ? "180deg" : "0")});
  transition: all 0.2s;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 100%;
      transform: rotate(${(props) => (props.arrowReversed ? "180deg" : "0")})
        scale(1.3);
    }
  }
`;

const BodyStyled = styled.div`
  margin-top: 80px;
  width: 100%;
  padding: 0 20px 10px 20px;
  background-color: var(--lightgray-color);
  border-radius: 10px;
`;

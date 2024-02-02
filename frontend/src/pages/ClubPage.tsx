import styled from "styled-components";
import { ClubPageInfo } from "@/components/Club/ClubPageInfo";

const ClubPage = () => {
  return (
    <WrapperStyled>
      <ContainerStyled>
        <TitleStyled>동아리 정보</TitleStyled>
        <ClubPageInfo></ClubPageInfo>
      </ContainerStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 112px 0 0 0;
  padding-bottom: 112px;
  width: 795px;
  height: 100%;
`;

const TitleStyled = styled.div`
  text-align: center;
  font-size: 2rem;
  letter-spacing: -0.02rem;
  font-weight: 700;
  margin-bottom: 30px;
`;

export default ClubPage;

import styled from "styled-components";
import TopNavContainer from "@/containers/TopNavContainer";
import LeftNavContainer from "@/containers/LeftNavContainer";
import InfoContainer from "@/containers/InfoContainer";
const MainPage = () => {
  return (
    <>
      <TopNavContainer />
      <WrapperStyled>
        <LeftNavContainer />
        <MainStyled>
          <InfoContainer />
        </MainStyled>
        {/* <DetailInfoContainerStyled>
          사물함 상세 정보 위치
        </DetailInfoContainerStyled> */}
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
`;

const DetailInfoContainerStyled = styled.div`
  min-width: 330px;
`;

export default MainPage;

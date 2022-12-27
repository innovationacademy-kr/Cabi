import styled from "styled-components";
import TopNavContainer from "@/containers/TopNavContainer";
import InfoContainer from "@/containers/InfoContainer";
import LeftNavContainer from "@/containers/LeftNavContainer";
import LeftNavOptionContainer from "@/containers/LeftNavOptionContainer";

const HomePage = () => {
  return (
    <>
      <TopNavContainer />
      <WapperStyled>
        <LeftNavContainer />
        <LeftNavOptionContainer style={{ display: "none" }} />
        <MainStyled>
          <InfoContainer />
        </MainStyled>
      </WapperStyled>
    </>
  );
};

const WapperStyled = styled.div`
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

export default HomePage;

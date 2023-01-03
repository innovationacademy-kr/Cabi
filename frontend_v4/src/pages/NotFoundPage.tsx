import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <NotFoundPageStyled id="notFoundPage">
      <TitleStyled>404 Not Found</TitleStyled>
      <CabiImgStyled>
        <img src="/src/assets/images/sadCcabiWhite.png" alt="sad_cabi" />
      </CabiImgStyled>
      <SubTitleStyled> 원하시는 페이지를 찾을 수 없습니다.</SubTitleStyled>
      <ContentStyled>
        요청하신 페이지가 사라졌거나,{" "}
        <span>잘못된 경로를 이용하셨습니다 :(</span>
      </ContentStyled>
      <button className="modal" onClick={() => navigate("/login")}>
        홈으로 가기
      </button>
    </NotFoundPageStyled>
  );
};

const NotFoundPageStyled = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: var(--main-color);
  color: var(--white);
`;

const TitleStyled = styled.h1`
  font-size: 5rem;
  color: #ffbe6d;
  font-family: "Do Hyeon", sans-serif;
`;

const SubTitleStyled = styled.h2`
  font-size: 2rem;
  margin: 1.5rem 0;
  font-weight: 700;
`;

const ContentStyled = styled.p`
  font-size: 1.5rem;
  margin-bottom: 60px;
  font-weight: 300;
`;

const rotate = keyframes`
  from {
    transform: translateY(5%);
  }
  to {
    transform: translateY(-5%) scale(1.1);
  }
`;

const CabiImgStyled = styled.div`
  width: 200px;
  height: 200px;
  margin: 3% 0;
  animation: ${rotate} 0.5s infinite ease alternate;
`;

export default NotFoundPage;

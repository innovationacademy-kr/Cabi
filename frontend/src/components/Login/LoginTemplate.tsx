import { useState } from "react";
import styled from "styled-components";
import "@/assets/css/loginPage.css";
import LoadingAnimation from "@/components/Common/LoadingAnimation";

const LoginTemplate = (props: {
  url: string;
  pageTitle: string;
  pageSubTitle: string;
  imgSrc: string;
}) => {
  const { url, pageTitle, pageSubTitle, imgSrc } = props;
  const [isClicked, setIsClicked] = useState(false);

  return (
    <LoginPageStyled id="loginPage">
      <LeftSectionStyled className="leftLoginPage">
        <TopContentsStyled>
          <LoginTitleStyled color="var(--black)">
            42서울 캐비닛 서비스
          </LoginTitleStyled>
          <LoginTitleStyled color="var(--lightpurple-color)">
            여러분의 일상을 가볍게
          </LoginTitleStyled>
        </TopContentsStyled>
        <LoginImgStyled isAdmin={!!imgSrc}>
          <img src={imgSrc ?? "/src/assets/images/loginImg.svg"} alt="" />
        </LoginImgStyled>
        <BottomContentsStyled>
          <p>
            <CabiStyled>Cabi</CabiStyled>로
          </p>
          <p>일상의 무게를 덜어보세요.</p>
        </BottomContentsStyled>
      </LeftSectionStyled>
      <RightSectionStyled className="rightLoginPage">
        <LoginCardStyled className="modal">
          <CardLogoStyled>
            <img src="/src/assets/images/logo.svg" alt="" />
          </CardLogoStyled>
          <CardTitleBoxStyled>
            <CardTitleStyled>{pageTitle}</CardTitleStyled>
            <CardSubTitleStyled>{pageSubTitle}</CardSubTitleStyled>
          </CardTitleBoxStyled>
          <button
            onClick={() => {
              window.location.replace(url);
              setIsClicked(true);
            }}
            disabled={isClicked}
          >
            {isClicked ? <LoadingAnimation></LoadingAnimation> : "L O G I N"}
          </button>
        </LoginCardStyled>
      </RightSectionStyled>
    </LoginPageStyled>
  );
};

const LoginPageStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 100%;
  height: 100%;
`;

const LeftSectionStyled = styled.section`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding-left: 7%;
`;
const TopContentsStyled = styled.div`
  font-size: 2rem;
  font-family: var(--main-font);
  font-weight: 700;
  line-height: 3rem;
`;

const LoginTitleStyled = styled.p<{ color: string }>`
  font-size: 2rem;
  font-family: var(--main-font);
  color: ${(props) => props.color};
  font-weight: 700;
  line-height: 3rem;
`;

const LoginImgStyled = styled.div<{ isAdmin?: boolean }>`
  margin: 10%;
  margin-left: 0;
  transform: ${(props) => (props.isAdmin ? "scaleX(-1)" : "scaleX(1)")};
`;

const BottomContentsStyled = styled.div`
  font-size: 1.75rem;
  font-family: var(--main-font);
  font-weight: 700;
  line-height: 3rem;
`;

const CabiStyled = styled.span`
  color: var(--main-color);
`;

const RightSectionStyled = styled.section`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--main-color);
`;

const LoginCardStyled = styled.div`
  width: 350px;
  height: 500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: 85px 0;
  background-color: var(--white);
`;

const CardLogoStyled = styled.div`
  width: 70px;
  height: 70px;
`;

const CardTitleBoxStyled = styled.div`
  text-align: center;
  margin-top: -40px;
`;

const CardTitleStyled = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const CardSubTitleStyled = styled.p`
  color: var(--main-color);
`;

export default LoginTemplate;

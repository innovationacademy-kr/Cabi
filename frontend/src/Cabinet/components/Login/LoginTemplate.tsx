import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as LoginImg } from "@/Cabinet/assets/images/loginImg.svg";
import { ReactComponent as LogoImg } from "@/Cabinet/assets/images/logo.svg";
import LoginButtonGroup from "./LoginButtonGroup";

const LoginTemplate = (props: { pageTitle: string; pageSubTitle: string }) => {
  const { pageTitle, pageSubTitle } = props;
  const navigator = useNavigate();

  return (
    <LoginPageStyled id="loginPage">
      <LeftSectionStyled className="leftLoginPage">
        <TopContentsStyled>
          <LoginTitleStyled color="var(--normal-text-color)">
            42서울 캐비닛 서비스
          </LoginTitleStyled>
          <LoginTitleStyled color="var(--sys-sub-color)">
            여러분의 일상을 가볍게
          </LoginTitleStyled>
        </TopContentsStyled>
        <LoginImgStyled>
          <LoginImg fill="var(--sys-main-color)" />
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
            <LogoImg />
          </CardLogoStyled>
          <CardTitleBoxStyled>
            <CardTitleStyled>{pageTitle}</CardTitleStyled>
            <CardSubTitleStyled>{pageSubTitle}</CardSubTitleStyled>
          </CardTitleBoxStyled>
          <LoginButtonGroup />
          <AGUURLSectionStyled to="/agu">A.G.U 유저라면?</AGUURLSectionStyled>
        </LoginCardStyled>
      </RightSectionStyled>
    </LoginPageStyled>
  );
};

const LoginPageStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const LoginImgStyled = styled.div`
  margin: 10%;
  margin-left: 0;
`;

const BottomContentsStyled = styled.div`
  font-size: 1.75rem;
  font-family: var(--main-font);
  font-weight: 700;
  line-height: 3rem;
`;

const CabiStyled = styled.span`
  color: var(--sys-main-color);
`;

const RightSectionStyled = styled.section`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--sys-main-color);
`;

const LoginCardStyled = styled.div`
  width: 350px;
  height: 500px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 85px;
  background-color: var(--bg-color);
`;

const CardLogoStyled = styled.div`
  width: 70px;
  height: 70px;
  svg {
    .logo_svg__currentPath {
      fill: var(--sys-main-color);
    }
  }
`;

const CardTitleBoxStyled = styled.div`
  text-align: center;
  margin-top: 25px;
`;

const CardTitleStyled = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  line-height: 2.5rem;
`;

const CardSubTitleStyled = styled.p`
  color: var(--sys-main-color);
`;

const AGUURLSectionStyled = styled(Link)`
  background-color: var(--bg-color);
  color: var(--gray-line-btn-color);
  height: 30px;
  margin-top: 10px;
  text-decoration: underline;
  font-size: 0.875rem;
  font-weight: lighter;
`;

export default LoginTemplate;

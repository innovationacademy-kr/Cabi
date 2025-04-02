import { Link } from "react-router-dom";
import styled from "styled-components";
import LoginButtonGroupContainer from "@/Cabinet/components/Login/LoginButtonGroup.container";
import { ReactComponent as LogoImg } from "@/Cabinet/assets/images/logo.svg";

const LoginCard = () => {
  return (
    <LoginCardStyled className="modal">
      <CardLogoStyled>
        <LogoImg />
      </CardLogoStyled>
      <CardTitleBoxStyled>
        <CardTitleStyled>Cabi</CardTitleStyled>
        <CardSubTitleStyled>여러분의 일상을 가볍게</CardSubTitleStyled>
      </CardTitleBoxStyled>
      <LoginButtonGroupContainer />
      <AGUURLSectionStyled to="/agu">A.G.U 유저라면?</AGUURLSectionStyled>
    </LoginCardStyled>
  );
};

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
  margin-top: 10px;
  margin-top: 24px;
  text-decoration: underline;
  font-size: 0.875rem;
  font-weight: lighter;
`;

export default LoginCard;

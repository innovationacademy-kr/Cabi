import styled from "styled-components";
import { ReactComponent as LogoImg } from "@/Cabinet/assets/images/logo.svg";

const SelectInduction = ({ msg }: { msg: string }) => {
  return (
    <WrapperStyled>
      <CabiLogoStyled>
        <LogoImg />
      </CabiLogoStyled>
      <MsgStyled>{msg}</MsgStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CabiLogoStyled = styled.div`
  width: 35px;
  height: 35px;
  margin-bottom: 10px;
  svg {
    .logo_svg__currentPath {
      fill: var(--sys-main-color);
    }
  }
`;

const MsgStyled = styled.p`
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 28px;
  color: var(--gray-line-btn-color);
  text-align: center;
  white-space: pre-line;
`;

export default SelectInduction;

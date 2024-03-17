import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as CabiLogo } from "@/Cabinet/assets/images/logo.svg";
import { ReactComponent as PresentationLogo } from "@/Presentation/assets/images/logo.svg";

const TopNavDomainGroup = () => {
  const navigator = useNavigate();
  const { pathname } = useLocation();

  return (
    <DomainGroupContainerStyled>
      <DomainWrapperStyled onClick={() => navigator("/home")}>
        <LogoContainerStyled>
          <CabiLogo />
        </LogoContainerStyled>
        <DomainTitleStyled
          className={
            !pathname.includes("presentation") ? "domainButtonActive" : ""
          }
          fontWeight="bold"
        >
          Cabi
        </DomainTitleStyled>
      </DomainWrapperStyled>
      <DomainSeparatorStyled />
      <DomainWrapperStyled onClick={() => navigator("/presentation/home")}>
        <LogoContainerStyled>
          <PresentationLogo />
        </LogoContainerStyled>
        <DomainTitleStyled
          className={
            pathname.includes("presentation") ? "domainButtonActive" : ""
          }
          fontWeight="bold"
        >
          수요지식회
        </DomainTitleStyled>
      </DomainWrapperStyled>
    </DomainGroupContainerStyled>
  );
};

const DomainGroupContainerStyled = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid var(--line-color);
  padding: 0 28px;
  color: var(--gray-color);
  font-size: 0.875rem;
`;

const DomainWrapperStyled = styled.div`
  display: flex;
  align-items: center;
`;

const LogoContainerStyled = styled.div`
  display: flex;
  align-items: center;
  width: 14px;
  height: 14px;
  cursor: pointer;
  svg {
    .logo_svg__currentPath {
      fill: var(--default-main-color);
    }
  }
`;

const DomainTitleStyled = styled.div<{ fontWeight: string }>`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: ${(props) => props.fontWeight};
  margin-left: 4px;
  cursor: pointer;
`;

const DomainSeparatorStyled = styled.div`
  width: 1px;
  height: 20px;
  margin: 0 8px;
  background-color: #d9d9d9;
`;

export default TopNavDomainGroup;

import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import DarkModeToggleSwitch from "@/Cabinet/components/Common/DarkModeToggleSwitch";
import { ReactComponent as CabiLogo } from "@/Cabinet/assets/images/logo.svg";
import { ReactComponent as PresentationLogo } from "@/Presentation/assets/images/logo.svg";

interface ITopNavDomain {
  path: string;
  adminPath: string;
  logo: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  active: (pathname: string) => boolean;
}

const domains: ITopNavDomain[] = [
  {
    path: "/home",
    adminPath: "/admin/home",
    logo: CabiLogo,
    title: "Cabi",
    active: (pathname) => !pathname.includes("presentations"),
  },
  {
    path: "/presentations/home",
    // adminPath: "/admin/presentations/detail", // detail 페이지에서 axiosGetPresentationById 호출 시 권한부족으로 에러
    adminPath: "/admin/presentations/home",
    logo: PresentationLogo,
    title: "수요지식회",
    active: (pathname) => pathname.includes("presentations"),
  },
];

const TopNavDomainGroup = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <DomainGroupContainerStyled
      isPresentation={pathname.includes("presentations")}
    >
      {domains.map((domain, index) => (
        <DomainWrapperStyled key={domain.title}>
          <DomainContainerStyled
            onClick={() => navigate(isAdmin ? domain.adminPath : domain.path)}
          >
            <LogoContainerStyled
              domainTitle={domain.title}
              isCabi={!pathname.includes("presentation")}
            >
              <domain.logo
                viewBox={
                  domain.title === "수요지식회" ? "0.8 0.8 16 16" : "0 0 37 37"
                }
              />
            </LogoContainerStyled>
            <DomainTitleStyled
              className={
                domain.active(pathname)
                  ? `domainButtonActive ${
                      domain.title === "Cabi"
                        ? "cabi"
                        : domain.title === "수요지식회"
                        ? "presentation"
                        : ""
                    }`
                  : ""
              }
              fontWeight="bold"
            >
              {domain.title}
            </DomainTitleStyled>
          </DomainContainerStyled>
          {index < domains.length - 1 && <DomainSeparatorStyled />}
        </DomainWrapperStyled>
      ))}

      {!pathname.includes("presentation") && (
        <ToggleWrapperStyled>
          <DarkModeToggleSwitch id="darkModeToggleSwitch" />
        </ToggleWrapperStyled>
      )}
    </DomainGroupContainerStyled>
  );
};

const DomainGroupContainerStyled = styled.div<{ isPresentation: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  min-height: 40px;
  flex-shrink: 0;
  box-sizing: border-box;

  border-bottom: 1px solid var(--line-color);
  padding: 0 28px;
  color: ${({ isPresentation }) =>
    isPresentation ? "#7b7b7b" : "var(--gray-line-btn-color)"};
  font-size: 0.875rem;
  background-color: ${({ isPresentation }) =>
    isPresentation ? "#ffffff" : "var(--bg-color)"};
`;

const DomainWrapperStyled = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const DomainContainerStyled = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
`;

const LogoContainerStyled = styled.div<{
  domainTitle: string;
  isCabi: boolean;
}>`
  display: flex;
  align-items: center;
  width: 14px;
  height: 14px;
  flex-shrink: 0;

  svg {
    .logo_svg__currentPath {
      fill: ${(props) =>
        props.isCabi
          ? "var(--sys-main-color)"
          : "var(--sys-default-main-color)"};
    }
  }

  & > svg > path {
    transform: ${(props) =>
      props.domainTitle === "수요지식회" ? "scale(1.08)" : "scale(1)"};
  }
`;

const DomainTitleStyled = styled.div<{ fontWeight: string }>`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: ${(props) => props.fontWeight};
  margin-left: 4px;
  cursor: pointer;
  line-height: 1;
  flex-shrink: 0;
`;

const DomainSeparatorStyled = styled.div`
  width: 1px;
  height: 20px;
  margin: 0 8px;
  background-color: var(--service-man-title-border-btm-color);
  flex-shrink: 0;
`;

const ToggleWrapperStyled = styled.div`
  position: absolute;
  right: 18px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export default TopNavDomainGroup;

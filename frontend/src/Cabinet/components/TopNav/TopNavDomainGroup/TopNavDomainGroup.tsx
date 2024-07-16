import { useEffect, useState } from "react";
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
    active: (pathname) => !pathname.includes("presentation"),
  },
  {
    path: "/presentation/home",
    adminPath: "/admin/presentation/detail",
    logo: PresentationLogo,
    title: "수요지식회",
    active: (pathname) => pathname.includes("presentation"),
  },
];

const TopNavDomainGroup = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const navigator = useNavigate();
  const { pathname } = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const mode = localStorage.getItem("display-style") || "LIGHT";
    return mode === "DARK";
  });

  const handleToggleChange = (checked: boolean) => {
    setIsDarkMode(checked);
    const mode = checked ? "DARK" : "LIGHT";
    localStorage.setItem("display-style", mode);
    document.body.setAttribute("display-style", mode);
  };

  useEffect(() => {
    const mode = localStorage.getItem("display-style") || "LIGHT";
    document.body.setAttribute("display-style", mode);
  }, []);

  return (
    <DomainGroupContainerStyled>
      {domains.map((domain, index) => (
        <DomainWrapperStyled key={domain.title}>
          <DomainContainerStyled
            onClick={() => navigator(isAdmin ? domain.adminPath : domain.path)}
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
              className={domain.active(pathname) ? "domainButtonActive" : ""}
              fontWeight="bold"
            >
              {domain.title}
            </DomainTitleStyled>
          </DomainContainerStyled>
          {index < domains.length - 1 && <DomainSeparatorStyled />}
        </DomainWrapperStyled>
      ))}
      {pathname.includes("/admin") && (
        <ToggleContainerStyled>
          <DarkModeToggleSwitch
            id="dark-mode-toggle"
            checked={isDarkMode}
            onChange={handleToggleChange}
          />
        </ToggleContainerStyled>
      )}
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
  color: var(--gray-line-btn-color);
  font-size: 0.875rem;
  background-color: var(--bg-color);
`;

const DomainWrapperStyled = styled.div`
  display: flex;
  align-items: center;
`;

const DomainContainerStyled = styled.div`
  display: flex;
  align-items: center;
`;

const LogoContainerStyled = styled.div<{
  domainTitle: string;
  isCabi: boolean;
}>`
  display: flex;
  align-items: center;
  width: 14px;
  height: 14px;
  cursor: pointer;

  svg {
    .logo_svg__currentPath {
      fill: ${(props) =>
        props.isCabi
          ? "var(--sys-main-color);"
          : " var(--sys-default-main-color);"};
    }
    width: 14px;
    height: 14px;
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
`;

const DomainSeparatorStyled = styled.div`
  width: 1px;
  height: 20px;
  margin: 0 8px;
  background-color: var(--service-man-title-border-btm-color);
`;
const ToggleContainerStyled = styled.div`
  position: absolute;
  right: 20px;
  display: flex;
  align-items: center;
`;
export default TopNavDomainGroup;

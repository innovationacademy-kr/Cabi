import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LeftClubNav from "@/Cabinet/components/LeftNav/LeftClubNav/LeftClubNav";
import LeftMainNavContainer from "@/Cabinet/components/LeftNav/LeftMainNav/LeftMainNav.container";
import LeftProfileNav from "@/Cabinet/components/LeftNav/LeftProfileNav/LeftProfileNav";
import LeftSectionNav from "@/Cabinet/components/LeftNav/LeftSectionNav/LeftSectionNav";
import LeftStoreNavContainer from "@/Cabinet/components/LeftNav/LeftStoreNav/LeftStoreNav.container";
import useMenu from "@/Cabinet/hooks/useMenu";

const LeftNav: React.FC<{
  isVisible: boolean;
  isAdmin?: boolean;
}> = ({ isAdmin, isVisible }) => {
  const navigator = useNavigate();
  const { closeLeftNav } = useMenu();
  const isProfilePage: boolean = location.pathname.includes("profile");
  const isMainClubPage: boolean = location.pathname === "/clubs";

  const onClickRedirectButton = (location: string) => {
    closeLeftNav();
    navigator(location);
  };

  return (
    <LeftNavWrapStyled id="leftNavWrap">
      <LeftMainNavContainer isAdmin={isAdmin} />
      {isVisible && <LeftSectionNav closeLeftNav={closeLeftNav} />}
      {isProfilePage && (
        <LeftProfileNav onClickRedirectButton={onClickRedirectButton} />
      )}
      {isMainClubPage && <LeftClubNav closeLeftNav={closeLeftNav} />}
      <LeftStoreNavContainer isVisible={isVisible} />
    </LeftNavWrapStyled>
  );
};

const LeftNavWrapStyled = styled.div`
  display: flex;
`;

export default LeftNav;

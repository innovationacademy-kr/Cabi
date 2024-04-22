import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { currentSectionNameState } from "@/Cabinet/recoil/atoms";
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
  const [currentFloorSection, setCurrentFloorSection] = useRecoilState<string>(
    currentSectionNameState
  );
  const navigator = useNavigate();
  const { closeLeftNav } = useMenu();
  const isProfilePage: boolean = location.pathname.includes("profile");
  const isMainClubPage: boolean = location.pathname === "/clubs";

  const onClickSection = (section: string) => {
    closeLeftNav();
    setCurrentFloorSection(section);
  };

  const onClickProfile = () => {
    closeLeftNav();
    navigator("profile");
  };

  const onClickLentLogButton = () => {
    closeLeftNav();
    navigator("profile/log");
  };

  return (
    <LeftNavWrapStyled id="leftNavWrap">
      <LeftMainNavContainer isAdmin={isAdmin} />
      {isVisible && (
        <LeftSectionNav
          currentFloorSection={currentFloorSection}
          onClickSection={onClickSection}
        />
      )}
      {isProfilePage && (
        <LeftProfileNav
          onClickProfile={onClickProfile}
          onClickLentLogButton={onClickLentLogButton}
        />
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

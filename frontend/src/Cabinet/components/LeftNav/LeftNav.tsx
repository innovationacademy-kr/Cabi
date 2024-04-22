import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { currentSectionNameState } from "@/Cabinet/recoil/atoms";
import LeftMainNavContainer from "@/Cabinet/components/LeftNav/LeftMainNav/LeftMainNav.container";
import LeftSectionNav from "@/Cabinet/components/LeftNav/LeftSectionNav/LeftSectionNav";
import useMenu from "@/Cabinet/hooks/useMenu";
import LeftClubNav from "./LeftClubNav/LeftClubNav";
import LeftProfileNav from "./LeftProfileNav/LeftProfileNav";
import LeftStoreNavContainer from "./LeftStoreNav/LeftStoreNav.container";

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
  // TODO : club onClick 만들기
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
      {isMainClubPage && <LeftClubNav />}
      <LeftStoreNavContainer isVisible={isVisible} />
    </LeftNavWrapStyled>
  );
};

const LeftNavWrapStyled = styled.div`
  display: flex;
`;

export default LeftNav;

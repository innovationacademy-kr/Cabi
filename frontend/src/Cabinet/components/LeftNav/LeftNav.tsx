import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { currentSectionNameState } from "@/Cabinet/recoil/atoms";
import { currentFloorSectionState } from "@/Cabinet/recoil/selectors";
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
  const floorSection = useRecoilValue<Array<string>>(currentFloorSectionState);
  const [currentFloorSection, setCurrentFloorSection] = useRecoilState<string>(
    currentSectionNameState
  );
  const navigator = useNavigate();
  const { pathname } = useLocation();
  const { closeLeftNav } = useMenu();
  const isProfilePage: boolean = location.pathname.includes("profile");
  const isMainClubPage: boolean = location.pathname === "/clubs";
  // TODO : isProfilePage,isMainClubPage 꼭 넘겨줘야되나?

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

  const onClickSlack = () => {
    window.open(
      "https://42born2code.slack.com/archives/C02V6GE8LD7",
      "_blank",
      "noopener noreferrer"
    );
  };

  const onClickClubForm = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSfp-d7qq8gTvmQe5i6Gtv_mluNSICwuv5pMqeTBqt9NJXXP7w/closedform",
      "_blank",
      "noopener noreferrer"
    );
  };

  return (
    <LeftNavWrapStyled id="leftNavWrap">
      <LeftMainNavContainer isAdmin={isAdmin} />
      <LeftSectionNav
        isVisible={isVisible}
        floorSection={floorSection}
        currentFloorSection={currentFloorSection}
        onClickSection={onClickSection}
      />
      <LeftProfileNav
        pathname={pathname}
        isProfile={isProfilePage}
        onClickProfile={onClickProfile}
        onClickLentLogButton={onClickLentLogButton}
        onClickSlack={onClickSlack}
        onClickClubForm={onClickClubForm}
      />
      <LeftClubNav isClub={isMainClubPage} />
      <LeftStoreNavContainer isVisible={isVisible} />
    </LeftNavWrapStyled>
  );
};

const LeftNavWrapStyled = styled.div`
  display: flex;
`;

export default LeftNav;

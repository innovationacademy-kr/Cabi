import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentSectionNameState } from "@/recoil/atoms";
import { currentFloorSectionState } from "@/recoil/selectors";
import LeftSectionNav from "@/components/LeftNav/LeftSectionNav/LeftSectionNav";
import useMenu from "@/hooks/useMenu";

const LeftSectionNavContainer = ({ isVisible }: { isVisible: boolean }) => {
  const floorSection = useRecoilValue<Array<string>>(currentFloorSectionState);
  const [currentFloorSection, setCurrentFloorSection] = useRecoilState<string>(
    currentSectionNameState
  );
  const navigator = useNavigate();
  const { pathname } = useLocation();
  const { closeLeftNav } = useMenu();
  const isProfilePage: boolean = location.pathname.includes("profile");

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
    <LeftSectionNav
      pathname={pathname}
      isVisible={isVisible}
      isProfile={isProfilePage}
      currentFloorSection={currentFloorSection}
      floorSection={floorSection}
      onClickSection={onClickSection}
      onClickProfile={onClickProfile}
      onClickLentLogButton={onClickLentLogButton}
      onClickSlack={onClickSlack}
      onClickClubForm={onClickClubForm}
    />
  );
};

export default LeftSectionNavContainer;

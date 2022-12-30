import styled from "styled-components";
import TopNavButton from "@/components/TopNavButton";
import { useSetRecoilState } from "recoil";
import { toggleCabinetInfoState, toggleMapInfoState } from "@/recoil/atoms";

const TopNavButtonsContainer = () => {
  const toggleCabinetInfo = useSetRecoilState(toggleCabinetInfoState);
  const toggleMapInfo = useSetRecoilState(toggleMapInfoState);
  const clickCabinetInfo = () => {
    toggleCabinetInfo((toggle) => !toggle);
    toggleMapInfo(() => false);
  };
  const clickMapInfo = () => {
    toggleMapInfo((toggle) => !toggle);
    toggleCabinetInfo(() => false);
  };
  return (
    <NaviButtonsStyled>
      <TopNavButton
        onClick={clickCabinetInfo}
        imgSrc="src/assets/images/myCabinetIcon.svg"
      />
      <TopNavButton onClick={clickMapInfo} imgSrc="src/assets/images/map.svg" />
    </NaviButtonsStyled>
  );
};
const NaviButtonsStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div:last-child {
    margin-right: 0;
  }
`;

export default TopNavButtonsContainer;

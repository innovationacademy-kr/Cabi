import styled from "styled-components";
import TopNavButton from "@/components/TopNavButton";
import { useRecoilState, useSetRecoilState } from "recoil";
import { toggleCabinetInfoState, toggleMapInfoState } from "@/recoil/atoms";
import useDetailInfo from "@/hooks/useDetailInfo";

const TopNavButtonsContainer = () => {
  const { clickCabinet, clickMap } = useDetailInfo();

  return (
    <NaviButtonsStyled>
      <TopNavButton
        onClick={clickCabinet}
        imgSrc="src/assets/images/myCabinetIcon.svg"
      />
      <TopNavButton onClick={clickMap} imgSrc="src/assets/images/map.svg" />
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

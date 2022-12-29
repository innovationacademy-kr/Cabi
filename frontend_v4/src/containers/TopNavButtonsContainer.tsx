import styled from "styled-components";
import TopNavButton from "@/components/TopNavButton";

const TopNavButtonsContainer = ({ clickCabinetInfo }: any) => {
  return (
    <NaviButtonsStyled>
      <TopNavButton
        onClick={clickCabinetInfo}
        imgSrc="src/assets/images/myCabinetIcon.svg"
      />
      <TopNavButton onClick={() => {}} imgSrc="src/assets/images/map.svg" />
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

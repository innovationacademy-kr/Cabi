import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { currentFloorSectionState } from "@/Cabinet/recoil/selectors";
import CabinetColorTable from "@/Cabinet/components/LeftNav/CabinetColorTable/CabinetColorTable";

const LeftSectionNav = ({
  currentFloorSection,
  onClickSection,
}: {
  currentFloorSection: string;
  onClickSection: (section: string) => void;
}) => {
  const floorSection = useRecoilValue<Array<string>>(currentFloorSectionState);

  return (
    <LeftNavOptionStyled>
      {floorSection.map((section: string, index: number) => (
        <FloorSectionStyled
          className={
            currentFloorSection === section
              ? "leftNavButtonActive cabiButton"
              : "cabiButton"
          }
          key={index}
          onClick={() => onClickSection(section)}
        >
          {section}
        </FloorSectionStyled>
      ))}
      <CabinetColorTable />
    </LeftNavOptionStyled>
  );
};

const LeftNavOptionStyled = styled.div`
  display: block;
  min-width: 240px;
  height: 100%;
  padding: 32px 10px;
  border-right: 1px solid var(--line-color);
  font-weight: 300;
  position: relative;
`;

export const FloorSectionStyled = styled.div`
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-radius: 10px;
  text-indent: 20px;
  color: var(--gray-color);
  margin: 2px 0;
  cursor: pointer;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--main-color);
      color: var(--white);
    }
  }
`;

export default LeftSectionNav;

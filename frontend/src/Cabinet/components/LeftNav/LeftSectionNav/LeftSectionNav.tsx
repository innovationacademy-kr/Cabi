import { useRecoilValue } from "recoil";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { currentSectionNameState } from "@/Cabinet/recoil/atoms";
import { currentFloorSectionState } from "@/Cabinet/recoil/selectors";
import CabinetColorTable from "@/Cabinet/components/LeftNav/CabinetColorTable/CabinetColorTable";
import { ReactComponent as FilledHeartIcon } from "@/Cabinet/assets/images/filledHeart.svg";

const LeftSectionNav = ({ closeLeftNav }: { closeLeftNav: () => void }) => {
  const floorSection = useRecoilValue<Array<string>>(currentFloorSectionState);
  const [currentFloorSection, setCurrentFloorSection] = useRecoilState<string>(
    currentSectionNameState
  );

  console.log(
    "floorSection, currentFloorSection",
    floorSection,
    currentFloorSection
  );
  // TODO : 다 되면 삭제
  return (
    <LeftNavOptionStyled>
      {floorSection.map((section: string, index: number) => {
        console.log("section : ", section);
        return (
          <FloorSectionStyled
            className={
              currentFloorSection === section
                ? "leftNavButtonActive cabiButton"
                : "cabiButton"
            }
            key={index}
            onClick={() => {
              closeLeftNav();
              setCurrentFloorSection(section);
            }}
          >
            {section}
            {/* TODO : 알림 등록권 사용된 섹션이면 FilledHeartIcon */}
            <IconWrapperStyled>
              <FilledHeartIcon />
            </IconWrapperStyled>
          </FloorSectionStyled>
        );
      })}
      <CabinetColorTable />
    </LeftNavOptionStyled>
  );
};

const LeftNavOptionStyled = styled.div`
  font-size: var(--size-base);
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--main-color);
      color: var(--white);
    }
  }
`;

const IconWrapperStyled = styled.div`
  height: 14px;
  width: 14px;
  margin-right: 12px;
  display: flex;

  & > svg {
    height: 14px;
    width: 14px;
  }
`;

export default LeftSectionNav;

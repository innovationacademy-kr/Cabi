import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import {
  currentFloorNumberState,
  currentSectionNameState,
} from "@/Cabinet/recoil/atoms";
import { currentFloorSectionState } from "@/Cabinet/recoil/selectors";
import { DISABLED_FLOOR } from "@/Cabinet/pages/AvailablePage";
import CabinetColorTable from "@/Cabinet/components/LeftNav/CabinetColorTable/CabinetColorTable";
import { clubSectionsData } from "@/Cabinet/assets/data/mapPositionData";
import { ReactComponent as FilledHeartIcon } from "@/Cabinet/assets/images/filledHeart.svg";
import { ReactComponent as LineHeartIcon } from "@/Cabinet/assets/images/lineHeart.svg";
import { ICurrentSectionInfo } from "@/Cabinet/types/dto/cabinet.dto";

const LeftSectionNav = ({ closeLeftNav }: { closeLeftNav: () => void }) => {
  const floorSection = useRecoilValue<Array<ICurrentSectionInfo>>(
    currentFloorSectionState
  );
  const [currentFloorSection, setCurrentFloorSection] = useRecoilState<string>(
    currentSectionNameState
  );
  const currentFloor = useRecoilValue<number>(currentFloorNumberState);
  const { pathname } = useLocation();
  const isAdmin = pathname.includes("admin");

  return (
    <LeftNavOptionStyled>
      {floorSection.map((section: ICurrentSectionInfo, index: number) => {
        const isClubSection = clubSectionsData.find((clubSection) => {
          return clubSection === section.sectionName;
        })
          ? true
          : false;
        return (
          <FloorSectionStyled
            className={
              currentFloorSection === section.sectionName
                ? "leftNavButtonActive cabiButton"
                : "cabiButton"
            }
            key={index}
            onClick={() => {
              closeLeftNav();
              setCurrentFloorSection(section.sectionName);
            }}
          >
            {section.sectionName}
            <IconWrapperStyled>
              {!isAdmin &&
                !isClubSection &&
                !DISABLED_FLOOR.includes(currentFloor.toString()) &&
                (section.alarmRegistered ? (
                  <FilledHeartIcon />
                ) : (
                  <LineHeartIcon />
                ))}
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
  font-size: var(--size-base);
`;

export const FloorSectionStyled = styled.div`
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-radius: 10px;
  text-indent: 20px;
  color: var(--gray-line-btn-color);
  margin: 2px 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--sys-main-color);
      color: var(--white-text-with-bg-color);
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

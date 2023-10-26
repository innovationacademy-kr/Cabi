import styled from "styled-components";
import CabinetColorTable from "@/components/LeftNav/CabinetColorTable/CabinetColorTable";
import { ReactComponent as LinkImg } from "@/assets/images/link.svg";

interface ILeftSectionNav {
  isVisible: boolean;
  onClickSection: Function;
  currentFloorSection: string;
  floorSection: string[];
  isProfile: boolean;
  onClickProfile: Function;
  pathname: string;
  onClickLentLogButton: Function;
  onClickSlack: Function;
  onClickClubForm: Function;
}

const LeftSectionNav = ({
  isVisible,
  currentFloorSection,
  onClickSection,
  floorSection,
  isProfile,
  onClickProfile,
  pathname,
  onClickLentLogButton,
  onClickSlack,
  onClickClubForm,
}: ILeftSectionNav) => {
  return (
    <>
      <LeftNavOptionStyled isVisible={isVisible}>
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

      <ProfileLeftNavOptionStyled isProfile={isProfile}>
        <FloorSectionStyled
          className={
            pathname === "/profile"
              ? "leftNavButtonActive cabiButton"
              : " cabiButton"
          }
          onClick={() => onClickProfile()}
        >
          내 정보
        </FloorSectionStyled>
        <FloorSectionStyled
          className={
            pathname.includes("profile/log")
              ? "leftNavButtonActive cabiButton"
              : " cabiButton"
          }
          onClick={() => onClickLentLogButton()}
        >
          대여 기록
        </FloorSectionStyled>
        <hr />
        <SectionLinkStyled
          onClick={() => onClickSlack()}
          title="슬랙 캐비닛 채널 새창으로 열기"
        >
          문의하기
          <LinkImg stroke="var(--gray-color)" />
        </SectionLinkStyled>
        <SectionLinkStyled
          onClick={() => onClickClubForm()}
          title="동아리 사물함 사용 신청서 새창으로 열기"
        >
          동아리 신청서
          <LinkImg stroke="var(--gray-color)" />
        </SectionLinkStyled>
      </ProfileLeftNavOptionStyled>
    </>
  );
};

const LeftNavOptionStyled = styled.div<{
  isVisible: boolean;
}>`
  display: ${(props) => (props.isVisible ? "block" : "none")};
  min-width: 240px;
  height: 100%;
  padding: 32px 10px;
  border-right: 1px solid var(--line-color);
  font-weight: 300;
  position: relative;
`;

const ProfileLeftNavOptionStyled = styled.div<{
  isProfile: boolean;
}>`
  display: ${(props) => (props.isProfile ? "block" : "none")};
  min-width: 240px;
  height: 100%;
  padding: 32px 10px;
  border-right: 1px solid var(--line-color);
  font-weight: 300;
  position: relative;
  & hr {
    width: 80%;
    height: 1px;
    background-color: #d9d9d9;
    border: 0;
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

const FloorSectionStyled = styled.div`
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

const SectionLinkStyled = styled.div`
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-indent: 20px;
  margin: 2px 0;
  padding-right: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--gray-color);
  & svg {
    width: 15px;
    height: 15px;
    margin-left: auto;
  }
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--main-color);
      svg {
        stroke: var(--main-color);
      }
    }
  }
`;

export default LeftSectionNav;

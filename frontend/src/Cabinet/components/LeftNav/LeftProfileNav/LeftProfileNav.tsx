import styled from "styled-components";
import { ReactComponent as LinkImg } from "@/Cabinet/assets/images/link.svg";
import { FloorSectionStyled } from "../LeftSectionNav/LeftSectionNav";

const LeftProfileNav = ({
  isProfile,
  onClickProfile,
  pathname,
  onClickLentLogButton,
  onClickSlack,
  onClickClubForm,
}: {
  isProfile: boolean;
  onClickProfile: Function;
  pathname: string;
  onClickLentLogButton: Function;
  onClickSlack: Function;
  onClickClubForm: Function;
}) => {
  return (
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
        <LinkImg id="linknImg" stroke="var(--gray-color)" />
      </SectionLinkStyled>
      <SectionLinkStyled
        onClick={() => onClickClubForm()}
        title="동아리 사물함 사용 신청서 새창으로 열기"
      >
        동아리 신청서
        <LinkImg id="linknImg" stroke="var(--gray-color)" />
      </SectionLinkStyled>
    </ProfileLeftNavOptionStyled>
  );
};

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

  #linknImg {
    width: 15px;
    height: 15px;
    margin-left: auto;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--main-color);
    }
    &:hover img {
      filter: invert(33%) sepia(55%) saturate(3554%) hue-rotate(230deg)
        brightness(99%) contrast(107%);
    }
  }
`;

export default LeftProfileNav;

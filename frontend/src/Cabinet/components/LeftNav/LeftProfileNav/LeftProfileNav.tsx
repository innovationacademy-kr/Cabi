import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { FloorSectionStyled } from "@/Cabinet/components/LeftNav/LeftSectionNav/LeftSectionNav";
import { ReactComponent as LinkImg } from "@/Cabinet/assets/images/link.svg";

const LeftProfileNav = ({
  onClickRedirectButton,
}: {
  onClickRedirectButton: (location: string) => void;
}) => {
  const { pathname } = useLocation();

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
    <ProfileLeftNavOptionStyled>
      <FloorSectionStyled
        className={
          pathname === "/profile"
            ? "leftNavButtonActive cabiButton"
            : " cabiButton"
        }
        onClick={() => onClickRedirectButton("profile")}
      >
        내 정보
      </FloorSectionStyled>
      <FloorSectionStyled
        className={
          pathname.includes("profile/log")
            ? "leftNavButtonActive cabiButton"
            : " cabiButton"
        }
        onClick={() => onClickRedirectButton("profile/log")}
      >
        대여 기록
      </FloorSectionStyled>
      <hr />
      <SectionLinkStyled
        onClick={() => onClickSlack()}
        title="슬랙 캐비닛 채널 새창으로 열기"
      >
        문의하기
        <LinkImg id="linknImg" stroke="var(--gray-line-btn-color)" />
      </SectionLinkStyled>
      <SectionLinkStyled
        onClick={() => onClickClubForm()}
        title="동아리 사물함 사용 신청서 새창으로 열기"
      >
        동아리 신청서
        <LinkImg id="linknImg" stroke="var(--gray-line-btn-color)" />
      </SectionLinkStyled>
    </ProfileLeftNavOptionStyled>
  );
};

const ProfileLeftNavOptionStyled = styled.div`
  display: block;
  min-width: 240px;
  height: 100%;
  padding: 32px 10px;
  border-right: 1px solid var(--line-color);
  font-weight: 300;
  font-size: var(--size-base);
  position: relative;
  & hr {
    width: 80%;
    height: 1px;
    background-color: var(--inventory-item-title-border-btm-color);
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
  color: var(--gray-line-btn-color);

  #linknImg {
    width: 15px;
    height: 15px;
    margin-left: auto;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--sys-main-color);
    }
    &:hover img {
      filter: invert(33%) sepia(55%) saturate(3554%) hue-rotate(230deg)
        brightness(99%) contrast(107%);
    }
  }
`;

export default LeftProfileNav;

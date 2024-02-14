import { useRecoilValue } from "recoil";
import styled, { css } from "styled-components";
import { targetClubUserInfoState, userState } from "@/recoil/atoms";
import {
  ICurrentClubMemberModalStateInfo,
  TClubMemberModalState,
} from "@/components/Club/ClubMemberList/ClubMemberList.container";
import ClubMemberListItem from "@/components/Club/ClubMemberList/ClubMemberListItem/ClubMemberListItem";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import AddClubMemberModalContainer from "@/components/Modals/ClubModal/AddClubMemberModal.container";
import { ClubUserResponseDto } from "@/types/dto/club.dto";

interface ClubMemberListProps {
  isLoading: boolean;
  clubUserCount: number;
  clubModal: ICurrentClubMemberModalStateInfo;
  openModal: (modalName: TClubMemberModalState) => void;
  closeModal: () => void;
  master: ClubUserResponseDto;
  moreButton: boolean;
  clickMoreButton: () => void;
  members: ClubUserResponseDto[];
  selectClubMemberOnClick: (member: ClubUserResponseDto) => void;
}

const ClubMemberList = ({
  isLoading,
  clubUserCount,
  clubModal,
  openModal,
  closeModal,
  master,
  moreButton,
  clickMoreButton,
  members,
  selectClubMemberOnClick,
}: ClubMemberListProps) => {
  const myInfo = useRecoilValue(userState);
  const targetClubUser = useRecoilValue(targetClubUserInfoState);

  return (
    <>
      <ClubMemberListContainerStyled>
        <TitleContainerStyled>
          <p>동아리 멤버</p>
          <UserCountContainerStyled>
            <UserCountImgStyled src={"/src/assets/images/shareIcon.svg"} />
            <UserCountTextStyled id="membersLength">
              {clubUserCount}
            </UserCountTextStyled>
          </UserCountContainerStyled>
        </TitleContainerStyled>
        <MemberSectionStyled>
          {myInfo.name === master.userName && (
            <AddMemberCardStyled onClick={() => openModal("addModal")}>
              <p>+</p>
            </AddMemberCardStyled>
          )}
          {/* NOTE:  동아리장이 맨 앞에 오도록 배치 */}
          <ClubMemberListItem
            isMaster={true}
            bgColor={"var(--main-color)"}
            member={master}
            selectClubMemberOnClick={selectClubMemberOnClick}
            targetClubUser={targetClubUser}
          />
          {members?.map((member, idx) => (
            <ClubMemberListItem
              key={`clubMember-${idx}`}
              member={member}
              selectClubMemberOnClick={selectClubMemberOnClick}
              targetClubUser={targetClubUser}
            />
          ))}
        </MemberSectionStyled>
        {moreButton && (
          <ButtonContainerStyled>
            <MoreButtonStyled onClick={clickMoreButton} isLoading={isLoading}>
              {isLoading ? <LoadingAnimation /> : "더보기"}
            </MoreButtonStyled>
          </ButtonContainerStyled>
        )}
      </ClubMemberListContainerStyled>
      {clubModal.addModal && (
        <AddClubMemberModalContainer closeModal={() => closeModal()} />
      )}
    </>
  );
};

const ClubMemberListContainerStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TitleContainerStyled = styled.div`
  width: 80%;
  max-width: 720px;
  display: flex;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const UserCountContainerStyled = styled.div`
  margin-left: 18px;
  line-height: 24px;
  height: 24px;
  font-size: 1rem;
  font-weight: normal;
  display: flex;
`;

const UserCountTextStyled = styled.p`
  width: 34px;
`;

const MemberSectionStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 90px);
  grid-template-rows: repeat(auto-fill, 90px);
  justify-content: center;
  width: 100%;
  max-width: 720px;
  margin: 1rem 0 1rem;
`;

const UserCountImgStyled = styled.img`
  width: 24px;
  height: 24px;
`;

const AddMemberCardStyled = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 1rem;
  margin: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23333' stroke-width='1' stroke-dasharray='6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  transition: transform 0.2s, opacity 0.2s;
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.9;
      transform: scale(1.05);
    }
  }

  & > p {
    font-size: 26px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const ButtonContainerStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MoreButtonStyled = styled.button<{
  isLoading: boolean;
}>`
  width: 200px;
  height: 50px;
  margin: 20px auto;
  border: 1px solid var(--main-color);
  border-radius: 30px;
  text-indent: -20px;
  background-color: var(--white);
  color: var(--main-color);
  position: relative;

  ${({ isLoading }) =>
    !isLoading &&
    css`
      &::after {
        content: "";
        position: absolute;
        left: 55%;
        top: 50%;
        transform: translateY(-40%);
        width: 20px;
        height: 20px;
        background: url(/src/assets/images/selectPurple.svg) no-repeat 100%;
      }
    `}
`;

export default ClubMemberList;

import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { targetClubUserInfoState, userState } from "@/recoil/atoms";
import ClubMemberList from "@/components/Club/ClubMemberList/ClubMemberList";
import { ClubInfoResponseDto, ClubUserResponseDto } from "@/types/dto/club.dto";
import useMenu from "@/hooks/useMenu";

export type TClubMemberModalState = "addModal";

export interface ICurrentClubMemberModalStateInfo {
  addModal: boolean;
}

interface ClubMemberListContainerProps {
  clubInfo: ClubInfoResponseDto;
  page: number;
  setPage: (page: number) => void;
}

const ClubMemberListContainer = ({
  clubInfo,
  page,
  setPage,
}: ClubMemberListContainerProps) => {
  const [moreButton, setMoreButton] = useState<boolean>(true);
  const [members, setMembers] = useState<ClubUserResponseDto[]>([]);
  const [clubModal, setClubModal] = useState<ICurrentClubMemberModalStateInfo>({
    addModal: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { openClubMember, closeClubMember } = useMenu();
  const [targetClubUser, setTargetClubUser] = useRecoilState(
    targetClubUserInfoState
  );

  const clickMoreButton = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPage(page + 1);
    }, 100);
  };

  const selectClubMemberOnClick = (member: ClubUserResponseDto) => {
    if (targetClubUser.userId === member.userId) {
      closeClubMember();
      return;
    }
    setTargetClubUser(member);
    openClubMember();
  };

  const openModal = (modalName: TClubMemberModalState) => {
    setClubModal({
      ...clubModal,
      [modalName]: true,
    });
  };

  const closeModal = () => {
    setClubModal({
      ...clubModal,
      addModal: false,
    });
  };

  useEffect(() => {
    if (page === 0) {
      setMembers(clubInfo.clubUsers);
    } else {
      setMembers((prev) => {
        return [...prev, ...clubInfo.clubUsers];
      });
      setIsLoading(false);
    }
  }, [clubInfo]);

  useEffect(() => {
    const displayedMembersCount =
      members.length +
      (members.some((member) => member.userId === clubInfo.clubMaster.userId)
        ? 0
        : 1);

    setMoreButton(displayedMembersCount < clubInfo.clubUserCount);
  }, [members, clubInfo.clubUserCount, clubInfo.clubMaster]);

  const filteredMembers = members.filter(
    (member) => member.userId !== clubInfo.clubMaster.userId
  );

  return (
    <ClubMemberList
      isLoading={isLoading}
      clubUserCount={clubInfo.clubUserCount}
      clubModal={clubModal}
      openModal={openModal}
      closeModal={closeModal}
      master={clubInfo.clubMaster}
      moreButton={moreButton}
      clickMoreButton={clickMoreButton}
      members={filteredMembers}
      selectClubMemberOnClick={selectClubMemberOnClick}
    />
  );
};

export default ClubMemberListContainer;

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
  const myInfo = useRecoilValue(userState);
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
    if (clubInfo.clubUserCount) {
      if (
        members!.length +
          (clubInfo.clubMaster.userName !== myInfo.name ? 1 : 0) >=
        clubInfo.clubUserCount
      ) {
        setMoreButton(false);
      } else {
        setMoreButton(true);
      }
    }
  }, [members]);

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
      members={members}
      selectClubMemberOnClick={selectClubMemberOnClick}
    />
  );
};

export default ClubMemberListContainer;

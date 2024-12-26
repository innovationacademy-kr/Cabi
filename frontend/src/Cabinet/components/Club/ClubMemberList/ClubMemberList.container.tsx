import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { targetClubUserInfoState } from "@/Cabinet/recoil/atoms";
import ClubMemberList from "@/Cabinet/components/Club/ClubMemberList/ClubMemberList";
import {
  ClubInfoResponseDto,
  ClubUserResponseDto,
} from "@/Cabinet/types/dto/club.dto";
import useDebounce from "@/Cabinet/hooks/useDebounce";
import useMenu from "@/Cabinet/hooks/useMenu";

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
  const { debounce } = useDebounce();
  const clickMoreButton = () => {
    setIsLoading(true);
    debounce(
      "clubMemberList",
      () => {
        setPage(page + 1);
      },
      300
    );
  };

  const selectClubMemberOnClick = (member: ClubUserResponseDto) => {
    if (targetClubUser.userId === member.userId) {
      closeClubMember();
      setTargetClubUser({
        userId: 0,
        userName: "",
      });
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

  const sortMembers = filteredMembers.sort((a, b) =>
    b.userName < a.userName ? 1 : -1
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
      members={sortMembers}
      selectClubMemberOnClick={selectClubMemberOnClick}
    />
  );
};

export default ClubMemberListContainer;

import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  targetClubCabinetInfoState,
  targetClubUserInfoState,
  userState,
} from "@/recoil/atoms";
import ClubMember from "@/components/Club/ClubMember";
import { ClubInfoResponseDto, ClubUserResponseDto } from "@/types/dto/club.dto";
import useMenu from "@/hooks/useMenu";

export type TClubMemberModalState = "addModal";

export interface ICurrentClubMemberModalStateInfo {
  addModal: boolean;
}

interface ClubMemberContainerProps {
  clubInfo: ClubInfoResponseDto;
  page: number;
  setPage: (page: number) => void;
}

const ClubMemberContainer = ({
  clubInfo,
  page,
  setPage,
}: ClubMemberContainerProps) => {
  const [moreButton, setMoreButton] = useState<boolean>(true);
  const [members, setMembers] = useState<ClubUserResponseDto[]>([]);
  const [clubModal, setClubModal] = useState<ICurrentClubMemberModalStateInfo>({
    addModal: false,
  });
  const { toggleClubMember } = useMenu();
  const myInfo = useRecoilValue(userState);
  const setTargetClubUser = useSetRecoilState(targetClubUserInfoState);
  const setTargetClubCabinet = useSetRecoilState(targetClubCabinetInfoState);

  const clickMoreButton = () => {
    setPage(page + 1);
  };

  const selectClubMemberOnClick = (member: ClubUserResponseDto) => {
    setTargetClubCabinet({
      building: clubInfo.building,
      floor: clubInfo.floor,
      section: clubInfo.section,
      visibleNum: clubInfo.visibleNum,
    });
    setTargetClubUser(member);
    toggleClubMember();
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
    <ClubMember
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

export default ClubMemberContainer;
